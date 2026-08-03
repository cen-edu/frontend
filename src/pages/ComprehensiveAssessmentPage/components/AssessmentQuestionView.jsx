import { formatLabels } from '../../../mocks/assessmentCreation';
import { difficultyLabels } from '../../../mocks/problemCreation';

function AssessmentQuestionView({ problem, showAnswers, onScoreChange }) {
    if (!problem) return <div className="assessment-question assessment-question--empty">검토할 문항을 선택합니다.</div>;

    return (
        <article className="assessment-question" aria-labelledby={`assessment-question-${problem.id}`}>
            <header className="assessment-question__header">
                <div>
                    <span>{problem.unitPath} · {formatLabels[problem.format]} · 난이도 {difficultyLabels[problem.difficulty]}</span>
                    <h3 id={`assessment-question-${problem.id}`}>{problem.no}. {problem.prompt}</h3>
                </div>
                <label className="assessment-question__score">
                    <span>배점</span>
                    <input type="number" min="1" max="100" value={problem.maxScore} aria-label={`${problem.no}번 문항 배점`} onChange={(event) => onScoreChange(problem.id, event.target.value)} />
                    <span>점</span>
                </label>
            </header>

            {problem.format === 'choice' && (
                <ol className="assessment-question__choices">
                    {problem.choices.map((choice, index) => {
                        const isAnswer = String(index + 1) === problem.answer;
                        return (
                            <li className={showAnswers && isAnswer ? 'assessment-question__choice--answer' : ''} key={choice}>
                                <span>{index + 1}</span><p>{choice}</p>{showAnswers && isAnswer && <strong>정답</strong>}
                            </li>
                        );
                    })}
                </ol>
            )}

            {problem.format === 'short' && (
                <div className="assessment-question__short-answer">
                    <span>학생 답안</span>
                    <div aria-hidden="true" />
                    {showAnswers && <p><strong>정답</strong>{problem.answer}</p>}
                </div>
            )}

            {problem.format === 'essay' && (
                <div className="assessment-question__essay">
                    <div className="assessment-question__essay-box"><span>학생 서술 답안</span></div>
                    {showAnswers && (
                        <section className="assessment-question__model-answer">
                            <h4>모범답안</h4><p>{problem.modelAnswer}</p>
                        </section>
                    )}
                    <section className="assessment-question__rubric">
                        <h4>채점 기준</h4>
                        <table>
                            <thead><tr><th>항목</th><th>부분 점수</th></tr></thead>
                            <tbody>{problem.rubric.map((item) => <tr key={item.label}><td>{item.label}</td><td>{item.score}점</td></tr>)}</tbody>
                            <tfoot><tr><th>기준 합계</th><td>{problem.rubric.reduce((sum, item) => sum + item.score, 0)}점</td></tr></tfoot>
                        </table>
                        <p>배점 수정 시 채점 기준은 참고 정보로 유지됩니다.</p>
                    </section>
                </div>
            )}
        </article>
    );
}

export default AssessmentQuestionView;
