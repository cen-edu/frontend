function StudentReminderBar({ selectedCount, allReminded, onClear, onRemind }) {
    if (!selectedCount) return null;

    return (
        <div className="student-reminder-bar" role="region" aria-label="선택 학생 학습 알림">
            <strong>{selectedCount}명 선택됨</strong>
            <div className="student-reminder-bar__actions">
                <button type="button" className="student-reminder-bar__clear" onClick={onClear}>선택 해제</button>
                <button type="button" className={`student-reminder-bar__send${allReminded ? ' student-reminder-bar__send--sent' : ''}`} onClick={onRemind}>
                    <i className={`bi ${allReminded ? 'bi-check2' : 'bi-bell'}`} aria-hidden="true" />
                    {allReminded ? '알림 전송 완료' : '학습 알림 보내기'}
                </button>
            </div>
        </div>
    );
}

export default StudentReminderBar;
