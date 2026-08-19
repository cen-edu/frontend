import { difficultyLabels, formatLabels, questionResultLabels } from '../../../../mocks/labels';
import { MathText } from '../../../../components/common/worksheets';
import './AssessmentReviewCard.scss';

function AssessmentReviewCard({ question }) {
    const isChoice = question.format === 'choice';

    return (
        <article className="assessment-review-card" aria-labelledby="review-problem-title">
            <div className="assessment-review-card__heading">
                <div>
                    <span>{question.no}번 · {formatLabels[question.format]} · 난이도 {difficultyLabels[question.difficulty]}</span>
                    <h2 id="review-problem-title"><MathText>{question.prompt}</MathText></h2>
                    {question.subPrompt && <p><MathText>{question.subPrompt}</MathText></p>}
                </div>
                <span className={`assessment-review-card__score assessment-review-card__score--${question.result}`}>
                    <strong>{question.score}점</strong>
                    <em>{question.maxScore}점 만점 · {questionResultLabels[question.result]}</em>
                </span>
            </div>

            {isChoice ? (
                <ol className="assessment-review-card__choices">
                    {question.choices.map((choice) => {
                        const isAnswer = choice === question.answer;
                        const isPicked = choice === question.input;
                        return (
                            <li
                                key={choice}
                                className={`assessment-review-card__choice${isAnswer ? ' assessment-review-card__choice--answer' : ''}${isPicked && !isAnswer ? ' assessment-review-card__choice--picked' : ''}`}
                            >
                                <span><MathText>{choice}</MathText></span>
                                {isPicked && <em>내가 고른 답</em>}
                                {isAnswer && <strong>정답</strong>}
                            </li>
                        );
                    })}
                </ol>
            ) : (
                <div className="assessment-review-card__answers">
                    <div className="assessment-review-card__answer-block">
                        <span>내 답안</span>
                        <p>{question.input
                            ? <MathText latex={question.format === 'short'}>{question.input}</MathText>
                            : '미작성'}</p>
                    </div>
                    <div className="assessment-review-card__answer-block assessment-review-card__answer-block--correct">
                        <span>{question.format === 'essay' ? '모범답안' : '정답'}</span>
                        <p><MathText latex={question.format === 'short'}>{question.answer}</MathText></p>
                    </div>
                </div>
            )}

            {question.rubricResults?.length > 0 && (
                <div className="assessment-review-card__rubric">
                    <h3>채점 기준</h3>
                    <ul>
                        {question.rubricResults.map((item) => (
                            <li key={item.label} className={item.satisfied ? 'assessment-review-card__rubric-item--met' : undefined}>
                                <i className={`bi bi-${item.satisfied ? 'check-circle-fill' : 'x-circle'}`} aria-hidden="true" />
                                <div>
                                    <strong><MathText>{item.label}</MathText></strong>
                                    {item.evidence && <p>답안에서 확인된 부분: <MathText>{item.evidence}</MathText></p>}
                                </div>
                                <span>{item.satisfied ? item.score : 0}/{item.score}점</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </article>
    );
}

export default AssessmentReviewCard;
