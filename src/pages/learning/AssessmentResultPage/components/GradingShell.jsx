import { useState } from 'react';
import ReviewResultStrip from '../../../../components/common/ReviewResultStrip/ReviewResultStrip';
import { worksheetTypeLabels } from '../../../../mocks/labels';
import './GradingShell.scss';

// 일반 학습·종합 평가 채점 화면이 함께 쓰는 껍데기.
// 학생이 보는 화면과 같은 순서(상단 바 → 학생 선택 → 문항 결과 막대 → 문항 카드)로 두어
// 교사가 학생 화면 그대로 문항을 하나씩 넘겨 보면서 채점한다.
function GradingShell({
    worksheet,
    student,
    completedCount,
    isComplete,
    summary,
    questionResults,
    onSelectStudent,
    onComplete,
    onExit,
    renderQuestion,
}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [viewedStudentId, setViewedStudentId] = useState(student.id);

    // 학생을 바꾸면 다시 1번 문항부터 확인한다.
    if (viewedStudentId !== student.id) {
        setViewedStudentId(student.id);
        setCurrentIndex(0);
    }

    const studentDone = isComplete(student);

    const moveToQuestion = (index) => {
        setCurrentIndex(index);
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    };

    return (
        <div className="grading-shell">
            <header className="grading-shell__topbar">
                <button type="button" className="grading-shell__back" onClick={onExit}>
                    <i className="bi bi-chevron-left" aria-hidden="true" /> 평가 결과
                </button>
                <div className="grading-shell__title-group">
                    <h1>{worksheet.title}</h1>
                    <span>{worksheet.className} · {worksheetTypeLabels[worksheet.type]}</span>
                </div>
            </header>

            <main className="grading-shell__main">
                <section className="grading-shell__students" aria-label="채점할 학생 선택">
                    <div className="grading-shell__students-summary">
                        <strong>{student.number}번 {student.name}</strong>
                        <span className={`grading-shell__student-status grading-shell__student-status--${studentDone ? 'done' : 'pending'}`}>
                            {studentDone ? '채점 완료' : '채점 대기'}
                        </span>
                        <span className="grading-shell__students-count">학생 채점 {completedCount}/{worksheet.students.length}</span>
                        <button type="button" className="grading-shell__complete" onClick={onComplete}>
                            <i className="bi bi-check2" aria-hidden="true" /> {student.name} 채점 완료
                        </button>
                    </div>
                    <div className="grading-shell__student-list">
                        {worksheet.students.map((candidate) => {
                            const done = isComplete(candidate);
                            return (
                                <button
                                    key={candidate.id}
                                    type="button"
                                    aria-current={candidate.id === student.id ? 'true' : undefined}
                                    aria-label={`${candidate.number}번 ${candidate.name} ${done ? '채점 완료' : '채점 대기'}`}
                                    className={`grading-shell__student grading-shell__student--${done ? 'done' : 'pending'}${candidate.id === student.id ? ' grading-shell__student--current' : ''}`}
                                    onClick={() => onSelectStudent(candidate.id)}
                                >
                                    <em>{candidate.number}</em>
                                    <strong>{candidate.name}</strong>
                                </button>
                            );
                        })}
                    </div>
                </section>

                <ReviewResultStrip
                    summary={summary}
                    questions={questionResults}
                    currentIndex={currentIndex}
                    onSelect={moveToQuestion}
                />

                <div className="grading-shell__content">
                    {renderQuestion(currentIndex, moveToQuestion)}
                </div>
            </main>
        </div>
    );
}

export default GradingShell;
