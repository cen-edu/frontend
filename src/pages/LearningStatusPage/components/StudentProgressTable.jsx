import { Link } from 'react-router-dom';
import CustomCheckbox from '../../../components/common/CustomCheckbox/CustomCheckbox';
import CustomSelect from '../../../components/common/CustomSelect/CustomSelect';
import { getProgress, getProgressLabel, learningTypeLabels } from '../learningStatusUtils';

const statusLabels = {
    submitted: '제출 완료',
    'in-progress': '학습 중',
    'not-started': '미시작',
};

function StudentProgressTable({
    assignment,
    students,
    status,
    statusOptions,
    onStatusChange,
    remindedIds,
    onRemind,
    selectedIds,
    onToggleStudent,
    onToggleAll,
}) {
    if (!assignment) {
        return (
            <section className="learning-panel learning-students learning-students--empty">
                <i className="bi bi-inbox" aria-hidden="true" />
                <p>확인할 학습을 선택해 주세요.</p>
            </section>
        );
    }

    const worksheetId = assignment.analysisWorksheetId ?? assignment.id;
    const selectableStudents = students.filter((student) => student.status !== 'submitted');
    const allSelected = selectableStudents.length > 0 && selectableStudents.every((student) => selectedIds.includes(student.id));
    const gradingPending = assignment.students.filter((student) => student.grading === 'pending').length;

    return (
        <section className="learning-panel learning-students" aria-labelledby="student-progress-title">
            <div className="learning-panel__header learning-students__header">
                <div>
                    <span className="learning-students__class">
                        {assignment.className}
                        <span className={`learning-type-badge learning-type-badge--${assignment.type}`}>{learningTypeLabels[assignment.type]}</span>
                        {assignment.origin === 'custom' && <span className="learning-origin-badge">맞춤</span>}
                    </span>
                    <h2 id="student-progress-title">{assignment.title}</h2>
                    {gradingPending > 0 && <span className="learning-students__grading-count">채점 대기 {gradingPending}명</span>}
                </div>
                <div className="learning-students__header-controls">
                    <div className="learning-students__links">
                        {gradingPending > 0 && <Link to={`/learning/results?worksheet=${worksheetId}`}>채점하러 가기 <i className="bi bi-arrow-right" aria-hidden="true" /></Link>}
                        <Link to={`/learning/weaknesses?worksheet=${worksheetId}`}>취약점 분석 보기 <i className="bi bi-arrow-right" aria-hidden="true" /></Link>
                    </div>
                    <CustomSelect label="학생 학습 상태" value={status} options={statusOptions} onChange={onStatusChange} width={116} />
                </div>
            </div>

            <div className="learning-students__table-wrap">
                <table className="learning-students__table">
                    <thead>
                        <tr>
                            <th><CustomCheckbox label="미제출 학생 전체 선택" checked={allSelected} disabled={selectableStudents.length === 0} onChange={onToggleAll} /></th>
                            <th>번호</th>
                            <th>이름</th>
                            <th>학습 상태</th>
                            <th>진행률</th>
                            <th>채점</th>
                            <th>제출 일시</th>
                            <th><span className="learning-status__sr-only">관리</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => {
                            const progress = getProgress(assignment, student);
                            const isSubmitted = student.status === 'submitted';
                            return (
                                <tr key={student.id}>
                                    <td><CustomCheckbox label={`${student.name} 선택`} checked={selectedIds.includes(student.id)} disabled={isSubmitted} onChange={() => onToggleStudent(student.id)} /></td>
                                    <td>{student.number}</td>
                                    <td><Link className="learning-students__name" to={`/learning/weaknesses/students/${student.id}?worksheet=${worksheetId}`}>{student.name}</Link></td>
                                    <td><span className={`learning-students__status learning-students__status--${student.status}`}>{statusLabels[student.status]}</span></td>
                                    <td>
                                        <span className="learning-students__progress" title={`${getProgressLabel(assignment, student)} · ${progress}%`}>
                                            <span><span style={{ width: `${progress}%` }} /></span>
                                            <b>{getProgressLabel(assignment, student)}</b>
                                        </span>
                                    </td>
                                    <td>
                                        {student.grading === 'done' && <Link className="learning-students__grading-link" to={`/learning/results?worksheet=${worksheetId}&student=${student.id}`}>채점 완료 <i className="bi bi-chevron-right" aria-hidden="true" /></Link>}
                                        {student.grading === 'pending' && <span className="learning-students__grading-pending">채점 대기</span>}
                                        {student.grading === null && <span className="learning-students__muted">-</span>}
                                    </td>
                                    <td><span className="learning-students__muted">{student.submittedAt}</span></td>
                                    <td>
                                        {!isSubmitted && (
                                            <button type="button" className={`learning-students__remind${remindedIds.includes(student.id) ? ' learning-students__remind--sent' : ''}`} onClick={() => onRemind(student.id)}>
                                                <i className={`bi ${remindedIds.includes(student.id) ? 'bi-check2' : 'bi-bell'}`} aria-hidden="true" />
                                                {remindedIds.includes(student.id) ? '알림 완료' : '학습 알림'}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                        {students.length === 0 && <tr><td className="learning-students__empty-cell" colSpan="8">조건에 맞는 학생이 없습니다.</td></tr>}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default StudentProgressTable;
