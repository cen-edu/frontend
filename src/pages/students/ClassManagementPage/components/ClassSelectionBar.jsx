function ClassSelectionBar({ selectedCount, onDelete, onClear, isDeleting }) {
    if (selectedCount === 0) return null;

    return (
        <div className="class-management__selection-bar" role="region" aria-label="선택 반 관리">
            <strong>반 {selectedCount}개 선택됨</strong>
            <div className="class-management__selection-actions">
                <button
                    type="button"
                    className="class-management__selection-delete"
                    onClick={onDelete}
                    disabled={isDeleting}
                >
                    <i className="bi bi-trash3" aria-hidden="true" />
                    {isDeleting ? '삭제 중...' : '삭제'}
                </button>
                <button
                    type="button"
                    className="class-management__selection-close"
                    aria-label="반 선택 해제"
                    onClick={onClear}
                    disabled={isDeleting}
                >
                    <i className="bi bi-x-lg" aria-hidden="true" />
                </button>
            </div>
        </div>
    );
}

export default ClassSelectionBar;
