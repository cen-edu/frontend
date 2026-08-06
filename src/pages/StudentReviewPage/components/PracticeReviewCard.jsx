import PracticeProblemView from '../../../components/common/PracticeProblemView/PracticeProblemView';
import './PracticeReviewCard.scss';

// 학생이 필기로 쓴 답을 인식한 결과를 풀이 과정 자리에 그대로 채워 정답·오답을 보여 준다.
function PracticeReviewCard({ question, isCustom }) {
    return (
        <PracticeProblemView
            problem={question}
            headingId="review-problem-title"
            difficultyText={isCustom ? `${question.stageLabel} 문제` : undefined}
            renderBlank={(blank) => (
                <span className={`practice-review-card__blank practice-review-card__blank--${blank.correct ? 'correct' : 'wrong'}`}>
                    <span className="practice-review-card__input">{blank.input || '미작성'}</span>
                    <span className="practice-review-card__reader">{blank.correct ? '정답' : '오답'}</span>
                    {!blank.correct && <em className="practice-review-card__answer">정답 {blank.answer}</em>}
                </span>
            )}
        />
    );
}

export default PracticeReviewCard;
