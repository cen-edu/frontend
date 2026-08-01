import { forwardRef } from 'react';
import CustomCheckbox from '../../../components/common/CustomCheckbox/CustomCheckbox';

const GradingAnswerCard = forwardRef(function GradingAnswerCard({ student, answer, question, active, rubricChecks, onActivate, onScore, onRubric }, ref) {
    const isUnsubmitted = !answer.input;
    return (
        <article ref={ref} className={`grading-answer-card${active ? ' grading-answer-card--active' : ''}`} onClick={onActivate}>
            <div className="grading-answer-card__header">
                <div><span>{student.number}번</span><strong>{student.name}</strong></div>
                {answer.score !== null && <span className="grading-answer-card__result">{answer.score}/{question.maxScore} <i className="bi bi-check-circle-fill" aria-hidden="true" /></span>}
            </div>
            <p className={isUnsubmitted ? 'grading-answer-card__answer grading-answer-card__answer--empty' : 'grading-answer-card__answer'}>{isUnsubmitted ? '미제출' : answer.input}</p>
            {question.format === 'short' && answer.autoScore !== null && answer.autoScore !== question.maxScore && <p className="grading-answer-card__auto"><i className="bi bi-exclamation-triangle-fill" aria-hidden="true" /> 자동: 오답 · 정답 “{question.answer}”</p>}
            <div className="grading-answer-card__scores" aria-label={`${student.name} 점수 선택`}>
                {Array.from({ length: question.maxScore + 1 }, (_, score) => <button key={score} type="button" className={answer.score === score ? 'grading-answer-card__score grading-answer-card__score--selected' : 'grading-answer-card__score'} disabled={isUnsubmitted} onClick={(event) => { event.stopPropagation(); onScore(score); }}>{score}</button>)}
            </div>
            {!!question.rubric.length && <div className="grading-answer-card__rubric">
                {question.rubric.map((item, index) => <div key={item.label} className="grading-answer-card__rubric-row"><CustomCheckbox label={`${item.label} ${item.score}점`} checked={rubricChecks[index]} disabled={isUnsubmitted} onChange={() => onRubric(index)} /><span>{item.label}</span><strong>{item.score}점</strong></div>)}
            </div>}
        </article>
    );
});

export default GradingAnswerCard;
