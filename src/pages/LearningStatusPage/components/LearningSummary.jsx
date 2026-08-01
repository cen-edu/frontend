const summaryItems = [
    { key: 'assignments', label: '진행 중 학습', icon: 'bi-journal-text', tone: 'blue' },
    { key: 'submitted', label: '제출 완료', icon: 'bi-check-circle', tone: 'green' },
    { key: 'inProgress', label: '학습 중', icon: 'bi-hourglass-split', tone: 'purple' },
    { key: 'notStarted', label: '미시작', icon: 'bi-exclamation-circle', tone: 'orange' },
];

function LearningSummary({ summary }) {
    return (
        <div className="learning-summary" aria-label="학습 현황 요약">
            {summaryItems.map((item) => (
                <article key={item.key} className={`learning-summary__card learning-summary__card--${item.tone}`}>
                    <span className="learning-summary__icon"><i className={`bi ${item.icon}`} aria-hidden="true" /></span>
                    <div>
                        <p>{item.label}</p>
                        <strong>{summary[item.key]}<small>{item.key === 'assignments' ? '개' : '명'}</small></strong>
                    </div>
                </article>
            ))}
        </div>
    );
}

export default LearningSummary;
