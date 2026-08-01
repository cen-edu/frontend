function ResultSummaryBar({ worksheet, metrics, onGrade, onConfirm }) {
    return (
        <div className="result-summary">
            <div>
                <span className="result-summary__context">{worksheet.className} · {worksheet.type === 'assessment' ? '종합평가' : '일반 학습'}</span>
                <h2>{worksheet.title}</h2>
                <p>평균 <strong>{metrics.average}점</strong><span />최고 {metrics.highest}<span />최저 {metrics.lowest}</p>
            </div>
            <div className="result-summary__actions">
                {worksheet.modified && <span className="result-summary__modified">수정됨</span>}
                <button type="button" className="result-summary__grade" disabled={!metrics.pendingCount} onClick={onGrade}>채점하기 <i className="bi bi-arrow-right" aria-hidden="true" /></button>
                <button type="button" className="result-summary__confirm" disabled={metrics.pendingCount > 0 || worksheet.status === 'confirmed'} onClick={onConfirm}>{worksheet.status === 'confirmed' ? '확정됨' : '확정하기'}</button>
            </div>
        </div>
    );
}

export default ResultSummaryBar;
