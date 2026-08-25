import { difficultyLabels, formatLabels } from '../../../../mocks/labels';
import MathText from '../MathText/MathText';
import './ProblemViewer.scss';

function AssessmentQuestionMedia({ blocks = [] }) {
    const mediaBlocks = blocks.filter((block) => block.blockKind !== 'text');

    if (!mediaBlocks.length) return null;

    return (
        <div className="assessment-question__media">
            {mediaBlocks.map((block) => {
                const asset = block.asset;
                const key = block.blockId ?? `${block.blockKind}-${block.displayOrder}`;

                if (asset?.url) {
                    return <img key={key} src={asset.url} width={asset.widthPx || undefined} height={asset.heightPx || undefined} alt={asset.altText || '문항 참고 자료'} />;
                }

                return (
                    <div className="assessment-question__media-placeholder" key={key}>
                        <i className="bi bi-image" aria-hidden="true" />
                        <span>{asset?.altText || block.text || block.markup || '문항 참고 자료를 준비 중입니다.'}</span>
                    </div>
                );
            })}
        </div>
    );
}

const getChoiceKey = (choice) => (
    typeof choice === 'string' ? null : choice.choiceKey ?? choice.id
);

const getChoiceContent = (choice) => (
    typeof choice === 'string' ? choice : choice.content ?? choice.text ?? choice.value ?? ''
);

const getAnswerUnitKey = (answerUnit) => (
    answerUnit?.answerUnitKey ?? answerUnit?.unitKey
);

const getExplanationText = (explanation) => (
    typeof explanation === 'string'
        ? explanation
        : explanation?.text ?? explanation?.content ?? explanation?.solution ?? ''
);

