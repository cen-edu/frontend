import { questionResultLabels } from '../../../../mocks/labels';
import './ReviewResultStrip.scss';

// 학생 채점 결과 화면과 교사 채점 화면이 같은 문항별 결과 막대를 사용한다.
function ReviewResultStrip({
    summary,
    questions,
    currentIndex,
    onSelect,
    selectionMode = false,
    selectedQuestionNos = [],
    onToggleSelection,
}) {
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
                    {summary.pendingCount > 0 && ` · 채점 대기 ${summary.pendingCount}`}
                </span>
            </div>

            <div className="review-result-strip__list">
                {questions.map((question, index) => {
                    const selected = selectedQuestionNos.includes(question.no);
                    return (
                        <button
                            key={question.no}
                            type="button"
                            aria-current={!selectionMode && currentIndex === index ? 'true' : undefined}
                            aria-pressed={selectionMode ? selected : undefined}
                            aria-label={`${question.no}번 ${questionResultLabels[question.result]}${selectionMode ? `, AI 채점 ${selected ? '선택됨' : '선택 안 됨'}` : ''}`}
                            className={`review-result-strip__item review-result-strip__item--${question.result}${!selectionMode && currentIndex === index ? ' review-result-strip__item--current' : ''}${selected ? ' review-result-strip__item--selected' : ''}`}
                            onClick={() => selectionMode ? onToggleSelection?.(question.no) : onSelect(index)}
                        >
                            {question.no}
                            {selected && (
                                <svg className="review-result-strip__selection-border" aria-hidden="true">
                                    <rect />
                                </svg>
                            )}
                        </button>
                    );
                })}
            </div>
        </section>
    );
}

export default ReviewResultStrip;
