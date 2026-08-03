import { getWorksheetWrongCount, wrongAnswerStatusLabels } from '../../../mocks/wrongAnswer';

function WrongAnswerWorksheetList({ worksheets, selectedId, onSelect }) {
    return (
        <aside className="wrong-answer-panel wrong-answer-worksheets" aria-label="오답 학습 목록">
            <header className="wrong-answer-panel__header">
                <div><h2>학습 목록</h2><p>오답이 발생한 학습만 표시돼요.</p></div>
                <span className="wrong-answer-panel__count">{worksheets.length}개</span>
            </header>
            <div className="wrong-answer-worksheets__list">
                {worksheets.map((worksheet) => (
                    <button key={worksheet.id} type="button" className={`wrong-answer-worksheets__item${selectedId === worksheet.id ? ' wrong-answer-worksheets__item--active' : ''}`} onClick={() => onSelect(worksheet.id)}>
                        <span className="wrong-answer-worksheets__meta"><span>{worksheet.className}</span><span className={`wrong-answer-type wrong-answer-type--${worksheet.type}`}>{worksheet.type === 'assessment' ? '종합 평가' : '일반 학습'}</span></span>
                        <strong>{worksheet.title}</strong>
                        <span className="wrong-answer-worksheets__summary"><span>오답 {getWorksheetWrongCount(worksheet)}건</span><span className={`wrong-answer-status wrong-answer-status--${worksheet.assignStatus}`}>{wrongAnswerStatusLabels[worksheet.assignStatus]}</span></span>
                    </button>
                ))}
                {!worksheets.length && <div className="wrong-answer-worksheets__empty"><i className="bi bi-journal-check" aria-hidden="true" /><p>조건에 맞는 학습이 없어요.</p></div>}
            </div>
        </aside>
    );
}

export default WrongAnswerWorksheetList;
