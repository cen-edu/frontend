import CustomCheckbox from '../../../components/common/CustomCheckbox/CustomCheckbox';
import { formatLabels } from '../../../mocks/assessmentCreation';

const practiceResults = [
    { value: 'correct', label: 'O', description: '정답' },
    { value: 'partial', label: '△', description: '부분 정답' },
    { value: 'wrong', label: 'X', description: '오답' },
];

function GradingAnswerCard({ student, answer, question, rubricChecks, onScore, onRubric, isPractice = false, onPracticeResult }) {
    const isUnsubmitted = !answer?.input;
    const isAuto = !isPractice && question.gradingStatus === 'auto';
    const isAutoEssay = question.format === 'essay' && isAuto;
    const isTeacherReviewed = answer?.gradedBy === 'teacher';
    const isChoiceReview = !isPractice && question.format === 'choice';
    const isShortAutoWrong = !isPractice && question.format === 'short' && typeof answer?.autoScore === 'number' && answer.autoScore !== question.maxScore;
    const selectedChoiceIndex = question.format === 'choice' ? Number(answer?.input) - 1 : -1;
    const correctChoiceIndex = question.format === 'choice' ? Number(question.answer) - 1 : -1;
    const studentAnswer = question.format === 'choice' && selectedChoiceIndex >= 0 ? `${answer.input}번 ${question.choices?.[selectedChoiceIndex]}` : answer?.input;
    const modelAnswer = question.format === 'choice' && correctChoiceIndex >= 0 ? `${question.answer}번 ${question.choices?.[correctChoiceIndex]}` : question.answer;
    const scoreOptions = question.format === 'choice' ? [0, question.maxScore] : Array.from({ length: question.maxScore + 1 }, (_, score) => score);
    const practiceResult = answer?.result ?? (typeof answer?.isCorrect === 'boolean' ? (answer.isCorrect ? 'correct' : 'wrong') : null);

    return (
        <article className={`grading-answer-card${isAuto ? ' grading-answer-card--auto' : ''}`}>
            <div className="grading-answer-card__header">
                <div><span>{question.no}번</span><strong>{formatLabels[question.format]}</strong>{isAuto && !isChoiceReview && <em>{isTeacherReviewed ? '교사 검토 완료' : '자동 채점 · 검토 가능'}</em>}</div>
                {isPractice && practiceResult && <span className={`grading-answer-card__practice-current grading-answer-card__practice-current--${practiceResult}`}>{practiceResults.find((item) => item.value === practiceResult)?.description}</span>}
                {!isPractice && typeof answer?.score === 'number' && <span className="grading-answer-card__result">{answer.score}/{question.maxScore} <i className="bi bi-check-circle-fill" aria-hidden="true" /></span>}
            </div>
            <p className="grading-answer-card__prompt">{question.prompt}</p>
            {!isChoiceReview && <div className={`grading-answer-card__response${isShortAutoWrong ? ' grading-answer-card__response--wrong' : ''}`}><span>{student.name}의 답</span><p className={isUnsubmitted ? 'grading-answer-card__answer grading-answer-card__answer--empty' : 'grading-answer-card__answer'}>{isUnsubmitted ? '미제출' : studentAnswer}</p></div>}
            {isChoiceReview && isUnsubmitted && <p className="grading-answer-card__choice-empty"><i className="bi bi-dash-circle" aria-hidden="true" /> 미제출 · 선택한 보기가 없습니다</p>}
            {isChoiceReview && <ol className="grading-answer-card__choices" aria-label={`${question.no}번 객관식 보기`}>
                {question.choices.map((choice, index) => {
                    const isSelected = index === selectedChoiceIndex;
                    const isCorrect = index === correctChoiceIndex;
                    const state = isCorrect ? ' grading-answer-card__choice--correct' : isSelected ? ' grading-answer-card__choice--wrong' : '';
                    return <li key={`${index}-${choice}`} className={`grading-answer-card__choice${isSelected ? ' grading-answer-card__choice--selected' : ''}${state}`}>
                        <span>{index + 1}</span><p>{choice}</p>
                        <div>
                            {isSelected && <em>학생 선택</em>}
                            {isCorrect && <strong>정답</strong>}
                        </div>
                    </li>;
                })}
            </ol>}
            {isPractice && <div className="grading-answer-card__grading grading-answer-card__grading--practice">
                <div className="grading-answer-card__model"><span>정답</span><p>{question.answer}</p></div>
                <div className="grading-answer-card__practice-results" role="group" aria-label={`${student.name} ${question.no}번 채점 결과`}>
                    {practiceResults.map((result) => <button key={result.value} type="button" className={`grading-answer-card__practice-result grading-answer-card__practice-result--${result.value}${practiceResult === result.value ? ' grading-answer-card__practice-result--selected' : ''}`} disabled={isUnsubmitted} aria-label={result.description} aria-pressed={practiceResult === result.value} onClick={() => onPracticeResult(result.value)}><strong>{result.label}</strong><span>{result.description}</span></button>)}
                </div>
            </div>}
            {!isPractice && isAutoEssay && <div className="grading-answer-card__auto-grading">
                <div className="grading-answer-card__auto-heading">
                    <div><i className="bi bi-stars" aria-hidden="true" /><strong>서술형 자동 채점 결과</strong></div>
                    <span>루브릭별 부분 점수를 합산했습니다.</span>
                </div>
                <div className="grading-answer-card__model"><span>모범답안</span><p>{modelAnswer}</p></div>
                <div className="grading-answer-card__rubric grading-answer-card__rubric--result">
                    {question.rubric.map((item, index) => {
                        const result = answer?.rubricResults?.[index];
                        const satisfied = result?.satisfied === true;
                        return <div key={item.label} className={`grading-answer-card__rubric-result${satisfied ? ' grading-answer-card__rubric-result--satisfied' : ''}`}>
                            <div className="grading-answer-card__rubric-summary">
                                <i className={`bi ${satisfied ? 'bi-check-circle-fill' : 'bi-dash-circle'}`} aria-hidden="true" />
                                <span><small>평가지표</small>{item.label}</span>
                                <strong>{satisfied ? item.score : 0}/{item.score}점</strong>
                            </div>
                            <div className="grading-answer-card__evidence">
                                <small>답안에서 확인된 부분</small>
                                <p className={!result?.evidence ? 'grading-answer-card__evidence-empty' : ''}>{result?.evidence ? `“${result.evidence}”` : '일치하는 내용 없음'}</p>
                            </div>
                        </div>;
                    })}
                </div>
            </div>}
            {!isPractice && <div className="grading-answer-card__grading">
                {isAuto && !isChoiceReview && <div className="grading-answer-card__review-heading"><strong>교사 검토</strong><span>자동 판정을 확인하고 점수나 루브릭을 조정할 수 있습니다.</span></div>}
                {!isChoiceReview && <div className="grading-answer-card__model"><span>모범답안</span><p>{question.answer}</p></div>}
                <div className="grading-answer-card__scores" aria-label={`${student.name} ${question.no}번 점수 선택`}>
                    {scoreOptions.map((score) => <button key={score} type="button" className={answer?.score === score ? 'grading-answer-card__score grading-answer-card__score--selected' : 'grading-answer-card__score'} disabled={isUnsubmitted} onClick={() => onScore(score)}>{score}점</button>)}
                </div>
                {question.format !== 'short' && !!question.rubric.length && <div className="grading-answer-card__rubric">
                    {question.rubric.map((item, index) => <div key={item.label} className="grading-answer-card__rubric-row"><CustomCheckbox label={`${item.label} ${item.score}점`} checked={rubricChecks[index]} disabled={isUnsubmitted} onChange={() => onRubric(index)} /><span>{item.label}</span><strong>{item.score}점</strong></div>)}
                </div>}
            </div>}
        </article>
    );
}

export default GradingAnswerCard;
