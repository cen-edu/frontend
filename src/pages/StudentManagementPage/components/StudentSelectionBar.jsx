function StudentSelectionBar({ selectedCount, onChangeStatus, onClear }) {
    if (selectedCount === 0) return null;

    return (
        <div className="student-list__selection-bar" role="region" aria-label="선택 학생 상태 변경">
            <strong>학생 {selectedCount}명 선택됨</strong>
            <div className="student-list__selection-actions">
                <button type="button" onClick={() => onChangeStatus('active')}>
                    <i className="bi bi-check-circle" aria-hidden="true" />
                    활성
                </button>
                <button type="button" onClick={() => onChangeStatus('inactive')}>
                    <i className="bi bi-slash-circle" aria-hidden="true" />
                    비활성
                </button>
                <button type="button" className="student-list__selection-close" aria-label="선택 해제" onClick={onClear}>
                    <i className="bi bi-x-lg" aria-hidden="true" />
                </button>
            </div>
        </div>
    );
}

export default StudentSelectionBar;
