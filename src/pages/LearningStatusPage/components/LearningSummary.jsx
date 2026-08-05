const summaryItems = [
    { key: 'assignments', label: '진행 중 학습' },
    { key: 'submitted', label: '제출 완료' },
    { key: 'inProgress', label: '풀이 중' },
    { key: 'unsubmitted', label: '미제출', attention: true },
];

function LearningSummary({ summary, activeKey, onSelect }) {
    return (
        <div className="learning-summary" aria-label="학습 현황 요약">
            {summaryItems.map((item) => (
                <button
                    key={item.key}
                    type="button"
                    className={`learning-summary__card${item.attention ? ' learning-summary__card--attention' : ''}${activeKey === item.key ? ' learning-summary__card--active' : ''}`}
                    aria-pressed={activeKey === item.key}
                    onClick={() => onSelect(item.key)}
                >
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
