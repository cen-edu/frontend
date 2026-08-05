import {
    studentAssignmentStatusLabels,
    studentAssignmentTypeLabels,
} from '../../../mocks/studentAssignments';

const filters = [
    { value: 'all', label: '전체' },
    { value: 'homework', label: '숙제' },
    { value: 'assessment', label: '평가' },
];

const getCategory = (assignment) => assignment.type === 'assessment' ? 'assessment' : 'homework';

const getTypeLabel = (assignment) => assignment.origin === 'custom'
    ? '맞춤 학습'
    : studentAssignmentTypeLabels[assignment.type];

function AssignmentBrowser({ assignments, activeFilter, onFilterChange, selectedId, onSelect }) {
    const filteredAssignments = activeFilter === 'all'
        ? assignments
        : assignments.filter((assignment) => getCategory(assignment) === activeFilter);

    const getFilterCount = (filter) => filter === 'all'
        ? assignments.length
        : assignments.filter((assignment) => getCategory(assignment) === filter).length;

    return (
        <section className="student-home__browser" aria-labelledby="assignment-browser-title">
            <div className="student-home__browser-heading">
                <div>
                    <h1 id="assignment-browser-title">배정된 학습지</h1>
                    <p>학습지를 선택해 내용을 확인하고 학습을 시작합니다.</p>
                </div>
                <span>총 {assignments.length}개</span>
            </div>

            <div className="student-home__tabs" role="tablist" aria-label="학습지 유형">
                {filters.map((filter) => (
                    <button
                        key={filter.value}
                        type="button"
                        role="tab"
                        aria-selected={activeFilter === filter.value}
                        className={`student-home__tab${activeFilter === filter.value ? ' student-home__tab--active' : ''}`}
                        onClick={() => onFilterChange(filter.value)}
                    >
                        {filter.label}
                        <span>{getFilterCount(filter.value)}</span>
                    </button>
                ))}
            </div>

            <div className="student-home__worksheet-grid" role="tabpanel">
                {filteredAssignments.map((assignment) => {
                    const progress = Math.round((assignment.doneUnits / assignment.totalUnits) * 100);
                    const isSelected = selectedId === assignment.id;

                    return (
                        <button
                            key={assignment.id}
                            type="button"
                            aria-pressed={isSelected}
                            className={`student-home__worksheet${isSelected ? ' student-home__worksheet--selected' : ''}`}
                            onClick={() => onSelect(assignment.id)}
                        >
                            <span className="student-home__worksheet-topline">
                                <span className={`student-home__worksheet-type student-home__worksheet-type--${getCategory(assignment)}`}>
                                    {getTypeLabel(assignment)}
                                </span>
                                <span className={`student-home__worksheet-status student-home__worksheet-status--${assignment.status}`}>
                                    {studentAssignmentStatusLabels[assignment.status]}
                                </span>
                            </span>
                            <strong className="student-home__worksheet-title">{assignment.title}</strong>
                            <span className="student-home__worksheet-meta">
                                {assignment.totalUnits}문항
                            </span>
                            <span className="student-home__worksheet-due">마감 {assignment.dueAt}</span>
                            <span className="student-home__worksheet-progress">
                                <span className="student-home__worksheet-progress-label">
                                    <span>진행률</span>
                                    <strong>{progress}%</strong>
                                </span>
                                <span className="student-home__worksheet-progress-track" aria-hidden="true">
                                    <span style={{ width: `${progress}%` }} />
                                </span>
                            </span>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}

export default AssignmentBrowser;
