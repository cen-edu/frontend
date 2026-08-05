import { getPracticeQuestionResult } from '../../../mocks/assessmentResult';
import { difficultyLabels } from '../../../mocks/labels';

const resultLabels = { correct: '정답', partial: '부분 정답', wrong: '오답', empty: '미제출' };

// 학생 풀이 화면과 같은 순서로 풀이 과정을 보여주되 빈칸 자리에 학생이 쓴 답을 넣는다.
function StepFormula({ segments, blankInputs }) {
    return (
        <p className="practice-grading-card__formula">
            {segments.map((segment, index) => segment.type === 'text'
                ? <span key={`text-${index}`}>{segment.value}</span>
                : (
                    <span
                        key={segment.id}
                        className={`practice-grading-card__inline-blank${blankInputs[segment.id]?.correct ? '' : ' practice-grading-card__inline-blank--wrong'}`}
                    >
                        {blankInputs[segment.id]?.input || '미입력'}
                    </span>
                ))}
        </p>
    );
}

function PracticeGradingCard({ student, question, answer, onMark }) {
    const result = getPracticeQuestionResult(answer);
    const blanks = answer?.blanks ?? [];
    const blankInputs = Object.fromEntries(blanks.map((blank) => [blank.blankId, blank]));
    const correctCount = blanks.filter((blank) => blank.correct).length;

    return (
        <article className="grading-answer-card practice-grading-card">
            <div className="grading-answer-card__header">
                <div>
                    <span>{question.no}번</span>
                    <strong>난이도 {difficultyLabels[question.difficulty]}</strong>
                </div>
                <span className={`practice-grading-card__result practice-grading-card__result--${result}`}>
                    {resultLabels[result]} · 풀이 {correctCount}/{blanks.length}칸
                </span>
            </div>

            <p className="practice-grading-card__title">{question.title}</p>
            <p className="grading-answer-card__prompt">{question.prompt}</p>

            <div className="practice-grading-card__steps">
                {question.steps.map((step) => (
                    <section key={step.id} className="practice-grading-card__step">
                        <div className="practice-grading-card__step-heading">
                            <div className="practice-grading-card__step-heading-copy">
                                <span>{step.label}</span>
                                <strong>{step.instruction}</strong>
                            </div>
                            <div className="practice-grading-card__step-grading">
                                {step.blanks.map((blank) => {
                                    const blankAnswer = blankInputs[blank.id];
                                    const isUnanswered = !blankAnswer?.input;
                                    const isCorrect = blankAnswer?.correct === true;

                                    return (
                                        <div key={blank.id} className="practice-grading-card__blank-grading">
                                            <div className="practice-grading-card__marks" role="group" aria-label={`${student.name} ${question.no}번 ${step.label} 판정`}>
                                                <button
                                                    type="button"
                                                    aria-pressed={isCorrect}
                                                    disabled={isUnanswered}
                                                    className={`practice-grading-card__mark practice-grading-card__mark--correct${isCorrect ? ' practice-grading-card__mark--selected' : ''}`}
                                                    onClick={() => onMark(blank.id, true)}
                                                >
                                                    <i className="bi bi-circle" aria-hidden="true" /> 정답
                                                </button>
                                                <button
                                                    type="button"
                                                    aria-pressed={blankAnswer?.correct === false}
                                                    disabled={isUnanswered}
                                                    className={`practice-grading-card__mark practice-grading-card__mark--wrong${blankAnswer?.correct === false ? ' practice-grading-card__mark--selected' : ''}`}
                                                    onClick={() => onMark(blank.id, false)}
                                                >
                                                    <i className="bi bi-x-lg" aria-hidden="true" /> 오답
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <StepFormula segments={step.segments} blankInputs={blankInputs} />

                        {step.blanks.map((blank) => {
                            const blankAnswer = blankInputs[blank.id];
                            const isUnanswered = !blankAnswer?.input;

                            return (
                                <div key={blank.id} className="practice-grading-card__blank">
                                    <figure className="grading-answer-card__scan practice-grading-card__scan">
                                        <figcaption>
                                            <i className="bi bi-pencil" aria-hidden="true" /> {student.name}의 원본 필기
                                        </figcaption>
                                        {blankAnswer?.answerImage
                                            ? <img src={blankAnswer.answerImage} alt={`${student.name} 학생이 ${step.label}에 필기로 작성한 원본 답안`} />
                                            : <p className="practice-grading-card__scan-empty">필기 기록이 없습니다.</p>}
                                    </figure>

                                    <div className="practice-grading-card__blank-body">
                                        <div className="practice-grading-card__blank-answers">
                                            <div>
                                                <span>인식된 답</span>
                                                <p className={isUnanswered ? 'practice-grading-card__blank-empty' : ''}>
                                                    {blankAnswer?.input || '미입력'}
                                                </p>
                                            </div>
                                            <div>
                                                <span>정답</span>
                                                <p>{blank.answer}</p>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            );
                        })}
                    </section>
                ))}
            </div>
        </article>
    );
}

export default PracticeGradingCard;
