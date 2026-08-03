import CustomCheckbox from '../../../components/common/CustomCheckbox/CustomCheckbox';
import { formatLabels } from '../../../mocks/assessmentCreation';

function GradingAnswerCard({ student, answer, question, rubricChecks, onScore, onRubric }) {
    const isUnsubmitted = !answer?.input;
    const isAuto = question.gradingStatus === 'auto';
    const selectedChoice = question.format === 'choice' ? question.choices?.[Number(answer?.input) - 1] : null;

    return (
        <article className={`grading-answer-card${isAuto ? ' grading-answer-card--auto' : ''}`}>
            <div className="grading-answer-card__header">
                <div><span>{question.no}번</span><strong>{formatLabels[question.format]}</strong>{isAuto && <em>자동 채점</em>}</div>
                {typeof answer?.score === 'number' && <span className="grading-answer-card__result">{answer.score}/{question.maxScore} <i className="bi bi-check-circle-fill" aria-hidden="true" /></span>}
            </div>
            <p className="grading-answer-card__prompt">{question.prompt}</p>
            <div className="grading-answer-card__response"><span>{student.name}의 답</span><p className={isUnsubmitted ? 'grading-answer-card__answer grading-answer-card__answer--empty' : 'grading-answer-card__answer'}>{isUnsubmitted ? '미제출' : answer.input}</p></div>
            {selectedChoice && <p className="grading-answer-card__auto-result">선택 보기: {selectedChoice}</p>}
            {question.format === 'short' && typeof answer?.autoScore === 'number' && answer.autoScore !== question.maxScore && <p className="grading-answer-card__auto-result"><i className="bi bi-exclamation-triangle-fill" aria-hidden="true" /> 자동 채점 오답 · 정답 “{question.answer}”</p>}
            {!isAuto && <div className="grading-answer-card__grading">
                <div className="grading-answer-card__model"><span>모범답안</span><p>{question.answer}</p></div>
                <div className="grading-answer-card__scores" aria-label={`${student.name} ${question.no}번 점수 선택`}>
                    {Array.from({ length: question.maxScore + 1 }, (_, score) => <button key={score} type="button" className={answer?.score === score ? 'grading-answer-card__score grading-answer-card__score--selected' : 'grading-answer-card__score'} disabled={isUnsubmitted} onClick={() => onScore(score)}>{score}점</button>)}
                </div>
                {!!question.rubric.length && <div className="grading-answer-card__rubric">
                    {question.rubric.map((item, index) => <div key={item.label} className="grading-answer-card__rubric-row"><CustomCheckbox label={`${item.label} ${item.score}점`} checked={rubricChecks[index]} disabled={isUnsubmitted} onChange={() => onRubric(index)} /><span>{item.label}</span><strong>{item.score}점</strong></div>)}
                </div>}
            </div>}
        </article>
    );
}

export default GradingAnswerCard;
