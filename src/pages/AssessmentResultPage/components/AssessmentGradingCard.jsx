import { difficultyLabels, formatLabels, questionResultLabels } from '../../../mocks/labels';
import './AssessmentGradingCard.scss';

// 종합 평가 채점 카드. 학생 채점 결과 화면(AssessmentReviewCard)과 같은 색·크기를 쓰고,
// 채점 기준·점수처럼 교사가 바꿀 수 있는 부분만 아래에 덧붙인다.
function AssessmentGradingCard({ student, question, answer, result, rubricChecks, footer, onScore, onRubric }) {
    const isUnsubmitted = !answer?.input;
    const isChoice = question.format === 'choice';
    const isEssay = question.format === 'essay';
    const selectedChoiceIndex = isChoice ? Number(answer?.input) - 1 : -1;
    const correctChoiceIndex = isChoice ? Number(question.answer) - 1 : -1;
    // 객관식은 맞고 틀림만 있고, 나머지는 배점 안에서 1점 단위로 고른다.
    const scoreOptions = isChoice ? [0, question.maxScore] : Array.from({ length: question.maxScore + 1 }, (_, score) => score);
    // 채점 기준이 있는 문항은 기준을 체크해 점수를 만든다. 주관식은 기준이 정답 하나뿐이라 점수 버튼만 쓴다.
    const hasRubric = question.format !== 'short' && question.rubric?.length > 0;
    const isAutoGraded = question.gradingStatus === 'auto';

    return (
        <article className="assessment-grading-card" aria-labelledby="assessment-grading-problem-title">
            <div className="assessment-grading-card__heading">
                <div>
                    <span>{question.no}번 · {formatLabels[question.format]} · 난이도 {difficultyLabels[question.difficulty]}</span>
                    <h2 id="assessment-grading-problem-title">{question.prompt}</h2>
                </div>
                <span className={`assessment-grading-card__score-box assessment-grading-card__score-box--${result}`}>
                    <strong>{answer?.score === null || answer?.score === undefined ? '—' : `${answer.score}점`}</strong>
                    <em>{question.maxScore}점 만점 · {questionResultLabels[result]}</em>
                </span>
            </div>

            {isChoice ? (
                <ol className="assessment-grading-card__choices" aria-label={`${question.no}번 객관식 보기`}>
                    {question.choices.map((choice, index) => {
                        const isPicked = index === selectedChoiceIndex;
                        const isAnswer = index === correctChoiceIndex;
                        return (
                            <li
                                key={`${index}-${choice}`}
                                className={`assessment-grading-card__choice${isAnswer ? ' assessment-grading-card__choice--answer' : ''}${isPicked && !isAnswer ? ' assessment-grading-card__choice--picked' : ''}`}
                            >
                                <b>{index + 1}</b>
                                <span>{choice}</span>
                                {isPicked && <em>{student.name}의 답</em>}
                                {isAnswer && <strong>정답</strong>}
                            </li>
                        );
                    })}
                    {isUnsubmitted && <li className="assessment-grading-card__choice-empty"><i className="bi bi-dash-circle" aria-hidden="true" /> 미제출 · 선택한 보기가 없습니다</li>}
                </ol>
            ) : (
                <>
                    {!isUnsubmitted && answer?.answerImage && (
                        <figure className="assessment-grading-card__scan">
                            <figcaption><i className="bi bi-pencil" aria-hidden="true" /> {student.name} 학생 필기 원본</figcaption>
                            <img src={answer.answerImage} alt={`${student.name} 학생이 필기로 작성한 ${question.no}번 원본 답안`} />
                        </figure>
                    )}
                    <div className="assessment-grading-card__answers">
                        <div className="assessment-grading-card__answer-block">
                            <span>{student.name}의 답</span>
                            <p className={isUnsubmitted ? 'assessment-grading-card__answer-empty' : undefined}>{answer?.input || '미제출'}</p>
                        </div>
                        <div className="assessment-grading-card__answer-block assessment-grading-card__answer-block--correct">
                            <span>{isEssay ? '모범답안' : '정답'}</span>
                            <p>{question.answer}</p>
                        </div>
                    </div>
                </>
            )}

            {hasRubric && (
                <div className="assessment-grading-card__rubric">
                    <div className="assessment-grading-card__rubric-heading">
                        <h3>채점 기준</h3>
                        {isAutoGraded && <span><i className="bi bi-stars" aria-hidden="true" /> 자동 채점 결과</span>}
                    </div>
                    <ul>
                        {question.rubric.map((item, index) => {
                            const satisfied = rubricChecks[index] === true;
                            const evidence = answer?.rubricResults?.[index]?.evidence;
                            return (
                                <li key={item.label}>
                                    <button
                                        type="button"
                                        aria-pressed={satisfied}
                                        disabled={isUnsubmitted}
                                        className={`assessment-grading-card__rubric-item${satisfied ? ' assessment-grading-card__rubric-item--met' : ''}`}
                                        onClick={() => onRubric(index)}
                                    >
                                        <i className={`bi bi-${satisfied ? 'check-circle-fill' : 'circle'}`} aria-hidden="true" />
                                        <div>
                                            <strong>{item.label}</strong>
                                            {isAutoGraded && <p className={evidence ? undefined : 'assessment-grading-card__evidence-empty'}>{evidence ? `답안에서 확인된 부분: ${evidence}` : '답안에서 일치하는 내용 없음'}</p>}
                                        </div>
                                        <span>{satisfied ? item.score : 0}/{item.score}점</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}

            <div className="assessment-grading-card__marking">
                <span className="assessment-grading-card__marking-label">판정</span>
                <div className="assessment-grading-card__scores" role="group" aria-label={`${student.name} 학생 ${question.no}번 점수 선택`}>
                    {scoreOptions.map((score) => (
                        <button
                            key={score}
                            type="button"
                            aria-pressed={answer?.score === score}
                            disabled={isUnsubmitted}
                            className={`assessment-grading-card__score${answer?.score === score ? ' assessment-grading-card__score--selected' : ''}`}
                            onClick={() => onScore(score)}
                        >
                            {score}점
                        </button>
                    ))}
                </div>
                <p className="assessment-grading-card__note">
                    {isUnsubmitted
                        ? '제출한 답안이 없어 점수를 줄 수 없어요.'
                        : answer?.score === null ? '아직 점수를 매기지 않았습니다.'
                            : answer?.gradedBy === 'teacher' ? '선생님이 바꾼 점수입니다.' : '자동 채점 점수입니다.'}
                </p>
            </div>

            {footer}
        </article>
    );
}

export default AssessmentGradingCard;
