import {
  ConceptChatPanel,
  PracticeConceptView,
  PracticeProblemView,
} from '../../../components/common/worksheets';
import HandwritingAnswer from './HandwritingAnswer';

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

            {isCustom ? (
                <ConceptChatPanel
                    mode="student"
                    title="학습 도우미"
                    description="문제를 풀다 막히면 질문하세요."
                    studentName={studentName}
                    welcomeMessage={`${problem.stageLabel} 문제를 풀고 있어요. 정답을 바로 알려주기보다 필요한 개념과 다음 풀이 방향을 함께 찾아볼게요.`}
                    context={[{
                        subUnitId: problem.subUnitId,
                        conceptLabel: '맞춤 학습',
                    }]}
                />
            ) : <PracticeConceptView concept={{
                title: '개념 설명',
                summary: 'API 수정 후 재연동 필요',
                points: [],
            }} />}
        </div>
    );
}

export default PracticeLearningView;
