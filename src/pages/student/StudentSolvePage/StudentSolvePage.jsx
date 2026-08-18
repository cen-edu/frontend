import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getAuth } from '../../../api/auth/authStorage.js';
import { MathText } from '../../../components/common/worksheets';
import Header from '../../../components/Header/Header';
import { difficultyLabels, formatLabels } from '../../../mocks/labels';
import {
    useSaveStudentItemMutation,
    useStudentAssignmentQuery,
    useStudentAssignmentsQuery,
    useSubmitStudentAssignmentMutation,
    useUploadStudentAnswerImageMutation,
} from '../studentAssignmentHooks.js';
import { adaptWorksheetItem, getSavedAnswers } from '../studentWorksheetAdapters.js';
import HandwritingAnswer from './HandwritingAnswer';
import PracticeLearningView from './PracticeLearningView';
import { createHandwritingImage, saveHandwriting } from './handwritingStorage.js';
import './StudentSolvePage.scss';

const hasAnswer = (answer) => Boolean(
    answer?.selectedChoiceId != null || answer?.rawLatex || answer?.hasHandwriting,
);

function StudentSolvePage() {
    const navigate = useNavigate();
    const { assignmentId } = useParams();
    const [searchParams] = useSearchParams();
    const assignmentStudentId = Number(assignmentId);
    const studentQuery = searchParams.get('student');
    const querySuffix = studentQuery ? `?student=${encodeURIComponent(studentQuery)}` : '';
    const auth = getAuth();
    const studentName = auth?.name ?? '학생';
    const studentKey = auth?.userId ?? 'student';
    const { data: detail, isPending, error } = useStudentAssignmentQuery(assignmentStudentId);
    const { data: assignmentList = [] } = useStudentAssignmentsQuery();
    const saveMutation = useSaveStudentItemMutation();
    const submitMutation = useSubmitStudentAssignmentMutation();
    const uploadMutation = useUploadStudentAnswerImageMutation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answersByItem, setAnswersByItem] = useState({});
    const [bookmarked, setBookmarked] = useState([]);
    const [actionError, setActionError] = useState(null);
    const draftsRef = useRef({});
    const initializedAssignmentRef = useRef(null);
    const enteredAtRef = useRef(Date.now());

    const assignment = assignmentList.find((item) => item.assignmentStudentId === assignmentStudentId);
    const problems = useMemo(() => detail?.items.map(adaptWorksheetItem) ?? [], [detail]);
    const problem = problems[currentIndex];
    const isAssessment = detail?.type === 'assessment';
    const isCustom = detail?.origin === 'custom';
    const isSaving = saveMutation.isPending || uploadMutation.isPending;

    useEffect(() => {
        if (!detail || initializedAssignmentRef.current === detail.assignmentStudentId) return;
        setAnswersByItem(getSavedAnswers(detail.items));
        const firstIncompleteIndex = detail.items.findIndex((item) => (
            !item.answerUnits.some((unit) => hasAnswer(unit.saved))
        ));
        setCurrentIndex(firstIncompleteIndex < 0 ? 0 : firstIncompleteIndex);
        initializedAssignmentRef.current = detail.assignmentStudentId;
        enteredAtRef.current = Date.now();
    }, [detail]);

    const itemAnswers = problem ? answersByItem[problem.worksheetItemId] ?? {} : {};
    const doneUnits = assignment?.doneUnits ?? 0;
    const totalUnits = assignment?.totalUnits ?? (isAssessment
        ? problems.length
        : detail?.items.reduce((total, item) => total + item.answerUnits.length, 0) ?? 0);
    const progress = totalUnits ? Math.round((doneUnits / totalUnits) * 100) : 0;

    const updateUnitAnswer = (answerUnitId, changes) => {
        setAnswersByItem((current) => ({
            ...current,
            [problem.worksheetItemId]: {
                ...current[problem.worksheetItemId],
                [answerUnitId]: {
                    answerUnitId,
                    selectedChoiceId: null,
                    rawLatex: null,
                    hasHandwriting: false,
                    ...current[problem.worksheetItemId]?.[answerUnitId],
                    ...changes,
                },
            },
        }));
    };

    const handleStrokesChange = (answerUnitId, storageKey, strokes) => {
        draftsRef.current[answerUnitId] = { storageKey, strokes };
        updateUnitAnswer(answerUnitId, { hasHandwriting: strokes.length > 0 });
    };

    const saveCurrentItem = async () => {
        if (!problem) return;
        setActionError(null);
        const answers = problem.answerUnits
            .map((unit) => itemAnswers[unit.answerUnitId] ?? {
                answerUnitId: unit.answerUnitId,
                selectedChoiceId: null,
                rawLatex: null,
                hasHandwriting: false,
            })
            .filter(hasAnswer);

        try {
            await Promise.all(answers.map(async (answer) => {
                const draft = draftsRef.current[answer.answerUnitId];
                if (!draft?.strokes.length) return;
                await saveHandwriting(draft.storageKey, draft.strokes);
                const file = await createHandwritingImage(draft.strokes, { height: isAssessment ? 520 : 260 });
                await uploadMutation.mutateAsync({ assignmentStudentId, answerUnitId: answer.answerUnitId, file });
            }));

            await saveMutation.mutateAsync({
                assignmentStudentId,
                worksheetItemId: problem.worksheetItemId,
                timeSpentSeconds: Math.max(0, Math.round((Date.now() - enteredAtRef.current) / 1000)),
                answers: answers.map(({ answerUnitId, selectedChoiceId, rawLatex, hasHandwriting }) => ({
                    answerUnitId, selectedChoiceId, rawLatex, hasHandwriting,
                })),
            });
            answers.forEach((answer) => delete draftsRef.current[answer.answerUnitId]);
            enteredAtRef.current = Date.now();
        } catch (saveError) {
            setActionError(saveError.message || '답안을 저장하지 못했습니다.');
            throw saveError;
        }
    };

    const moveToProblem = async (index) => {
        if (index === currentIndex || isSaving) return;
        try {
            await saveCurrentItem();
            setCurrentIndex(index);
            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        } catch {
            // 저장 오류를 표시하고 현재 문항에 머문다.
        }
    };

    const handleSubmit = async () => {
        if (!window.confirm('미응답 문항이 있어도 제출되며, 제출 후에는 답안을 수정할 수 없습니다. 제출할까요?')) return;
        setActionError(null);
        try {
            await saveCurrentItem();
            await submitMutation.mutateAsync(assignmentStudentId);
            navigate(`/student/worksheets${querySuffix}`, { replace: true });
        } catch (submitError) {
            setActionError(submitError.message || '학습지를 제출하지 못했습니다.');
        }
    };

    const toggleBookmark = () => setBookmarked((current) => current.includes(problem.no)
        ? current.filter((number) => number !== problem.no)
        : [...current, problem.no]);

    const renderAnswer = () => {
        if (problem.format === 'choice') {
            const answerUnitId = problem.answerUnits[0].answerUnitId;
            const selectedChoiceId = itemAnswers[answerUnitId]?.selectedChoiceId;
            return <div className="student-solve__choices" aria-label="답 선택">{problem.choices.map((choice) => (
                <button key={choice.id} type="button" aria-pressed={selectedChoiceId === choice.id} className={selectedChoiceId === choice.id ? 'student-solve__choice student-solve__choice--selected' : 'student-solve__choice'} onClick={() => updateUnitAnswer(answerUnitId, { selectedChoiceId: choice.id, hasHandwriting: false })}><MathText>{choice.text}</MathText></button>
            ))}</div>;
        }

        const answerUnitId = problem.answerUnits[0].answerUnitId;
        const storageKey = `${studentKey}:${assignmentStudentId}:${problem.worksheetItemId}:${answerUnitId}`;
        return <HandwritingAnswer key={storageKey} storageKey={storageKey} serverHasAnswer={itemAnswers[answerUnitId]?.hasHandwriting} onAnswerChange={(hasHandwriting) => updateUnitAnswer(answerUnitId, { hasHandwriting })} onStrokesChange={(strokes) => handleStrokesChange(answerUnitId, storageKey, strokes)} />;
    };

    if (isPending || !detail) {
        return <div className="student-solve"><Header mode="student" userName={studentName} /><main className="student-solve__main" aria-live="polite">{error?.message ?? '학습지를 불러오는 중입니다.'}</main></div>;
    }
    if (!problem) {
        return <div className="student-solve"><Header mode="student" userName={studentName} /><main className="student-solve__main" role="alert">풀이할 문항이 없습니다.</main></div>;
    }
    if (detail.status === 'submitted') {
        return <div className="student-solve"><Header mode="student" userName={studentName} /><main className="student-solve__main"><section className="student-solve__submitted-notice"><h1>이미 제출한 학습지입니다.</h1><p>제출한 답안은 수정할 수 없습니다.</p><button type="button" onClick={() => navigate(`/student/worksheets/${assignmentStudentId}/review${querySuffix}`, { replace: true })}>채점 결과 확인</button></section></main></div>;
    }

    return (
        <div className="student-solve">
            <Header mode="student" userName={studentName} />
            <main className="student-solve__main">
                <header className="student-solve__worksheet-header">
                    <button type="button" className="student-solve__back" onClick={() => navigate(`/student${querySuffix}`)}><i className="bi bi-chevron-left" aria-hidden="true" /> 학습지 나가기</button>
                    <div className="student-solve__title-group"><h1>{detail.title}</h1></div>
                    <button type="button" className="student-solve__submit" disabled={isSaving || submitMutation.isPending} onClick={handleSubmit}>{submitMutation.isPending ? '제출 중' : '학습 제출'}</button>
                </header>
                <div className="student-solve__progress" aria-label={`전체 진행률 ${progress}%`}><div><span style={{ width: `${progress}%` }} /></div><strong>{isAssessment ? `${doneUnits}/${totalUnits}문항 완료` : `풀이 과정 ${doneUnits}/${totalUnits}개 완료`}</strong></div>
                {actionError && <p className="student-solve__action-error" role="alert">{actionError}</p>}

                {!isAssessment ? (
                    <PracticeLearningView assignment={detail} studentName={studentName} studentKey={studentKey} problem={problem} currentIndex={currentIndex} problemCount={problems.length} onPrevious={() => moveToProblem(currentIndex - 1)} onNext={() => moveToProblem(currentIndex + 1)} onStepAnswerChange={(answerUnitId, hasHandwriting) => updateUnitAnswer(answerUnitId, { hasHandwriting })} onStrokesChange={handleStrokesChange} answers={itemAnswers} isSaving={isSaving} isCustom={isCustom} />
                ) : <div className="student-solve__workspace">
                    <aside className="student-solve__navigator" aria-label="문항 바로가기">
                        <div className="student-solve__navigator-heading"><strong>문항</strong><span>{problems.length}개</span></div>
                        <div className="student-solve__question-grid">{problems.map((item, index) => {
                            const answered = Object.values(answersByItem[item.worksheetItemId] ?? {}).some(hasAnswer);
                            return <button key={item.worksheetItemId} type="button" aria-label={`${item.no}번${answered ? ', 답변 완료' : ''}`} aria-current={currentIndex === index ? 'step' : undefined} className={`${answered ? 'student-solve__question-number student-solve__question-number--answered' : 'student-solve__question-number'}${currentIndex === index ? ' student-solve__question-number--current' : ''}`} onClick={() => moveToProblem(index)}>{item.no}{bookmarked.includes(item.no) && <i className="bi bi-bookmark-fill" aria-hidden="true" />}</button>;
                        })}</div>
                        <div className="student-solve__legend"><span><i className="student-solve__legend-dot student-solve__legend-dot--answered" />완료</span><span><i className="student-solve__legend-dot" />미완료</span></div>
                    </aside>
                    <section className="student-solve__problem" aria-labelledby="current-problem-title">
                        <div className="student-solve__problem-topline"><div><span className="student-solve__number">{problem.no}</span><span className="student-solve__difficulty">난이도 {difficultyLabels[problem.difficulty]}</span><span className="student-solve__format">{formatLabels[problem.format]} · {problem.maxScore}점</span></div><button type="button" aria-pressed={bookmarked.includes(problem.no)} className={bookmarked.includes(problem.no) ? 'student-solve__bookmark student-solve__bookmark--active' : 'student-solve__bookmark'} onClick={toggleBookmark}><i className={`bi bi-bookmark${bookmarked.includes(problem.no) ? '-fill' : ''}`} aria-hidden="true" /> 나중에 보기</button></div>
                        <div className="student-solve__question-copy"><h2 id="current-problem-title"><MathText>{problem.prompt}</MathText></h2>{problem.subPrompt && <p><MathText>{problem.subPrompt}</MathText></p>}</div>
                        {problem.contentBlocks.filter((block) => block.asset?.url).map((block) => <img key={block.blockId} src={block.asset.url} alt={block.asset.altText} />)}
                        <div className="student-solve__answer-area"><h3>답 입력</h3>{renderAnswer()}</div>
                        <footer className="student-solve__controls"><button type="button" disabled={currentIndex === 0 || isSaving} onClick={() => moveToProblem(currentIndex - 1)}><i className="bi bi-chevron-left" aria-hidden="true" /> 이전 문제</button><span>{problem.no} / {problems.length}</span><button type="button" disabled={currentIndex === problems.length - 1 || isSaving} className="student-solve__next" onClick={() => moveToProblem(currentIndex + 1)}>다음 문제 <i className="bi bi-chevron-right" aria-hidden="true" /></button></footer>
                    </section>
                </div>}
            </main>
        </div>
    );
}

export default StudentSolvePage;
