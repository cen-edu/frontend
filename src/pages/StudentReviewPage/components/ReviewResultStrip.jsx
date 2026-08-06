import { questionResultLabels } from '../../../mocks/labels';
import './ReviewResultStrip.scss';

function ReviewResultStrip({ summary, questions, currentIndex, onSelect }) {
    return (
        <section className="review-result-strip" aria-label="문항별 채점 결과">
            <div className="review-result-strip__summary">
                <strong>
                    {summary.type === 'assessment'
                        ? `${summary.score}점 / ${summary.maxScore}점`
                        : `${summary.correctCount}/${summary.totalCount}문항 정답`}
                </strong>
                <span>
                    정답 {summary.correctCount}
                    {summary.partialCount > 0 && ` · 부분 정답 ${summary.partialCount}`}
                    {` · 오답 ${summary.wrongCount}`}
                </span>
            </div>

            <div className="review-result-strip__list">
                {questions.map((question, index) => (
                    <button
                        key={question.no}
                        type="button"
                        aria-current={currentIndex === index ? 'true' : undefined}
                        aria-label={`${question.no}번 ${questionResultLabels[question.result]}`}
                        className={`review-result-strip__item review-result-strip__item--${question.result}${currentIndex === index ? ' review-result-strip__item--current' : ''}`}
                        onClick={() => onSelect(index)}
                    >
                        {question.no}
                    </button>
                ))}
            </div>
        </section>
    );
}

export default ReviewResultStrip;
