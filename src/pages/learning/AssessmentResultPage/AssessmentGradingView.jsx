import { getAssessmentQuestionResult } from '../../../mocks/assessmentResult';
import AssessmentGradingCard from './components/AssessmentGradingCard';
import GradingQuestionNav from './components/GradingQuestionNav';
import GradingShell from './components/GradingShell';

// 종합 평가 채점도 일반 학습과 같이 학생이 보는 채점 결과 화면 구성으로 진행한다.
// 문항을 하나씩 넘겨 보면서 채점 기준과 점수를 확정한다.
function AssessmentGradingView({
    worksheet,
    student,
    completedCount,
    isComplete,
    deriveRubricChecks,
    onSelectStudent,
    onScore,
    onRubric,
    onComplete,
    onExit,
}) {
    const answers = Object.fromEntries(student.answers.map((answer) => [answer.no, answer]));
    const questionResults = worksheet.questions.map((question) => ({
        no: question.no,
        result: getAssessmentQuestionResult(answers[question.no], question),
    }));
    const countResult = (result) => questionResults.filter((item) => item.result === result).length;
    const summary = {
        type: 'assessment',
        score: worksheet.questions.reduce((sum, question) => sum + (answers[question.no]?.score ?? 0), 0),
        maxScore: worksheet.questions.reduce((sum, question) => sum + question.maxScore, 0),
        correctCount: countResult('correct'),
        partialCount: countResult('partial'),
        wrongCount: countResult('wrong'),
        pendingCount: countResult('pending'),
    };

    return (
        <GradingShell
            worksheet={worksheet}
            student={student}
            completedCount={completedCount}
            isComplete={isComplete}
            summary={summary}
            questionResults={questionResults}
            onSelectStudent={onSelectStudent}
            onComplete={onComplete}
            onExit={onExit}
            renderQuestion={(currentIndex, moveToQuestion) => {
                const question = worksheet.questions[currentIndex];
                const answer = answers[question.no];
                return (
                    <AssessmentGradingCard
                        student={student}
                        question={question}
                        answer={answer}
                        result={questionResults[currentIndex].result}
                        rubricChecks={deriveRubricChecks(answer, question)}
                        onScore={(score) => onScore(question.no, score)}
                        onRubric={(rubricIndex) => onRubric(question, rubricIndex)}
                        footer={(
                            <GradingQuestionNav
                                questionNo={question.no}
                                currentIndex={currentIndex}
                                total={worksheet.questions.length}
                                result={questionResults[currentIndex].result}
                                onMove={moveToQuestion}
                            />
                        )}
                    />
                );
            }}
        />
    );
}

export default AssessmentGradingView;
