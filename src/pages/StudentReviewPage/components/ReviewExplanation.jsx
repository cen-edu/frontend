import { questionResultLabels } from '../../../mocks/labels';
import './ReviewExplanation.scss';

function ReviewExplanation({ question }) {
    const { explanation, result } = question;

    return (
        <section className={`review-explanation review-explanation--${result}`} aria-labelledby="review-explanation-title">
            <header className="review-explanation__header">
                <h2 id="review-explanation-title">해설</h2>
                <span className={`review-explanation__result review-explanation__result--${result}`}>
                    이 문항은 {questionResultLabels[result]}이에요.
                </span>
            </header>

            <div className="review-explanation__body">
                <div className="review-explanation__block">
                    <h3>정답</h3>
                    <p className="review-explanation__answer">{explanation.answerText}</p>
                </div>

                {explanation.steps?.length > 0 && (
                    <div className="review-explanation__block">
                        <h3>풀이 과정</h3>
                        <ol className="review-explanation__steps">
                            {explanation.steps.map((step, index) => (
                                <li key={step.id}>
                                    <span>{index + 1}</span>
                                    <div>
                                        <strong>{step.instruction}</strong>
                                        <p>{step.formula}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>
                )}

                {explanation.summary && (
                    <div className="review-explanation__block">
                        <h3>왜 이렇게 풀까요?</h3>
                        <p className="review-explanation__summary">{explanation.summary}</p>
                    </div>
                )}

                {explanation.concept && (
                    <div className="review-explanation__block review-explanation__block--concept">
                        <h3>개념 정리 · {explanation.concept.title}</h3>
                        <p>{explanation.concept.summary}</p>
                        <ul>
                            {explanation.concept.points.map((point) => <li key={point}>{point}</li>)}
                        </ul>
                        {explanation.concept.example && (
                            <div className="review-explanation__example">
                                <span>예시</span>
                                <strong>{explanation.concept.example}</strong>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}

export default ReviewExplanation;
