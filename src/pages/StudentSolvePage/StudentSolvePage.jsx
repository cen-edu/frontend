import { useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { getStudentAssignments } from '../../mocks/studentAssignments';
import { getStudentCustomProblems, getStudentPracticeProblems, getStudentWorksheetProblems } from '../../mocks/studentWorksheetSolving';
import students from '../../mocks/students';
import HandwritingAnswer from './HandwritingAnswer';
import PracticeLearningView from './PracticeLearningView';
import './StudentSolvePage.scss';

function StudentSolvePage() {
    const navigate = useNavigate();
    const { assignmentId } = useParams();
    const [searchParams] = useSearchParams();
    const requestedStudentId = Number(searchParams.get('student'));
    const student = students.find((item) => item.id === requestedStudentId) ?? students[0];
    const assignment = useMemo(
        () => getStudentAssignments(student.id).find((item) => item.id === assignmentId)
            ?? getStudentAssignments(student.id)[0],
        [assignmentId, student.id],
    );
    const isAssessment = assignment.type === 'assessment';
    const isCustom = assignment.origin === 'custom';
    const problems = useMemo(
        () => {
            if (isAssessment) return getStudentWorksheetProblems(assignment.id);
            if (isCustom) return getStudentCustomProblems(assignment.id);
            return getStudentPracticeProblems(assignment.id);
        },
        [assignment.id, isAssessment, isCustom],
    );
    const initialIndex = isAssessment && assignment.status === 'in-progress'
        ? Math.min(assignment.doneUnits, problems.length - 1)
        : 0;
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [answers, setAnswers] = useState(() => Object.fromEntries(
        Array.from({ length: isAssessment ? Math.min(assignment.doneUnits, problems.length) : 0 }, (_, index) => [index, 'answered']),
    ));
    const [bookmarked, setBookmarked] = useState([]);
    const [practiceAnswers, setPracticeAnswers] = useState({});
    const problem = problems[currentIndex];
    const answeredCount = Object.keys(answers).length;
    const practiceStepCount = problems.reduce((total, item) => total + (item.steps?.length ?? 0), 0);
    const completedPracticeStepCount = Object.values(practiceAnswers).filter(Boolean).length;
    const progress = isAssessment
        ? Math.round((answeredCount / problems.length) * 100)
        : Math.round((completedPracticeStepCount / practiceStepCount) * 100);

    const moveToProblem = (index) => {
        setCurrentIndex(index);
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    };

    const moveByProblem = (offset) => {
        setCurrentIndex((index) => index + offset);
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    };

    const updateAnswer = (value) => {
        setAnswers((current) => {
            const next = { ...current };
            if (value && (typeof value !== 'object' || Object.values(value).some(Boolean))) next[currentIndex] = value;
            else delete next[currentIndex];
            return next;
        });
    };

    const toggleBookmark = () => setBookmarked((current) => current.includes(problem.no)
        ? current.filter((number) => number !== problem.no)
        : [...current, problem.no]);

    const updatePracticeAnswer = (stepId, hasAnswer) => {
        const key = `${problem.id}:${stepId}`;
        setPracticeAnswers((current) => ({ ...current, [key]: hasAnswer }));
    };

    const renderAnswer = () => {
        if (problem.type === 'choice') {
            const selected = Array.isArray(answers[currentIndex]) ? answers[currentIndex] : [];
            return (
                <div className="student-solve__choices" aria-label="답 선택">
                    {problem.choices.map((choice) => (
                        <button
                            key={choice}
                            type="button"
                            aria-pressed={selected.includes(choice)}
                            className={selected.includes(choice) ? 'student-solve__choice student-solve__choice--selected' : 'student-solve__choice'}
                            onClick={() => updateAnswer(selected.includes(choice)
                                ? selected.filter((item) => item !== choice)
                                : [...selected, choice])}
                        >
                            {choice}
                        </button>
                    ))}
                </div>
            );
        }

        return (
            <HandwritingAnswer
                key={`${assignment.id}-${problem.no}`}
                storageKey={`${student.id}:${assignment.id}:${problem.no}`}
                onAnswerChange={(hasAnswer) => updateAnswer(hasAnswer ? 'handwriting' : '')}
            />
        );
    };

    return (
        <div className="student-solve">
            <Header mode="student" userName={student.name} />
            <main className="student-solve__main">
                <header className="student-solve__worksheet-header">
                    <button type="button" className="student-solve__back" onClick={() => navigate(`/student?student=${student.id}`)}>
                        <i className="bi bi-chevron-left" aria-hidden="true" /> 학습지 나가기
                    </button>
                    <div className="student-solve__title-group">
                        <h1>{assignment.title}</h1>
                    </div>
                    <button type="button" className="student-solve__submit">학습 제출</button>
                </header>

                <div className="student-solve__progress" aria-label={`전체 진행률 ${progress}%`}>
                    <div><span style={{ width: `${progress}%` }} /></div>
                    <strong>
                        {isAssessment
                            ? `${answeredCount}/${problems.length}문항 완료`
                            : `풀이 과정 ${completedPracticeStepCount}개 완료`}
                    </strong>
                </div>

                {!isAssessment ? (
                    <PracticeLearningView
                        assignment={assignment}
                        student={student}
                        problem={problem}
                        currentIndex={currentIndex}
                        problemCount={problems.length}
                        onPrevious={() => moveByProblem(-1)}
                        onNext={() => moveByProblem(1)}
                        onStepAnswerChange={updatePracticeAnswer}
                        isCustom={isCustom}
                    />
                ) : <div className="student-solve__workspace">
                    <aside className="student-solve__navigator" aria-label="문항 바로가기">
                        <div className="student-solve__navigator-heading">
                            <strong>문항</strong>
                            <span>{problems.length}개</span>
                        </div>
                        <div className="student-solve__question-grid">
                            {problems.map((item, index) => (
                                <button
                                    key={item.no}
                                    type="button"
                                    aria-label={`${item.no}번${answers[index] ? ', 답변 완료' : ''}`}
                                    aria-current={currentIndex === index ? 'step' : undefined}
                                    className={`${answers[index] ? 'student-solve__question-number student-solve__question-number--answered' : 'student-solve__question-number'}${currentIndex === index ? ' student-solve__question-number--current' : ''}`}
                                    onClick={() => moveToProblem(index)}
                                >
                                    {item.no}
                                    {bookmarked.includes(item.no) && <i className="bi bi-bookmark-fill" aria-hidden="true" />}
                                </button>
                            ))}
                        </div>
                        <div className="student-solve__legend">
                            <span><i className="student-solve__legend-dot student-solve__legend-dot--answered" />완료</span>
                            <span><i className="student-solve__legend-dot" />미완료</span>
                        </div>
                    </aside>

                    <section className="student-solve__problem" aria-labelledby="current-problem-title">
                        <div className="student-solve__problem-topline">
                            <div>
                                <span className="student-solve__number">{problem.no}</span>
                                <span className="student-solve__difficulty">난이도 {problem.difficulty}</span>
                            </div>
                            <button
                                type="button"
                                aria-pressed={bookmarked.includes(problem.no)}
                                className={bookmarked.includes(problem.no) ? 'student-solve__bookmark student-solve__bookmark--active' : 'student-solve__bookmark'}
                                onClick={toggleBookmark}
                            >
                                <i className={`bi bi-bookmark${bookmarked.includes(problem.no) ? '-fill' : ''}`} aria-hidden="true" />
                                나중에 보기
                            </button>
                        </div>

                        <div className="student-solve__question-copy">
                            <h2 id="current-problem-title">{problem.prompt}</h2>
                            {problem.subPrompt && <p>{problem.subPrompt}</p>}
                        </div>

                        <div className="student-solve__answer-area">
                            <h3>답 입력</h3>
                            {renderAnswer()}
                        </div>

                        <footer className="student-solve__controls">
                            <button type="button" disabled={currentIndex === 0} onClick={() => moveByProblem(-1)}>
                                <i className="bi bi-chevron-left" aria-hidden="true" /> 이전 문제
                            </button>
                            <span>{problem.no} / {problems.length}</span>
                            <button type="button" disabled={currentIndex === problems.length - 1} className="student-solve__next" onClick={() => moveByProblem(1)}>
                                다음 문제 <i className="bi bi-chevron-right" aria-hidden="true" />
                            </button>
                        </footer>
                    </section>
                </div>}
            </main>
        </div>
    );
}

export default StudentSolvePage;
