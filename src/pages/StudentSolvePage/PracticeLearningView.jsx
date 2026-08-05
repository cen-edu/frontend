import { useRef, useState } from 'react';
import { difficultyLabels } from '../../mocks/problemCreation';
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
            <section className="student-solve__practice" aria-labelledby="practice-problem-title">
                <div className="student-solve__practice-heading">
                    <div>
                        <span>{problem.title}</span>
                        <h2 id="practice-problem-title">{problem.prompt}</h2>
                    </div>
                    <span className="student-solve__difficulty">
                        난이도 {difficultyLabels[problem.difficulty]}
                    </span>
                </div>

                <div className="student-solve__solution-steps">
                    {problem.steps.map((step, stepIndex) => (
                        <section key={step.id} className="student-solve__solution-step">
                            <div className="student-solve__solution-copy">
                                <span>{step.label}</span>
                                <div>
                                    <strong>{step.instruction}</strong>
                                    <p className="student-solve__solution-formula">
                                        {step.segments.filter((segment) => segment.type === 'text').map((segment) => segment.value).join(' ')}
                                        <span className="student-solve__blank-marker" aria-hidden="true" />
                                    </p>
                                </div>
                            </div>
                            {step.segments.filter((segment) => segment.type === 'blank').map((blank) => {
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
                            })}
                            {stepIndex < problem.steps.length - 1 && (
                                <i className="bi bi-arrow-down student-solve__step-arrow" aria-hidden="true" />
                            )}
                        </section>
                    ))}
                </div>

                <footer className="student-solve__controls student-solve__controls--practice">
                    <button type="button" disabled={currentIndex === 0} onClick={onPrevious}>
                        <i className="bi bi-chevron-left" aria-hidden="true" /> 이전 학습
                    </button>
                    <span>풀이를 순서대로 완성해 보세요.</span>
                    <button type="button" disabled={currentIndex === problemCount - 1 || isSaving} className="student-solve__next" onClick={moveToNextLearning}>
                        {isSaving ? '저장 중' : '다음 학습'} {!isSaving && <i className="bi bi-chevron-right" aria-hidden="true" />}
                    </button>
                </footer>
            </section>

            <aside className="student-solve__concept" aria-labelledby="concept-title">
                <span className="student-solve__concept-label">개념 설명</span>
                <h2 id="concept-title">{problem.concept.title}</h2>
                <p>{problem.concept.summary}</p>
                <ul>
                    {problem.concept.points.map((point) => <li key={point}>{point}</li>)}
                </ul>
                <div>
                    <span>예시</span>
                    <strong>{problem.concept.example}</strong>
                </div>
            </aside>
        </div>
    );
}

export default PracticeLearningView;
