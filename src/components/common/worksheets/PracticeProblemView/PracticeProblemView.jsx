import { Fragment } from 'react';
import { difficultyLabels } from '../../../../mocks/labels';
import MathText from '../MathText/MathText';
import { omitPeriodAfterTerminalBlank } from '../problemSegmentUtils';
import './PracticeProblemView.scss';

function PracticeProblemMedia({ blocks = [] }) {
    const mediaBlocks = blocks.filter((block) => (
        block.blockKind !== 'text' || block.asset || block.assetRef
    ));

    if (!mediaBlocks.length) return null;

    return (
        <div className="practice-problem-view__media">
            {mediaBlocks.map((block) => {
                const key = block.blockId ?? `${block.blockKind}-${block.displayOrder}`;

                if (block.asset?.url) {
                    return <img key={key} src={block.asset.url} width={block.asset.widthPx || undefined} height={block.asset.heightPx || undefined} alt={block.asset.altText || '문항 참고 자료'} />;
                }

                return <div className="practice-problem-view__media-placeholder" key={key}><i className="bi bi-image" aria-hidden="true" /><span>{block.asset?.altText || block.text || block.markup || '문항 참고 자료를 준비 중입니다.'}</span></div>;
            })}
        </div>
    );
}

function PracticeProblemView({
    problem,
    answerMode = 'input',
    renderAnswer,
    renderBlank,
    footer,
    headingId = 'practice-problem-title',
    difficultyText,
    editMode = false,
    selectedEditTarget,
    onSelectEditTarget,
}) {
    if (!problem) {
        return <div className="practice-problem-view practice-problem-view--empty">목록에서 문제를 선택해 주세요.</div>;
    }

    const isPreview = answerMode === 'answer';
    const isProblemSelected = selectedEditTarget?.type === 'problem';

    const selectProblem = () => onSelectEditTarget?.({
        type: 'problem',
        id: problem.id,
        label: '문제 전체',
    });

    const selectStep = (step, stepIndex) => onSelectEditTarget?.({
        type: 'step',
        id: step.id,
        targetKey: step.stepKey ?? step.id,
        label: step.label ?? `풀이 과정 ${stepIndex + 1}`,
    });

    return (
        <article className={`practice-problem-view${isPreview ? ' practice-problem-view--preview' : ''}${editMode ? ' practice-problem-view--edit-mode' : ''}${isProblemSelected ? ' practice-problem-view--selected' : ''}`} aria-labelledby={headingId}>
            {editMode && (
                <button type="button" className="practice-problem-view__sector-button practice-problem-view__sector-button--problem" aria-pressed={isProblemSelected} onClick={selectProblem}>
                    <i className="bi bi-bounding-box" aria-hidden="true" /> 문제 전체 선택
                </button>
            )}
            <div className="practice-problem-view__heading">
                <div>
                    <span>{problem.title ?? problem.unitName}</span>
                    <h2 id={headingId}><MathText>{problem.prompt}</MathText></h2>
                </div>
                <span className="practice-problem-view__difficulty">{difficultyText ?? `난이도 ${difficultyLabels[problem.difficulty]}`}</span>
            </div>

            <PracticeProblemMedia blocks={problem.contentBlocks} />

            <div className="practice-problem-view__steps">
                {problem.steps.map((step, stepIndex) => (
                    <section key={step.id} className={`practice-problem-view__step${editMode ? ' practice-problem-view__step--editable' : ''}${selectedEditTarget?.type === 'step' && selectedEditTarget.id === step.id ? ' practice-problem-view__step--selected' : ''}`}>
                        {editMode && (
                            <button type="button" className="practice-problem-view__sector-button practice-problem-view__sector-button--step" aria-pressed={selectedEditTarget?.type === 'step' && selectedEditTarget.id === step.id} onClick={() => selectStep(step, stepIndex)}>
                                <i className="bi bi-pencil-square" aria-hidden="true" /> 이 풀이 과정 선택
                            </button>
                        )}
                        <div className="practice-problem-view__copy">
                            <span>{step.label ?? `풀이 과정 ${stepIndex + 1}`}</span>
                            <div>
                                <strong>{step.instruction ?? '빈칸에 알맞은 답을 써서 풀이 과정을 완성합니다.'}</strong>
                                <p className="practice-problem-view__formula">
                                    {omitPeriodAfterTerminalBlank(step.segments).map((segment, segmentIndex) => {
                                        if (segment.type === 'text') return <span key={`${step.id}-text-${segmentIndex}`}><MathText inlineLatex>{segment.value}</MathText></span>;
                                        if (segment.type === 'answerRef') return <span key={segment.id}><MathText inlineLatex>{segment.value || segment.answer}</MathText></span>;
                                        if (renderBlank) return <Fragment key={segment.id}>{renderBlank(segment, step)}</Fragment>;
                                        if (isPreview) return <span key={segment.id} className="practice-problem-view__answer"><MathText inlineLatex>{segment.answer}</MathText></span>;
                                        return <span key={segment.id} className="practice-problem-view__blank" aria-hidden="true" />;
                                    })}
                                </p>
                            </div>
                        </div>
                        {!isPreview && renderAnswer && (
                            <div className="practice-problem-view__answers">
                                {step.segments
                                    .filter((segment) => segment.type === 'blank')
                                    .map((blank) => renderAnswer(blank, step))}
                            </div>
                        )}
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
