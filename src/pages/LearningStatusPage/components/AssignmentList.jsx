import { getDueStatus, learningTypeLabels } from '../learningStatusUtils';

function AssignmentList({ assignments, selectedId, onSelect }) {
    return (
        <section className="learning-panel learning-assignments" aria-labelledby="assignment-list-title">
            <div className="learning-panel__header">
                <div>
                    <h2 id="assignment-list-title">학습 목록</h2>
                    <p>학습을 선택하면 학생별 진행 상황을 표시합니다.</p>
                </div>
                <span className="learning-panel__count">{assignments.length}개</span>
            </div>

            <div className="learning-assignments__list">
                {assignments.map((assignment) => {
                    const submitted = assignment.students.filter((student) => student.status === 'submitted').length;
                    const rate = Math.round((submitted / assignment.students.length) * 100);
                    const dueStatus = getDueStatus(assignment.dueAt);

                    return (
                        <button
                            key={assignment.id}
                            type="button"
                            className={`learning-assignments__item${selectedId === assignment.id ? ' learning-assignments__item--active' : ''}`}
                            aria-pressed={selectedId === assignment.id}
                            onClick={() => onSelect(assignment.id)}
                        >
                            <span className="learning-assignments__meta">
                                <span>{assignment.className}</span>
                                <span className={`learning-type-badge learning-type-badge--${assignment.type}`}>{learningTypeLabels[assignment.type]}</span>
                                {assignment.origin === 'custom' && <span className="learning-origin-badge">맞춤</span>}
                                <span className={`learning-assignments__state learning-assignments__state--${assignment.status}`}>
                                    {assignment.status === 'ongoing' ? '진행 중' : '마감'}
                                </span>
                            </span>
                            <strong>{assignment.title}</strong>
                            <span className="learning-assignments__due">
                                <span><i className="bi bi-calendar3" aria-hidden="true" /> 마감 {assignment.dueAt}</span>
                                {dueStatus && <b className={`learning-assignments__deadline learning-assignments__deadline--${dueStatus.tone}`}>{dueStatus.label}</b>}
                            </span>
                            <span className="learning-assignments__progress">
                                <span><b>제출 {submitted}/{assignment.students.length}명</b><em>{rate}%</em></span>
                                <span className="learning-assignments__track"><span style={{ width: `${rate}%` }} /></span>
                            </span>
                        </button>
                    );
                })}
                {assignments.length === 0 && <p className="learning-assignments__empty">조건에 맞는 학습이 없습니다.</p>}
            </div>
        </section>
    );
}

export default AssignmentList;
