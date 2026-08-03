function ResultBreakdown({ title, description, items, comparisonItems = null }) {
    return (
        <section className="diagnosis-card result-breakdown">
            <div className="diagnosis-card__heading"><div><span>{description}</span><h2>{title}</h2></div></div>
            <div className="result-breakdown__rows">
                {items.map((item) => {
                    const comparison = comparisonItems?.find((value) => value.key === item.key);
                    return <div className="result-breakdown__row" key={item.key}>
                        <div><strong>{item.label}</strong><small>{item.questionCount}문항{item.questionCount < 2 ? ' · 참고용' : ''}</small></div>
                        <div className="result-breakdown__bars">
                            <span className="result-breakdown__bar"><i style={{ width: `${item.rate}%` }} /><b>{item.rate}%</b></span>
                            {comparison && <span className="result-breakdown__bar result-breakdown__bar--comparison"><i style={{ width: `${comparison.rate}%` }} /><b>{comparison.rate}%</b></span>}
                        </div>
                    </div>;
                })}
            </div>
            {comparisonItems && <div className="result-breakdown__legend"><span><i /> 학생</span><span><i /> 학급</span></div>}
        </section>
    );
}

export default ResultBreakdown;
