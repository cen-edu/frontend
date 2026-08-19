import { getWorksheetTypeLabel } from '../../../../mocks/labels';

const statusLabels = { grading: '채점 대기', graded: '채점 완료', confirmed: '확정됨' };

function ResultWorksheetList({ worksheets, selectedId, onSelect, emptyMessage = '조건에 맞는 학습이 없습니다.' }) {
    return (
        <aside className="result-worksheet-list" aria-label="학습 목록">
            <div className="result-worksheet-list__heading"><h2>학습 목록</h2><span>{worksheets.length}건</span></div>
            <div className="result-worksheet-list__items">
                {worksheets.map((worksheet) => (
                    <button key={worksheet.id} type="button" className={`result-worksheet-list__item${selectedId === worksheet.id ? ' result-worksheet-list__item--active' : ''}`} onClick={() => onSelect(worksheet.id)}>
                        <span className="result-worksheet-list__meta">{worksheet.className} · {getWorksheetTypeLabel(worksheet)}</span>
                        <strong>{worksheet.title}</strong>
                        <span className={`result-worksheet-list__status result-worksheet-list__status--${worksheet.status}`}>{statusLabels[worksheet.status]}</span>
                    </button>
                ))}
                {!worksheets.length && <p className="result-worksheet-list__empty">{emptyMessage}</p>}
            </div>
        </aside>
    );
}

export default ResultWorksheetList;
