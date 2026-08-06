import { useState } from 'react';
import ReviewResultStrip from '../../components/common/ReviewResultStrip/ReviewResultStrip';
import { getPracticeQuestionResult } from '../../mocks/assessmentResult';
import { questionResultLabels, worksheetTypeLabels } from '../../mocks/labels';
import PracticeGradingCard from './components/PracticeGradingCard';
import './PracticeGradingView.scss';

// 일반 학습 채점은 학생이 실제로 보는 학습·채점 결과 화면과 같은 구성으로 진행한다.
// 문항을 하나씩 넘겨 보면서 풀이 과정의 필기 칸마다 정답·오답을 확정한다.
function PracticeGradingView({
    worksheet,
    student,
    completedCount,
    isComplete,
    onSelectStudent,
    onMark,
    onComplete,
    onExit,
}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [viewedStudentId, setViewedStudentId] = useState(student.id);

    // 학생을 바꾸면 다시 1번 문항부터 확인한다.
    if (viewedStudentId !== student.id) {
        setViewedStudentId(student.id);
        setCurrentIndex(0);
    }

    const question = worksheet.questions[currentIndex];
    const answers = Object.fromEntries(student.answers.map((answer) => [answer.no, answer]));
    const questionResults = worksheet.questions.map((item) => ({
        no: item.no,
        result: getPracticeQuestionResult(answers[item.no]),
    }));
    const countResult = (result) => questionResults.filter((item) => item.result === result).length;
    const summary = {
        type: 'practice',
        totalCount: worksheet.questions.length,
        correctCount: countResult('correct'),
        partialCount: countResult('partial'),
        wrongCount: countResult('wrong') + countResult('empty'),
    };
    const studentDone = isComplete(student);

    const moveToQuestion = (index) => {
        setCurrentIndex(index);
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    };

    return (
        <div className="practice-grading">
            <header className="practice-grading__topbar">
                <button type="button" className="practice-grading__back" onClick={onExit}>
                    <i className="bi bi-chevron-left" aria-hidden="true" /> 평가 결과
                </button>
                <div className="practice-grading__title-group">
                    <h1>{worksheet.title}</h1>
                    <span>{worksheet.className} · {worksheetTypeLabels[worksheet.type]}</span>
                </div>
            </header>

            <main className="practice-grading__main">
                <section className="practice-grading__students" aria-label="채점할 학생 선택">
                    <div className="practice-grading__students-summary">
                        <strong>{student.number}번 {student.name}</strong>
                        <span className={`practice-grading__student-status practice-grading__student-status--${studentDone ? 'done' : 'pending'}`}>
                            {studentDone ? '채점 완료' : '채점 대기'}
                        </span>
                        <span className="practice-grading__students-count">학생 채점 {completedCount}/{worksheet.students.length}</span>
                        <button type="button" className="practice-grading__complete" onClick={onComplete}>
                            <i className="bi bi-check2" aria-hidden="true" /> {student.name} 채점 완료
                        </button>
                    </div>
                    <div className="practice-grading__student-list">
                        {worksheet.students.map((candidate) => {
                            const done = isComplete(candidate);
                            return (
                                <button
                                    key={candidate.id}
                                    type="button"
                                    aria-current={candidate.id === student.id ? 'true' : undefined}
                                    aria-label={`${candidate.number}번 ${candidate.name} ${done ? '채점 완료' : '채점 대기'}`}
                                    className={`practice-grading__student practice-grading__student--${done ? 'done' : 'pending'}${candidate.id === student.id ? ' practice-grading__student--current' : ''}`}
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

                <div className="practice-grading__content">
                    <PracticeGradingCard
                        student={student}
                        question={question}
                        answer={answers[question.no]}
                        onMark={(blankId, correct) => onMark(question.no, blankId, correct)}
                        footer={(
                            <footer className="practice-grading__controls">
                                <button type="button" disabled={currentIndex === 0} onClick={() => moveToQuestion(currentIndex - 1)}>
                                    <i className="bi bi-chevron-left" aria-hidden="true" /> 이전 문항
                                </button>
                                <span>{question.no} / {worksheet.questions.length}문항 · {questionResultLabels[questionResults[currentIndex].result]}</span>
                                <button
                                    type="button"
                                    className="practice-grading__next"
                                    disabled={currentIndex === worksheet.questions.length - 1}
                                    onClick={() => moveToQuestion(currentIndex + 1)}
                                >
                                    다음 문항 <i className="bi bi-chevron-right" aria-hidden="true" />
                                </button>
                            </footer>
                        )}
                    />
                </div>
            </main>
        </div>
    );
}

export default PracticeGradingView;
