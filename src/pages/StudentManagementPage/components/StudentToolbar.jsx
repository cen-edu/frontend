import CustomSelect from '../../../components/common/CustomSelect/CustomSelect';

const sortOptions = [
    { value: 'newest', label: '최신 등록순' },
    { value: 'name', label: '이름순' },
];

const statusOptions = [
    { value: 'all', label: '전체 상태' },
    { value: 'active', label: '활성' },
    { value: 'inactive', label: '비활성' },
];

const levelOptions = [
    ['all', '전체'],
    ['elementary', '초'],
    ['middle', '중'],
    ['high', '고'],
];

function StudentToolbar({
    sortOrder,
    onSortChange,
    schoolLevel,
    onSchoolLevelChange,
    statusFilter,
    onStatusFilterChange,
    searchTerm,
    onSearchTermChange,
    onOpenBulkRegistration,
    onOpenRegistration,
}) {
    return (
        <div className="student-list__toolbar">
            <div className="student-list__filters">
                <CustomSelect label="정렬 순서" value={sortOrder} onChange={onSortChange} options={sortOptions} />

                <div className="student-list__level-filter" aria-label="학년 구분">
                    {levelOptions.map(([value, label]) => (
                        <button
                            key={value}
                            type="button"
                            className={`student-list__filter-button${schoolLevel === value ? ' student-list__filter-button--active' : ''}`}
                            onClick={() => onSchoolLevelChange(value)}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                <CustomSelect
                    label="상태 필터"
                    value={statusFilter}
                    onChange={onStatusFilterChange}
                    width={104}
                    options={statusOptions}
                />
            </div>

            <div className="student-list__actions">
                <label className="student-list__search">
                    <span className="student-list__sr-only">학생 이름 검색</span>
                    <input
                        type="search"
                        placeholder="학생 이름 검색"
                        value={searchTerm}
                        onChange={(event) => onSearchTermChange(event.target.value)}
                    />
                    <i className="bi bi-search" aria-hidden="true" />
                </label>
                <button type="button" className="student-list__outline-button" onClick={onOpenBulkRegistration}>
                    <i className="bi bi-people-fill" aria-hidden="true" />
                    학생 일괄 등록
                </button>
                <button type="button" className="student-list__primary-button" onClick={onOpenRegistration}>
                    <i className="bi bi-person-fill-add" aria-hidden="true" />
                    학생 개별 등록
                </button>
            </div>
        </div>
    );
}

export default StudentToolbar;
