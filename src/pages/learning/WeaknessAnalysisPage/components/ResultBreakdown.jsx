function ResultBreakdown({ title, description, items, comparisonItems = null }) {
    const clampRate = (rate) => Math.min(100, Math.max(0, rate));

    if (comparisonItems) {
        const chart = { width: 600, height: 270, left: 44, right: 12, top: 24, bottom: 205 };
        const plotWidth = chart.width - chart.left - chart.right;
        const plotHeight = chart.bottom - chart.top;
        const groupWidth = plotWidth / Math.max(items.length, 1);
        const barWidth = Math.min(40, groupWidth * .28);
        const barGap = Math.min(10, groupWidth * .06);

        return (
            <section className="diagnosis-card result-breakdown result-breakdown--vertical">
                <div className="diagnosis-card__heading"><div><span>{description}</span><h2>{title}</h2></div></div>
                <div className="result-breakdown__vertical-chart" role="img" aria-label={`${title}. 학생과 학급의 정답률을 문항 유형별로 비교한 세로 막대그래프`}>
                    <svg viewBox={`0 0 ${chart.width} ${chart.height}`} aria-hidden="true">
                        {[100, 75, 50, 25, 0].map((tick) => {
                            const y = chart.top + ((100 - tick) / 100) * plotHeight;
                            return <g key={tick}>
                                <line className="result-breakdown__grid-line" x1={chart.left} x2={chart.width - chart.right} y1={y} y2={y} />
                                <text className="result-breakdown__axis-label" x={chart.left - 9} y={y + 4} textAnchor="end">{tick}%</text>
                            </g>;
                        })}
                        {items.map((item, index) => {
                            const comparison = comparisonItems.find((value) => value.key === item.key);
                            const hasStudentRate = item.rate !== null && item.rate !== undefined;
                            const hasClassRate = comparison?.rate !== null && comparison?.rate !== undefined;
                            const isReferenceOnly = item.referenceOnly ?? item.questionCount < 2;
                            const center = chart.left + groupWidth * (index + .5);
                            const studentRate = hasStudentRate ? clampRate(item.rate) : 0;
                            const classRate = hasClassRate ? clampRate(comparison.rate) : 0;
                            const studentY = chart.bottom - (studentRate / 100) * plotHeight;
                            const classY = chart.bottom - (classRate / 100) * plotHeight;
                            const studentX = center - barGap / 2 - barWidth;
                            const classX = center + barGap / 2;

                            return <g className={isReferenceOnly ? 'result-breakdown__svg-group result-breakdown__svg-group--reference' : 'result-breakdown__svg-group'} key={item.key}>
                                {hasStudentRate && <rect className="result-breakdown__vertical-bar" x={studentX} y={studentY} width={barWidth} height={chart.bottom - studentY} rx="4" />}
                                {hasClassRate && <rect className="result-breakdown__vertical-bar result-breakdown__vertical-bar--comparison" x={classX} y={classY} width={barWidth} height={chart.bottom - classY} rx="4" />}
                                <text className="result-breakdown__value" x={studentX + barWidth / 2} y={Math.max(13, studentY - 7)} textAnchor="middle">{hasStudentRate ? `${item.rate}%` : '-'}</text>
                                <text className="result-breakdown__value" x={classX + barWidth / 2} y={Math.max(13, classY - 7)} textAnchor="middle">{hasClassRate ? `${comparison.rate}%` : '-'}</text>
                                <text className="result-breakdown__category" x={center} y="229" textAnchor="middle">{item.label}</text>
                                <text className="result-breakdown__count" x={center} y="248" textAnchor="middle">{item.questionCount}문항{isReferenceOnly ? ' · 표본 부족' : ''}</text>
                            </g>;
                        })}
                    </svg>
                </div>
                <div className="analysis-legend"><span><i /> 학생</span><span><i /> 학급</span></div>
            </section>
        );
    }

    return (
        <section className="diagnosis-card result-breakdown">
            <div className="diagnosis-card__heading"><div><span>{description}</span><h2>{title}</h2></div></div>
            <div className="result-breakdown__rows">
                {items.map((item) => {
                    const comparison = comparisonItems?.find((value) => value.key === item.key);
                    const hasRate = item.rate !== null && item.rate !== undefined;
                    const displayRate = hasRate ? `${item.rate}%` : '-';
                    const barWidth = hasRate ? clampRate(item.rate) : 0;
                    const isReferenceOnly = item.referenceOnly ?? item.questionCount < 2;
                    return <div className={isReferenceOnly ? 'result-breakdown__row result-breakdown__row--reference' : 'result-breakdown__row'} key={item.key}>
                        <div><strong>{item.label}</strong><small>{item.questionCount}문항{isReferenceOnly ? ' · 표본 부족' : ''}</small></div>
                        <div className="result-breakdown__bars">
                            <span className="result-breakdown__bar"><i style={{ width: `${barWidth}%` }} /><b>{displayRate}</b></span>
                        </div>
                    </div>;
                })}
            </div>
        </section>
    );
}

export default ResultBreakdown;
