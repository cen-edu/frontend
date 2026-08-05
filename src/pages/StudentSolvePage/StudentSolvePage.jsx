import { useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { getStudentAssignments } from '../../mocks/studentAssignments';
import { getStudentWorksheetProblems } from '../../mocks/studentWorksheetSolving';
import students from '../../mocks/students';
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
    const problems = useMemo(() => getStudentWorksheetProblems(assignment.id), [assignment.id]);
    const initialIndex = assignment.status === 'in-progress'
        ? Math.min(assignment.doneUnits, problems.length - 1)
        : 0;
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [answers, setAnswers] = useState(() => Object.fromEntries(
        Array.from({ length: Math.min(assignment.doneUnits, problems.length) }, (_, index) => [index, 'answered']),
    ));
    const [bookmarked, setBookmarked] = useState([]);
    const problem = problems[currentIndex];
    const answeredCount = Object.keys(answers).length;
    const progress = Math.round((answeredCount / problems.length) * 100);

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

        if (problem.type === 'multi') {
            const values = typeof answers[currentIndex] === 'object' ? answers[currentIndex] : {};
            return (
                <div className="student-solve__multi-answer">
                    {problem.fields.map((field) => (
                        <label key={field.id}>
                            <span>{field.label}</span>
                            <span className="student-solve__input-wrap">
                                <input
                                    inputMode="numeric"
                                    aria-label={field.label}
                                    value={values[field.id] ?? ''}
                                    onChange={(event) => updateAnswer({ ...values, [field.id]: event.target.value })}
                                />
                                <strong>{field.suffix}</strong>
                            </span>
                        </label>
                    ))}
                </div>
            );
        }

        return (
            <label className="student-solve__text-answer">
                <span>답</span>
                <input
                    value={answers[currentIndex] === 'answered' ? '' : (answers[currentIndex] ?? '')}
                    placeholder="답을 입력하세요"
                    aria-describedby={problem.guide ? 'answer-guide' : undefined}
                    onChange={(event) => updateAnswer(event.target.value)}
                />
                {problem.guide && <small id="answer-guide">{problem.guide}</small>}
            </label>
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
                        <span>자동 임시 저장</span>
                    </div>
                    <button type="button" className="student-solve__submit">학습 제출</button>
                </header>

                <div className="student-solve__progress" aria-label={`전체 진행률 ${progress}%`}>
                    <div><span style={{ width: `${progress}%` }} /></div>
                    <strong>{answeredCount}/{problems.length}문항 완료</strong>
                </div>

                <div className="student-solve__workspace">
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
                                    onClick={() => setCurrentIndex(index)}
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
                            <button type="button" disabled={currentIndex === 0} onClick={() => setCurrentIndex((index) => index - 1)}>
                                <i className="bi bi-chevron-left" aria-hidden="true" /> 이전 문제
                            </button>
                            <span>{problem.no} / {problems.length}</span>
                            <button type="button" disabled={currentIndex === problems.length - 1} className="student-solve__next" onClick={() => setCurrentIndex((index) => index + 1)}>
                                다음 문제 <i className="bi bi-chevron-right" aria-hidden="true" />
                            </button>
                        </footer>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default StudentSolvePage;
