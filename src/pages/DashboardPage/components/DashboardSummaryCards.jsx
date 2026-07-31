const cardStyles = {
    students: { icon: 'bi-people-fill', tone: 'blue' },
    assignments: { icon: 'bi-file-earmark-text-fill', tone: 'purple' },
    pending: { icon: 'bi-hourglass-split', tone: 'orange' },
    accuracy: { icon: 'bi-graph-up-arrow', tone: 'green' },
};

function DashboardSummaryCards({ summaries }) {
    return (
        <section className="dashboard-page__summaries" aria-label="반 학습 요약">
            {summaries.map((summary) => {
                const style = cardStyles[summary.id];

                return (
                    <article key={summary.id} className={`summary-card summary-card--${style.tone}`}>
                        <div className="summary-card__icon" aria-hidden="true">
                            <i className={`bi ${style.icon}`} />
                        </div>
                        <div className="summary-card__content">
                            <p className="summary-card__label">{summary.label}</p>
                            <strong className="summary-card__value">{summary.value}</strong>
                            <p className={`summary-card__support${summary.trend ? ` summary-card__support--${summary.trend}` : ''}`}>
                                {summary.trend && <i className={`bi bi-caret-${summary.trend === 'up' ? 'up' : 'down'}-fill`} aria-hidden="true" />}
                                {summary.support}
                            </p>
                        </div>
                    </article>
                );
            })}
        </section>
    );
}

export default DashboardSummaryCards;
