import { useRef, useState } from 'react';
import {
  ConceptChatPanel,
  PracticeConceptView,
  PracticeProblemView,
} from '../../../components/common/worksheets';
import HandwritingAnswer from './HandwritingAnswer';
import { saveHandwriting } from './handwritingStorage';

function PracticeLearningView({
    assignment,
    student,
    problem,
    currentIndex,
    problemCount,
    onPrevious,
    onNext,
    onStepAnswerChange,
    isCustom = false,
}) {
    const draftsRef = useRef({});
    const [isSaving, setIsSaving] = useState(false);

    const moveToNextLearning = async () => {
        setIsSaving(true);
        try {
            await Promise.all(Object.entries(draftsRef.current).map(([storageKey, strokes]) => (
                saveHandwriting(storageKey, strokes)
            )));
            draftsRef.current = {};
            onNext();
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="student-solve__practice-workspace">
            <PracticeProblemView
                problem={problem}
                difficultyText={isCustom ? `${problem.stageLabel} 문제` : undefined}
                renderAnswer={(blank, step) => {
                    const storageKey = `${student.id}:${assignment.id}:${problem.id}:${step.id}:${blank.id}`;
                    return (
                        <HandwritingAnswer
                            key={blank.id}
                            compact
                            saveMode="manual"
                            storageKey={storageKey}
                            onAnswerChange={(hasAnswer) => onStepAnswerChange(blank.id, hasAnswer)}
                            onStrokesChange={(strokes) => { draftsRef.current[storageKey] = strokes; }}
                        />
                    );
                }}
                footer={<footer className="student-solve__controls student-solve__controls--practice">
                    <button type="button" disabled={currentIndex === 0} onClick={onPrevious}>
                        <i className="bi bi-chevron-left" aria-hidden="true" /> 이전 학습
                    </button>
                    <span>풀이를 순서대로 완성해 보세요.</span>
                    <button type="button" disabled={currentIndex === problemCount - 1 || isSaving} className="student-solve__next" onClick={moveToNextLearning}>
                        {isSaving ? '저장 중' : '다음 학습'} {!isSaving && <i className="bi bi-chevron-right" aria-hidden="true" />}
                    </button>
                </footer>}
            />

            {isCustom ? (
                <ConceptChatPanel
                    mode="student"
                    title="학습 도우미"
                    description="문제를 풀다 막히면 질문하세요."
                    studentName={student.name}
                    welcomeMessage={`${problem.stageLabel} 문제를 풀고 있어요. 정답을 바로 알려주기보다 필요한 개념과 다음 풀이 방향을 함께 찾아볼게요.`}
                    context={[{
                        conceptId: 'common',
                        conceptLabel: problem.concept.title,
                        unitId: problem.steps[0]?.conceptId,
                    }]}
                />
            ) : <PracticeConceptView concept={problem.concept} />}
        </div>
    );
}

export default PracticeLearningView;
