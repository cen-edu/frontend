import { difficultyLabels } from '../../../mocks/labels';
import './PracticeProblemView.scss';

function PracticeProblemView({
    problem,
    answerMode = 'input',
    renderAnswer,
    footer,
    headingId = 'practice-problem-title',
    difficultyText,
}) {
    if (!problem) {
        return <div className="practice-problem-view practice-problem-view--empty">목록에서 문제를 선택해 주세요.</div>;
    }

    const isPreview = answerMode === 'answer';

    return (
        <article className={`practice-problem-view${isPreview ? ' practice-problem-view--preview' : ''}`} aria-labelledby={headingId}>
            <div className="practice-problem-view__heading">
                <div>
                    <span>{problem.title ?? problem.unitName}</span>
                    <h2 id={headingId}>{problem.prompt}</h2>
                </div>
                <span className="practice-problem-view__difficulty">{difficultyText ?? `난이도 ${difficultyLabels[problem.difficulty]}`}</span>
            </div>

            <div className="practice-problem-view__steps">
                {problem.steps.map((step, stepIndex) => (
                    <section key={step.id} className="practice-problem-view__step">
                        <div className="practice-problem-view__copy">
                            <span>{step.label ?? `풀이 과정 ${stepIndex + 1}`}</span>
                            <div>
                                <strong>{step.instruction ?? '빈칸에 알맞은 답을 써서 풀이 과정을 완성합니다.'}</strong>
                                <p className="practice-problem-view__formula">
                                    {step.segments.map((segment, segmentIndex) => {
                                        if (segment.type === 'text') return <span key={`${step.id}-text-${segmentIndex}`}>{segment.value}</span>;
                                        if (isPreview) return <span key={segment.id} className="practice-problem-view__answer">{segment.answer}</span>;
                                        return <span key={segment.id} className="practice-problem-view__blank" aria-hidden="true" />;
                                    })}
                                </p>
                            </div>
                        </div>
                        {!isPreview && step.segments.filter((segment) => segment.type === 'blank').map((blank) => renderAnswer?.(blank, step))}
                        {stepIndex < problem.steps.length - 1 && <i className="bi bi-arrow-down practice-problem-view__arrow" aria-hidden="true" />}
                    </section>
                ))}
            </div>

            {isPreview && (
                <p className="practice-problem-view__preview-note">
                    <i className="bi bi-eye" aria-hidden="true" />
                    학생에게는 파란색 정답 영역 대신 필기 입력란이 표시됩니다.
                </p>
            )}
            {footer}
        </article>
    );
}

export default PracticeProblemView;
