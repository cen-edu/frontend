import CustomSelect from '../../../components/common/CustomSelect/CustomSelect';

function ClassToolbar({
    yearFilter,
    yearOptions,
    onYearFilterChange,
    gradeFilter,
    gradeOptions,
    onGradeFilterChange,
    searchTerm,
    onSearchTermChange,
    onOpenCreate,
}) {
    const submitSearch = (event) => event.preventDefault();

    return (
        <div className="class-management__toolbar">
            <div className="class-management__filters">
                <CustomSelect
                    label="학년도 필터"
                    value={yearFilter}
                    options={yearOptions}
                    onChange={onYearFilterChange}
                    width={132}
                />
                <CustomSelect
                    label="학년 필터"
                    value={gradeFilter}
                    options={gradeOptions}
                    onChange={onGradeFilterChange}
                    width={112}
                />
            </div>

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
                    반 만들기
                </button>
            </div>
        </div>
    );
}

export default ClassToolbar;
