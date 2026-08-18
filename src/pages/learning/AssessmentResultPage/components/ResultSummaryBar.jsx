import { getWorksheetTypeLabel } from '../../../../mocks/labels';

const formatMetric = (value) => value ?? '-';

function ResultSummaryBar({ worksheet, metrics, onGrade, onConfirm, isConfirming, errorMessage }) {
    const unit = worksheet.type === 'assessment' ? '점' : '개';
    const canGrade = metrics.pendingCount > 0;
    return (
        <div className="result-summary">
            <div>
                <span className="result-summary__context">{worksheet.className} · {getWorksheetTypeLabel(worksheet)}{worksheet.modified ? ' · 확정 후 수정됨' : ''}</span>
                <h2>{worksheet.title}</h2>
                <p>평균 <strong>{formatMetric(metrics.average)}{metrics.average == null ? '' : unit}</strong><span />최고 {formatMetric(metrics.highest)}{metrics.highest == null ? '' : unit}<span />최저 {formatMetric(metrics.lowest)}{metrics.lowest == null ? '' : unit}</p>
            </div>
            <div className="result-summary__actions">
                {errorMessage && <span className="result-summary__error" role="alert">{errorMessage}</span>}
                <button type="button" className="result-summary__grade" disabled={!canGrade} onClick={onGrade}>채점</button>
                <button type="button" className="result-summary__confirm" disabled={metrics.pendingCount > 0 || worksheet.status === 'confirmed' || isConfirming} onClick={onConfirm}>{worksheet.status === 'confirmed' ? '확정됨' : isConfirming ? '확정 중...' : '확정하기'}</button>
            </div>
        </div>
    );
}

export default ResultSummaryBar;
