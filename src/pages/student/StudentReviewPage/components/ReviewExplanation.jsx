import { questionResultLabels } from '../../../../mocks/labels';
import { MathText } from '../../../../components/common/worksheets';
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
                    <p className="review-explanation__answer">
                        <MathText latex={!question.format || question.format === 'short'}>{explanation.answerText}</MathText>
                    </p>
                </div>

                {explanation.steps?.length > 0 && (
                    <div className="review-explanation__block">
                        <h3>풀이 과정</h3>
                        <ol className="review-explanation__steps">
                            {explanation.steps.map((step, index) => (
                                <li key={step.id}>
                                    <span>{index + 1}</span>
                                    <div>
                                        <strong><MathText>{step.instruction}</MathText></strong>
                                        <p><MathText latex>{step.formula}</MathText></p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>
                )}

                {explanation.summary && (
                    <div className="review-explanation__block">
                        <h3>왜 이렇게 풀까요?</h3>
                        <p className="review-explanation__summary"><MathText>{explanation.summary}</MathText></p>
                    </div>
                )}

                {explanation.concept && (
                    <div className="review-explanation__block review-explanation__block--concept">
                        <h3>개념 정리 · <MathText>{explanation.concept.title}</MathText></h3>
                        <p><MathText>{explanation.concept.summary}</MathText></p>
                        <ul>
                            {explanation.concept.points.map((point) => <li key={point}><MathText>{point}</MathText></li>)}
                        </ul>
                        {explanation.concept.example && (
                            <div className="review-explanation__example">
                                <span>예시</span>
                                <strong><MathText>{explanation.concept.example}</MathText></strong>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}

export default ReviewExplanation;
