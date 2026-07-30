function ClassToolbar({ searchTerm, onSearchTermChange, onOpenCreate }) {
    const submitSearch = (event) => event.preventDefault();

    return (
        <div className="class-management__toolbar">
            <p className="class-management__guide">
                해당 반 정렬은 수업, 수업 준비에서 보여지는 반 순서에 반영됩니다.
            </p>

            <div className="class-management__actions">
                <form className="class-management__search" role="search" onSubmit={submitSearch}>
                    <input
                        type="search"
                        aria-label="반 이름 검색"
                        placeholder="반 이름 검색"
                        value={searchTerm}
                        onChange={(event) => onSearchTermChange(event.target.value)}
                    />
                    <button type="submit" aria-label="검색">
                        <i className="bi bi-search" aria-hidden="true" />
                    </button>
                </form>

                <button type="button" className="class-management__create-button" onClick={onOpenCreate}>
                    <i className="class-management__create-icon" aria-hidden="true" />
                    반 만들기
                </button>
            </div>
        </div>
    );
}

export default ClassToolbar;
