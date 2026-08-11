function StudentSelectionBar({ selectedCount, onDelete, onClear }) {
    if (selectedCount === 0) return null;

    return (
        <div className="student-list__selection-bar" role="region" aria-label="선택 학생 관리">
            <strong>학생 {selectedCount}명 선택됨</strong>
            <div className="student-list__selection-actions">
                <button type="button" className="student-list__selection-delete" onClick={onDelete}>
                    <i className="bi bi-trash3" aria-hidden="true" />
                    삭제
                </button>
                <button type="button" className="student-list__selection-close" aria-label="선택 해제" onClick={onClear}>
                    <i className="bi bi-x-lg" aria-hidden="true" />
                </button>
            </div>
        </div>
    );
}

export default StudentSelectionBar;
