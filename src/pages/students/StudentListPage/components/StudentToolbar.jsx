import { CustomSelect } from '../../../../components/common/inputs';

const sortOptions = [
    { value: 'newest', label: '최신 등록순' },
    { value: 'NAME_ASC', label: '이름순' },
];

const gradeOptions = [
    { value: 'all', label: '전체 학년' },
    { value: '1', label: '1학년' },
    { value: '2', label: '2학년' },
    { value: '3', label: '3학년' },
];

function StudentToolbar({
    sortOrder,
    onSortChange,
    yearFilter,
    onYearFilterChange,
    students,
    gradeFilter,
    onGradeFilterChange,
    classFilter,
    onClassFilterChange,
    classes,
    searchTerm,
    onSearchTermChange,
    onOpenBulkRegistration = () => {},
    onOpenRegistration = () => {},
    writeActionsDisabled = false,
}) {
    const yearOptions = [
        { value: 'all', label: '전체 등록 연도' },
        ...[...new Set(students.map(({ registrationYear }) => registrationYear))]
            .sort((first, second) => Number(second) - Number(first))
            .map((year) => ({ value: year, label: `${year}년` })),
    ];

    const classOptions = [
        { value: 'all', label: '전체 반' },
        ...classes.map(({ id, name }) => ({
            value: String(id),
            label: name,
        })),
    ];

    return (
        <div className="student-list__toolbar">
            <div className="student-list__filters">
                <CustomSelect label="정렬 순서" value={sortOrder} onChange={onSortChange} options={sortOptions} />
                <CustomSelect
                    label="등록 연도 필터"
                    value={yearFilter}
                    onChange={onYearFilterChange}
                    width={132}
                    options={yearOptions}
                />
                <CustomSelect
                    label="학년 필터"
                    value={gradeFilter}
                    onChange={onGradeFilterChange}
                    width={112}
                    options={gradeOptions}
                />
                <CustomSelect
                    label="반 필터"
                    value={classFilter}
                    onChange={onClassFilterChange}
                    width={132}
                    options={classOptions}
                />
            </div>

            <div className="student-list__actions">
                <label className="student-list__search">
                    <span className="student-list__sr-only">학생 이름 검색</span>
                    <input
                        type="search"
                        placeholder="학생 이름 검색"
                        value={searchTerm}
                        maxLength={50}
                        onChange={(event) => onSearchTermChange(event.target.value)}
                    />
                    <i className="bi bi-search" aria-hidden="true" />
                </label>
                <button type="button" className="student-list__outline-button" disabled={writeActionsDisabled} onClick={onOpenBulkRegistration}>
                    학생 일괄 등록
                </button>
                <button type="button" className="student-list__primary-button" disabled={writeActionsDisabled} onClick={onOpenRegistration}>
                    학생 개별 등록
                </button>
            </div>
        </div>
    );
}

export default StudentToolbar;
