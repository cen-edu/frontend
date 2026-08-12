import { useState } from 'react';
import { ReviewResultStrip } from '../../../../components/common/worksheets';
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
    const [aiSelectionMode, setAiSelectionMode] = useState(false);
    const [aiSelections, setAiSelections] = useState({});

    // 학생을 바꾸면 다시 1번 문항부터 확인한다.
    if (viewedStudentId !== student.id) {
        setViewedStudentId(student.id);
        setCurrentIndex(0);
    }

    const studentDone = isComplete(student);
    const selectedQuestionNos = aiSelections[String(student.id)] ?? [];
    const selectedStudentCount = Object.values(aiSelections).filter((questionNos) => questionNos.length > 0).length;
    const selectedQuestionCount = Object.values(aiSelections)
        .reduce((total, questionNos) => total + questionNos.length, 0);

    const moveToQuestion = (index) => {
        setCurrentIndex(index);
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    };

    const toggleAiSelectionMode = () => {
        setAiSelectionMode((current) => {
            if (current) {
                setAiSelections({});
            }
            return !current;
        });
    };

    const selectStudentForAiGrading = (studentId) => {
        const studentKey = String(studentId);
        onSelectStudent(studentId);

        // 선택 상태를 학생별로 저장해 한 학생을 해제해도 다른 학생의 문항 선택은 유지한다.
        setAiSelections((current) => {
            if (current[studentKey]?.length) {
                const next = { ...current };
                delete next[studentKey];
                return next;
            }
            return {
                ...current,
                [studentKey]: questionResults.map((question) => question.no),
            };
        });
    };

    const toggleQuestionSelection = (questionNo) => {
        const studentKey = String(student.id);
        setAiSelections((current) => {
            const currentQuestions = current[studentKey] ?? [];
            const nextQuestions = currentQuestions.includes(questionNo)
                ? currentQuestions.filter((no) => no !== questionNo)
                : [...currentQuestions, questionNo];

            if (nextQuestions.length === 0) {
                const next = { ...current };
                delete next[studentKey];
                return next;
            }
            return { ...current, [studentKey]: nextQuestions };
        });
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
                <button
                    type="button"
                    aria-pressed={aiSelectionMode}
                    className={`grading-shell__ai-grading${aiSelectionMode ? ' grading-shell__ai-grading--active' : ''}`}
                    onClick={toggleAiSelectionMode}
                >
                    <i className="bi bi-stars" aria-hidden="true" />
                    {aiSelectionMode ? '선택 완료' : '자동 채점하기'}
                </button>
            </header>

            <main className="grading-shell__main">
                {aiSelectionMode && (
                    <section className="grading-shell__ai-guide" aria-live="polite">
                        <div>
                            <strong>AI로 채점할 학생과 문항을 선택하세요.</strong>
                            <span>아래 학생 버튼과 문항 번호를 눌러 여러 개를 선택할 수 있습니다.</span>
                        </div>
                        <span className="grading-shell__ai-count">
                            학생 {selectedStudentCount}명 · 문항 {selectedQuestionCount}개 선택
                        </span>
                    </section>
                )}

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
                            const selected = (aiSelections[String(candidate.id)]?.length ?? 0) > 0;
                            return (
                                <button
                                    key={candidate.id}
                                    type="button"
                                    aria-current={!aiSelectionMode && candidate.id === student.id ? 'true' : undefined}
                                    aria-pressed={aiSelectionMode ? selected : undefined}
                                    aria-label={`${candidate.number}번 ${candidate.name} ${done ? '채점 완료' : '채점 대기'}${aiSelectionMode ? `, AI 채점 ${selected ? '선택됨' : '선택 안 됨'}` : ''}`}
                                    className={`grading-shell__student grading-shell__student--${done ? 'done' : 'pending'}${!aiSelectionMode && candidate.id === student.id ? ' grading-shell__student--current' : ''}${selected ? ' grading-shell__student--selected' : ''}`}
                                    onClick={() => aiSelectionMode ? selectStudentForAiGrading(candidate.id) : onSelectStudent(candidate.id)}
                                >
                                    <em>{candidate.number}</em>
                                    <strong>{candidate.name}</strong>
                                    {selected && (
                                        <svg className="grading-shell__student-selection-border" aria-hidden="true">
                                            <rect />
                                        </svg>
                                    )}
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
                    selectionMode={aiSelectionMode}
                    selectedQuestionNos={selectedQuestionNos}
                    onToggleSelection={toggleQuestionSelection}
                />

                <div className="grading-shell__content">
                    {renderQuestion(currentIndex, moveToQuestion)}
                </div>
            </main>
        </div>
    );
}

export default GradingShell;
