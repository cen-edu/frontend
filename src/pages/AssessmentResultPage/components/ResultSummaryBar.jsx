function ResultSummaryBar({ worksheet, metrics, onGrade, onConfirm }) {
    const unit = worksheet.type === 'assessment' ? '점' : '개';
    // 일반 학습 채점 화면은 실제 학습 페이지 구현 이후 다시 만들 예정이라 지금은 종합 평가만 채점할 수 있다.
    const canGrade = worksheet.type === 'assessment' && metrics.pendingCount > 0;
    return (
        <div className="result-summary">
            <div>
                <span className="result-summary__context">{worksheet.className} · {worksheet.type === 'assessment' ? '종합 평가' : '일반 학습'}</span>
                <h2>{worksheet.title}</h2>
                <p>평균 <strong>{metrics.average}{unit}</strong><span />최고 {metrics.highest}{unit}<span />최저 {metrics.lowest}{unit}</p>
            </div>
            <div className="result-summary__actions">
                <button type="button" className="result-summary__grade" disabled={!canGrade} onClick={onGrade}>채점</button>
                <button type="button" className="result-summary__confirm" disabled={metrics.pendingCount > 0 || worksheet.status === 'confirmed'} onClick={onConfirm}>{worksheet.status === 'confirmed' ? '확정됨' : '확정하기'}</button>
            </div>
        </div>
    );
}

export default ResultSummaryBar;
