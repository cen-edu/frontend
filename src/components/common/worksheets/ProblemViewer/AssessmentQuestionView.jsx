import { formatLabels } from '../../../../mocks/assessmentCreation';
import { difficultyLabels } from '../../../../mocks/problemCreation';
import './ProblemViewer.scss';

function AssessmentQuestionView({ problem, onScoreChange, editMode = false, selectedEditTarget, onSelectEditTarget }) {
    if (!problem) return <div className="assessment-question assessment-question--empty">검토할 문항을 선택합니다.</div>;
    const editableScore = typeof onScoreChange === 'function';
    const isSelected = (type) => selectedEditTarget?.type === type;
    const selectTarget = (type, label) => onSelectEditTarget?.({ type, id: problem.id, label });
    const selectableClass = (type) => `${editMode ? ' assessment-question__sector--editable' : ''}${isSelected(type) ? ' assessment-question__sector--selected' : ''}`;
    const selectButton = (type, label) => editMode && <button type="button" className="assessment-question__sector-button" aria-pressed={isSelected(type)} onClick={() => selectTarget(type, label)}><i className="bi bi-pencil-square" aria-hidden="true" /> {label} 선택</button>;

    return <article className={`assessment-question${editMode ? ' assessment-question--edit-mode' : ''}${isSelected('problem') ? ' assessment-question--selected' : ''}`} aria-labelledby={`assessment-question-${problem.id}`}>
        {editMode && <button type="button" className="assessment-question__sector-button assessment-question__sector-button--problem" aria-pressed={isSelected('problem')} onClick={() => selectTarget('problem', '문제 전체')}><i className="bi bi-bounding-box" aria-hidden="true" /> 문제 전체 선택</button>}
        <header className="assessment-question__header"><div><span>{problem.unitPath} · {formatLabels[problem.format]} · 난이도 {difficultyLabels[problem.difficulty]}</span><h3 id={`assessment-question-${problem.id}`}>{problem.no}. {problem.prompt}</h3></div><div className="assessment-question__score"><span>배점</span>{editableScore ? <input type="number" min="1" max="100" value={problem.maxScore} aria-label={`${problem.no}번 문항 배점`} onChange={(event) => onScoreChange(problem.id, event.target.value)} /> : <strong>{problem.maxScore}</strong>}<span>점</span></div></header>
        {problem.format === 'choice' && <div className={`assessment-question__sector${selectableClass('answer')}`}>{selectButton('answer', '보기와 정답')}<ol className="assessment-question__choices">{problem.choices.map((choice, index) => { const isAnswer = String(index + 1) === problem.answer; return <li className={isAnswer ? 'assessment-question__choice--answer' : ''} key={choice}><span>{index + 1}</span><p>{choice}</p>{isAnswer && <strong>정답</strong>}</li>; })}</ol></div>}
        {problem.format === 'short' && <div className={`assessment-question__short-answer assessment-question__sector${selectableClass('answer')}`}>{selectButton('answer', '정답')}<span>학생 답안</span><div aria-hidden="true" /><p><strong>정답</strong>{problem.answer}</p></div>}
        {problem.format === 'essay' && <div className="assessment-question__essay"><div className="assessment-question__essay-box"><span>학생 서술 답안</span></div><section className={`assessment-question__model-answer assessment-question__sector${selectableClass('model-answer')}`}>{selectButton('model-answer', '모범답안')}<h4>모범답안</h4><p>{problem.modelAnswer}</p></section><section className={`assessment-question__rubric assessment-question__sector${selectableClass('rubric')}`}>{selectButton('rubric', '채점 기준')}<h4>채점 기준</h4><table><thead><tr><th>항목</th><th>부분 점수</th></tr></thead><tbody>{problem.rubric.map((item) => <tr key={item.label}><td>{item.label}</td><td>{item.score}점</td></tr>)}</tbody></table></section></div>}
    </article>;
}

export default AssessmentQuestionView;
