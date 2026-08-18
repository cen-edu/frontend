import GradingQuestionNav from './components/GradingQuestionNav';
import GradingShell from './components/GradingShell';
import PracticeGradingCard from './components/PracticeGradingCard';

// 일반 학습 채점은 학생이 실제로 보는 학습·채점 결과 화면과 같은 구성으로 진행한다.
// 문항을 하나씩 넘겨 보면서 풀이 과정의 필기 칸마다 정답·오답을 확정한다.
function PracticeGradingView({
    worksheet,
    student,
    completedCount,
    isComplete,
    onSelectStudent,
    onMark,
    onReset,
    onComplete,
    onExit,
    onAutoGrade,
    isAutoGrading,
    errorMessage,
}) {
    const answers = Object.fromEntries(student.answers.map((answer) => [answer.no, answer]));
    const questionResults = worksheet.questions.map((question) => ({
        no: question.no,
        result: question.result,
    }));
    const countResult = (result) => questionResults.filter((item) => item.result === result).length;
    const summary = {
        type: 'practice',
        totalCount: worksheet.questions.length,
        correctCount: countResult('correct'),
        partialCount: countResult('partial'),
        wrongCount: countResult('wrong') + countResult('empty'),
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
            onAutoGrade={onAutoGrade}
            isAutoGrading={isAutoGrading}
            errorMessage={errorMessage}
            renderQuestion={(currentIndex, moveToQuestion) => {
                const question = worksheet.questions[currentIndex];
                return (
                    <PracticeGradingCard
                        student={student}
                        question={question}
                        answer={answers[question.no]}
                        onMark={(blankId, correct) => onMark(question.no, blankId, correct)}
                        onReset={(blankId) => onReset(question.no, blankId)}
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

export default PracticeGradingView;
