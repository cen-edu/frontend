function ResultBreakdown({ title, description, items, comparisonItems = null }) {
    return (
        <section className="diagnosis-card result-breakdown">
            <div className="diagnosis-card__heading"><div><span>{description}</span><h2>{title}</h2></div></div>
            <div className="result-breakdown__rows">
                {items.map((item) => {
                    const comparison = comparisonItems?.find((value) => value.key === item.key);
                    const hasRate = item.rate !== null && item.rate !== undefined;
                    const displayRate = hasRate ? `${item.rate}%` : '-';
                    const barWidth = hasRate ? Math.min(100, Math.max(0, item.rate)) : 0;
                    const isReferenceOnly = item.referenceOnly ?? item.questionCount < 2;
                    return <div className={isReferenceOnly ? 'result-breakdown__row result-breakdown__row--reference' : 'result-breakdown__row'} key={item.key}>
                        <div><strong>{item.label}</strong><small>{item.questionCount}문항{isReferenceOnly ? ' · 표본 부족' : ''}</small></div>
                        <div className="result-breakdown__bars">
                            <span className="result-breakdown__bar"><i style={{ width: `${barWidth}%` }} /><b>{displayRate}</b></span>
                            {comparison && <span className="result-breakdown__bar result-breakdown__bar--comparison"><i style={{ width: `${comparison.rate == null ? 0 : Math.min(100, Math.max(0, comparison.rate))}%` }} /><b>{comparison.rate == null ? '-' : `${comparison.rate}%`}</b></span>}
                        </div>
                    </div>;
                })}
            </div>
            {comparisonItems && <div className="analysis-legend"><span><i /> 학생</span><span><i /> 학급</span></div>}
        </section>
    );
}

export default ResultBreakdown;
