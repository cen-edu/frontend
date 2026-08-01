const summaryItems = [
    { key: 'assignments', label: '진행 중 학습', icon: 'bi-journal-text', tone: 'blue' },
    { key: 'submitted', label: '제출 완료', icon: 'bi-check-circle', tone: 'green' },
    { key: 'inProgress', label: '학습 중', icon: 'bi-hourglass-split', tone: 'purple' },
    { key: 'unsubmitted', label: '미제출', icon: 'bi-exclamation-circle', tone: 'orange' },
];

function LearningSummary({ summary, activeKey, onSelect }) {
    return (
        <div className="learning-summary" aria-label="학습 현황 요약">
            {summaryItems.map((item) => (
                <button
                    key={item.key}
                    type="button"
                    className={`learning-summary__card learning-summary__card--${item.tone}${activeKey === item.key ? ' learning-summary__card--active' : ''}`}
                    aria-pressed={activeKey === item.key}
                    onClick={() => onSelect(item.key)}
                >
                    <span className="learning-summary__icon"><i className={`bi ${item.icon}`} aria-hidden="true" /></span>
                    <div>
                        <p>{item.label}</p>
                        <strong>{summary[item.key]}<small>{item.key === 'assignments' ? '개' : '명'}</small></strong>
                    </div>
                </button>
            ))}
        </div>
    );
}

export default LearningSummary;
