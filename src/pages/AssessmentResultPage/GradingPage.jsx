import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getAssessmentResults, saveAssessmentResults } from '../../mocks/assessmentResult';
import { formatLabels } from '../../mocks/assessmentCreation';
import GradingQuestionList from './components/GradingQuestionList';
import GradingAnswerCard from './components/GradingAnswerCard';
import GradingRubricPanel from './components/GradingRubricPanel';
import './GradingPage.scss';
import './components/AssessmentResultComponents.scss';

const deriveRubricChecks = (answer, question) => {
    if (answer?.rubricChecks?.length === question.rubric.length) return answer.rubricChecks;
    let accumulated = 0;
    return question.rubric.map((item) => { accumulated += item.score; return (answer?.score ?? 0) >= accumulated; });
};

function GradingPage() {
    const navigate = useNavigate();
    const { worksheetId } = useParams();
    const [searchParams] = useSearchParams();
    const [results, setResults] = useState(getAssessmentResults);
    const worksheet = results.find((item) => item.id === worksheetId);
    const requestedQuestion = Number(searchParams.get('question'));
    const initialQuestion = worksheet?.questions.find((question) => question.no === requestedQuestion)?.no ?? worksheet?.questions.find((question) => question.gradingStatus !== 'auto')?.no ?? worksheet?.questions[0]?.no;
    const [questionNo, setQuestionNo] = useState(initialQuestion);
    const question = worksheet?.questions.find((item) => item.no === questionNo);
    const requestedStudent = Number(searchParams.get('student'));
    const initialIndex = worksheet?.students.findIndex((student) => student.id === requestedStudent);
    const firstPendingIndex = worksheet?.students.findIndex((student) => student.answers.find((answer) => answer.no === initialQuestion)?.score === null);
    const [studentIndex, setStudentIndex] = useState(initialIndex >= 0 ? initialIndex : Math.max(firstPendingIndex ?? 0, 0));
    const activeCardRef = useRef(null);

    useEffect(() => { activeCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, [questionNo, studentIndex]);

    const rubricChecks = useMemo(() => {
        if (!worksheet || !question) return [];
        const answer = worksheet.students[studentIndex]?.answers.find((item) => item.no === questionNo);
        return deriveRubricChecks(answer, question);
    }, [question, questionNo, studentIndex, worksheet]);

    const moveTo = (index) => setStudentIndex(Math.min(Math.max(index, 0), (worksheet?.students.length ?? 1) - 1));
    const moveNext = (fromIndex = studentIndex) => moveTo(fromIndex + 1);
    const selectQuestion = (nextQuestionNo) => {
        const pendingIndex = worksheet.students.findIndex((student) => student.answers.find((answer) => answer.no === nextQuestionNo)?.score === null);
        setQuestionNo(nextQuestionNo); setStudentIndex(pendingIndex >= 0 ? pendingIndex : 0);
    };
    const updateScore = (targetStudentIndex, score, shouldAdvance = false, selectedRubricChecks) => {
        setResults((current) => {
            const next = current.map((item) => {
                if (item.id !== worksheet.id) return item;
                const nextStudents = item.students.map((student, index) => index !== targetStudentIndex ? student : { ...student, answers: student.answers.map((answer) => answer.no !== questionNo ? answer : { ...answer, score, gradedBy: 'teacher', rubricChecks: selectedRubricChecks ?? deriveRubricChecks({ score }, question) }) });
                const allComplete = nextStudents.every((student) => student.answers.every((answer) => answer.score !== null));
                return { ...item, students: nextStudents, status: allComplete ? (item.status === 'confirmed' ? 'confirmed' : 'graded') : 'grading', modified: item.status === 'confirmed' ? true : item.modified };
            });
            saveAssessmentResults(next);
            return next;
        });
        if (shouldAdvance) window.setTimeout(() => moveNext(targetStudentIndex), 80);
    };
    const toggleRubric = (targetStudentIndex, rubricIndex) => {
        const targetAnswer = worksheet.students[targetStudentIndex].answers.find((answer) => answer.no === questionNo);
        const targetChecks = deriveRubricChecks(targetAnswer, question);
        const nextChecks = targetChecks.map((checked, index) => index === rubricIndex ? !checked : checked);
        const score = question.rubric.reduce((sum, item, index) => sum + (nextChecks[index] ? item.score : 0), 0);
        updateScore(targetStudentIndex, score, false, nextChecks);
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (!question) return;
            if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLButtonElement) return;
            const numeric = Number(event.key);
            if (/^[0-9]$/.test(event.key) && numeric <= question.maxScore) { event.preventDefault(); updateScore(studentIndex, numeric, true); }
            if (event.key === 'Enter') { event.preventDefault(); moveNext(); }
            if (event.key === 'ArrowLeft') { event.preventDefault(); moveTo(studentIndex - 1); }
            if (event.key === 'ArrowRight') { event.preventDefault(); moveNext(); }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    });

    if (!worksheet || !question) {
        return <main className="grading-page grading-page--missing"><div><p>채점할 학습지를 찾을 수 없습니다.</p><button type="button" onClick={() => navigate('/learning/results')}>평가 결과로 돌아가기</button></div></main>;
    }

    const gradedCount = worksheet.students.filter((student) => student.answers.find((answer) => answer.no === questionNo)?.score !== null).length;

    return (
        <main className="grading-page">
            <header className="grading-page__header">
                <button type="button" className="grading-page__back" aria-label="평가 결과로 돌아가기" onClick={() => navigate('/learning/results')}><i className="bi bi-chevron-left" /></button>
                <div><strong>{worksheet.title}</strong><span>{worksheet.className}</span></div>
                <div className="grading-page__progress"><span>채점</span><strong>{gradedCount}/{worksheet.students.length}</strong><div><i style={{ width: `${(gradedCount / worksheet.students.length) * 100}%` }} /></div></div>
                <button type="button" className="grading-page__save" onClick={() => navigate('/learning/results')}><i className="bi bi-check2" aria-hidden="true" /> 저장하고 나가기</button>
            </header>
            <div className="grading-page__workspace">
                <GradingQuestionList questions={worksheet.questions} students={worksheet.students} selectedNo={questionNo} onSelect={selectQuestion} />
                <section className="grading-page__answers" aria-label={`${questionNo}번 답안 채점`}>
                    <div className="grading-page__question-title"><div><span>{questionNo}번</span><strong>{formatLabels[question.format]}</strong></div><em>{question.maxScore}점</em></div>
                    <div className="grading-page__answer-list">
                        {worksheet.students.map((student, index) => {
                            const answer = student.answers.find((item) => item.no === questionNo);
                            return <GradingAnswerCard key={student.id} ref={index === studentIndex ? activeCardRef : null} student={student} answer={answer} question={question} active={index === studentIndex} rubricChecks={index === studentIndex ? rubricChecks : deriveRubricChecks(answer, question)} onActivate={() => setStudentIndex(index)} onScore={(score) => updateScore(index, score, true)} onRubric={(rubricIndex) => { setStudentIndex(index); toggleRubric(index, rubricIndex); }} />;
                        })}
                    </div>
                    <nav className="grading-page__navigation" aria-label="답안 이동"><button type="button" disabled={studentIndex === 0} onClick={() => moveTo(studentIndex - 1)}><i className="bi bi-chevron-left" /> 이전</button><span>{studentIndex + 1} / {worksheet.students.length}</span><button type="button" disabled={studentIndex === worksheet.students.length - 1} onClick={() => moveNext()}>다음 <i className="bi bi-chevron-right" /></button></nav>
                </section>
                <GradingRubricPanel question={question} />
            </div>
        </main>
    );
}

export default GradingPage;
