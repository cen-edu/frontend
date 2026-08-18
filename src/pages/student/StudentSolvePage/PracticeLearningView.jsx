import { PracticeProblemView } from '../../../components/common/worksheets';
import HandwritingAnswer from './HandwritingAnswer';
import StudentLearningSupport from './StudentLearningSupport';

function PracticeLearningView({
    assignment,
    studentName,
    studentKey,
    problem,
    currentIndex,
    problemCount,
    onPrevious,
    onNext,
    onStepAnswerChange,
    onStrokesChange,
    answers,
    isSaving,
    isCustom = false,
}) {
    return (
        <div className="student-solve__practice-workspace">
            <PracticeProblemView
                problem={problem}
                difficultyText={isCustom ? `${problem.stageLabel} 문제` : undefined}
                renderAnswer={(blank, step) => {
                    const storageKey = `${studentKey}:${assignment.assignmentStudentId}:${problem.worksheetItemId}:${blank.answerUnitId}`;
                    return (
                        <HandwritingAnswer
                            key={blank.id}
                            compact
                            saveMode="manual"
                            storageKey={storageKey}
                            serverHasAnswer={answers[blank.answerUnitId]?.hasHandwriting}
                            onAnswerChange={(hasAnswer) => onStepAnswerChange(blank.answerUnitId, hasAnswer)}
                            onStrokesChange={(strokes) => onStrokesChange(blank.answerUnitId, storageKey, strokes)}
                        />
                    );
                }}
                footer={<footer className="student-solve__controls student-solve__controls--practice">
                    <button type="button" disabled={currentIndex === 0 || isSaving} onClick={onPrevious}>
                        <i className="bi bi-chevron-left" aria-hidden="true" /> 이전 학습
                    </button>
                    <span>풀이를 순서대로 완성해 보세요.</span>
                    <button type="button" disabled={currentIndex === problemCount - 1 || isSaving} className="student-solve__next" onClick={onNext}>
                        {isSaving ? '저장 중' : '다음 학습'} {!isSaving && <i className="bi bi-chevron-right" aria-hidden="true" />}
                    </button>
                </footer>}
            />

            <StudentLearningSupport problem={problem} studentName={studentName} />
        </div>
    );
}

export default PracticeLearningView;