function AssessmentQuestionView({ problem, onScoreChange, editMode = false, selectedEditTarget, onSelectEditTarget, showExplanation = true, showRubric = true, showScore = true }) {
    if (!problem) return <div className="assessment-question assessment-question--empty">검토할 문항을 선택합니다.</div>;

    const editableScore = typeof onScoreChange === 'function';
    const isSelected = (type, targetKey = null) => (
        selectedEditTarget?.type === type
        && (targetKey == null || String(selectedEditTarget.targetKey) === String(targetKey))
    );
    const selectTarget = (type, label, targetKey = null) => onSelectEditTarget?.({
        type,
        id: targetKey ?? problem.id,
        targetKey,
        label,
    });
    const selectableClass = (type, targetKey = null) => `${editMode ? ' assessment-question__sector--editable' : ''}${isSelected(type, targetKey) ? ' assessment-question__sector--selected' : ''}`;
    const selectButton = (type, label, targetKey = null) => editMode && (targetKey != null || !['choice', 'answer-unit', 'rubric-item'].includes(type)) && (
        <button type="button" className="assessment-question__sector-button" aria-pressed={isSelected(type, targetKey)} onClick={() => selectTarget(type, label, targetKey)}>
            <i className="bi bi-pencil-square" aria-hidden="true" /> {label} 선택
        </button>
    );
    const inlineSelectButton = (type, label, targetKey) => editMode && targetKey != null && (
        <button type="button" className="assessment-question__inline-edit-button" aria-pressed={isSelected(type, targetKey)} onClick={() => selectTarget(type, label, targetKey)}>
            <i className="bi bi-pencil-square" aria-hidden="true" /> {label}
        </button>
    );
    const rubric = problem.rubric ?? [];
    const mainAnswerUnit = problem.answerUnits?.[0];
    const answerUnitKey = getAnswerUnitKey(mainAnswerUnit);
    const explanationText = getExplanationText(problem.explanation);

    return (
        <article className={`assessment-question${editMode ? ' assessment-question--edit-mode' : ''}${isSelected('problem') ? ' assessment-question--selected' : ''}`} aria-labelledby={`assessment-question-${problem.id}`}>
            {editMode && <button type="button" className="assessment-question__sector-button assessment-question__sector-button--problem" aria-pressed={isSelected('problem')} onClick={() => selectTarget('problem', '문제 전체')}><i className="bi bi-bounding-box" aria-hidden="true" /> 문제 전체 선택</button>}
            <section className={`assessment-question__body assessment-question__sector${selectableClass('question-body')}`}>
                {selectButton('question-body', '발문')}
                <header className="assessment-question__header">
                    <div>
                        <span>{problem.unitPath} · {formatLabels[problem.format]} · 난이도 {difficultyLabels[problem.difficulty]}</span>
                        <h3 id={`assessment-question-${problem.id}`}>{problem.no}. <MathText>{problem.prompt || '문항 내용이 없습니다.'}</MathText></h3>
                    </div>
                    {showScore && <div className="assessment-question__score"><span>배점</span>{editableScore ? <input type="number" min="1" max="100" value={problem.maxScore} aria-label={`${problem.no}번 문항 배점`} onChange={(event) => onScoreChange(problem.id, event.target.value)} /> : <strong>{problem.maxScore}</strong>}<span>점</span></div>}
                </header>
                <AssessmentQuestionMedia blocks={problem.contentBlocks} />
            </section>

            {problem.format === 'choice' && (
                <div className="assessment-question__choices-wrap">
                    <ol className="assessment-question__choices">
                        {problem.choices.map((choice, index) => {
                            const choiceKey = getChoiceKey(choice);
                            const choiceId = typeof choice === 'string' ? null : choice.id;
                            const isAnswer = String(index + 1) === String(problem.answer)
                                || String(choiceKey) === String(problem.answer)
                                || String(choiceId) === String(problem.answer);

                            return (
                                <li className={`${isAnswer ? 'assessment-question__choice--answer' : ''}${selectableClass('choice', choiceKey)}`} key={choiceKey ?? choiceId ?? `${problem.id}-${index}`}>
                                    {inlineSelectButton('choice', `${index + 1}번 보기 선택`, choiceKey)}
                                    <span>{index + 1}</span>
                                    <p><MathText>{getChoiceContent(choice)}</MathText></p>
                                    {isAnswer && <strong>정답</strong>}
                                </li>
                            );
                        })}
                    </ol>
                    <div className={`assessment-question__answer-unit assessment-question__sector${selectableClass('answer-unit', answerUnitKey)}`}>
                        {selectButton('answer-unit', '정답', answerUnitKey)}
                        <strong>정답</strong>
                        <MathText>{problem.answer}</MathText>
                    </div>
                </div>
            )}

            {problem.format === 'short' && (
                <div className={`assessment-question__short-answer assessment-question__sector${selectableClass('answer-unit', answerUnitKey)}`}>
                    {selectButton('answer-unit', '정답', answerUnitKey)}
                    <span>학생 답안</span>
                    <div aria-hidden="true" />
                    <p><strong>정답</strong><MathText latex>{problem.answer}</MathText></p>
                </div>
            )}

            {problem.format === 'essay' && (
                <div className="assessment-question__essay">
                    <div className="assessment-question__essay-box"><span>학생 서술 답안</span></div>
                    <section className={`assessment-question__model-answer assessment-question__sector${selectableClass('answer-unit', answerUnitKey)}`}>
                        {selectButton('answer-unit', '모범답안', answerUnitKey)}
                        <h4>모범답안</h4>
                        <p><MathText>{problem.modelAnswer}</MathText></p>
                    </section>
                    {showRubric && (
                        <section className="assessment-question__rubric">
                            <h4>채점 기준</h4>
                            {rubric.length ? (
                                <table>
                                    <thead><tr><th>항목</th><th>부분 점수</th></tr></thead>
                                    <tbody>
                                        {rubric.map((item, index) => {
                                            const rubricKey = item.rubricKey ?? item.key;

                                            return (
                                                <tr className={isSelected('rubric-item', rubricKey) ? 'assessment-question__rubric-row--selected' : ''} key={rubricKey ?? `${item.label}-${index}`}>
                                                    <td>{inlineSelectButton('rubric-item', '기준 선택', rubricKey)}<MathText>{item.label}</MathText></td>
                                                    <td>{item.score}점</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            ) : <p className="assessment-question__rubric-empty">채점 기준은 아직 제공되지 않습니다.</p>}
                        </section>
                    )}
                </div>
            )}

            {showExplanation && explanationText && (
                <section className={`assessment-question__explanation assessment-question__sector${selectableClass('explanation')}`}>
                    {selectButton('explanation', '해설')}
                    <h4>해설</h4>
                    <p><MathText>{explanationText}</MathText></p>
                </section>
            )}
        </article>
    );
}

export default AssessmentQuestionView;
