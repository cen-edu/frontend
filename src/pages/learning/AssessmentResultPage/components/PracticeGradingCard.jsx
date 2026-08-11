import { PracticeProblemView } from '../../../../components/common/worksheets';
import './PracticeGradingCard.scss';

const blankStateLabels = { correct: '정답', wrong: '오답', empty: '미작성' };

const getBlankState = (blank) => {
    if (!blank?.input) return 'empty';
    return blank.correct ? 'correct' : 'wrong';
};

// 학생이 보는 풀이 화면 위에서 그대로 채점한다.
// 풀이 과정에는 학생이 필기로 쓴 답을 채워 두고, 칸마다 정답·오답만 다시 판정한다.
function PracticeGradingCard({ student, question, answer, footer, onMark }) {
    const blanks = Object.fromEntries((answer?.blanks ?? []).map((blank) => [blank.blankId, blank]));

    return (
        <PracticeProblemView
            problem={question}
            headingId="practice-grading-problem-title"
            footer={footer}
            renderBlank={(segment) => {
                const blank = blanks[segment.id];
                const state = getBlankState(blank);
                return (
                    <span className={`practice-grading-card__blank practice-grading-card__blank--${state}`}>
                        <span className="practice-grading-card__input">{blank?.input || '미작성'}</span>
                        <span className="practice-grading-card__reader">{blankStateLabels[state]}</span>
                        {state === 'wrong' && <em className="practice-grading-card__answer">정답 {segment.answer}</em>}
                    </span>
                );
            }}
            renderAnswer={(segment, step) => {
                const blank = blanks[segment.id];
                const state = getBlankState(blank);
                const isUnanswered = state === 'empty';

                // 필기·인식된 답·정답·판정을 같은 높이의 칸으로 나란히 두어 한 줄에서 비교한다.
                return (
                    <div key={segment.id} className="practice-grading-card__marking">
                        <div className="practice-grading-card__field practice-grading-card__field--scan">
                            <span className="practice-grading-card__field-label">
                                <i className="bi bi-pencil" aria-hidden="true" /> 학생 필기
                            </span>
                            <div className="practice-grading-card__field-body">
                                {blank?.answerImage
                                    ? <img src={blank.answerImage} alt={`${student.name} 학생이 ${step.label}에 필기로 쓴 원본 답안`} />
                                    : <p className="practice-grading-card__field-empty">필기 기록이 없습니다.</p>}
                            </div>
                        </div>

                        <div className="practice-grading-card__field">
                            <span className="practice-grading-card__field-label">인식된 답</span>
                            <div className="practice-grading-card__field-body">
                                <p className={isUnanswered ? 'practice-grading-card__field-empty' : 'practice-grading-card__field-value'}>
                                    {blank?.input || '미작성'}
                                </p>
                            </div>
                        </div>

                        <div className="practice-grading-card__field practice-grading-card__field--marks">
                            <span className="practice-grading-card__field-label">판정</span>
                            <div className="practice-grading-card__field-body">
                                <div className="practice-grading-card__marks" role="group" aria-label={`${student.name} 학생 ${question.no}번 ${step.label} 판정`}>
                                    <button
                                        type="button"
                                        aria-pressed={state === 'correct'}
                                        disabled={isUnanswered}
                                        className={`practice-grading-card__mark practice-grading-card__mark--correct${state === 'correct' ? ' practice-grading-card__mark--selected' : ''}`}
                                        onClick={() => onMark(segment.id, true)}
                                    >
                                        <i className="bi bi-circle" aria-hidden="true" /> 정답
                                    </button>
                                    <button
                                        type="button"
                                        aria-pressed={state === 'wrong'}
                                        disabled={isUnanswered}
                                        className={`practice-grading-card__mark practice-grading-card__mark--wrong${state === 'wrong' ? ' practice-grading-card__mark--selected' : ''}`}
                                        onClick={() => onMark(segment.id, false)}
                                    >
                                        <i className="bi bi-x-lg" aria-hidden="true" /> 오답
                                    </button>
                                </div>
                                <p className="practice-grading-card__note">
                                    {isUnanswered
                                        ? '필기가 없어 판정할 수 없어요.'
                                        : blank.gradedBy === 'teacher' ? '선생님이 바꾼 판정입니다.' : '자동 채점 결과입니다.'}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            }}
        />
    );
}

export default PracticeGradingCard;
