import { Link } from 'react-router-dom';
import CustomSelect from '../../../components/common/CustomSelect/CustomSelect';
import { teacherProgressStatusLabels as statusLabels } from '../../../mocks/labels';
import { getProgress, getProgressLabel, learningTypeLabels } from '../learningStatusUtils';

function AssignmentProgressPanel({
    assignment,
    students,
    status,
    statusOptions,
    onStatusChange,
    titleId,
    className = '',
}) {
    const worksheetId = assignment.analysisWorksheetId ?? assignment.id;
    const gradingPending = assignment.students.filter((student) => student.grading === 'pending').length;

    return (
        <section className={`learning-panel learning-students ${className}`.trim()} aria-labelledby={titleId}>
            <div className="learning-panel__header learning-students__header">
                <div>
                    <span className="learning-students__class">
                        {assignment.className}
                        <span className={`learning-type-badge learning-type-badge--${assignment.type}`}>{learningTypeLabels[assignment.type]}</span>
                        {assignment.origin === 'custom' && <span className="learning-origin-badge">맞춤</span>}
                    </span>
                    <h2 id={titleId}>{assignment.title}</h2>
                    {assignment.origin === 'custom' && (
                        <p>대상 {assignment.students.length}명 · 배정 {assignment.assignedAt} · 마감 {assignment.dueAt}</p>
                    )}
                    {gradingPending > 0 && <span className="learning-students__grading-count">채점 대기 {gradingPending}명</span>}
                </div>
                <div className="learning-students__header-controls">
                    <CustomSelect label={`${assignment.title} 학생 학습 상태`} value={status} options={statusOptions} onChange={onStatusChange} width={116} />
                </div>
            </div>

            <div className="learning-students__table-wrap">
                <table className="learning-students__table">
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>이름</th>
                            <th>학습 상태</th>
                            <th>진행률</th>
                            <th>채점</th>
                            <th>제출 일시</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => {
                            const progress = getProgress(assignment, student);
                            return (
                                <tr key={student.id}>
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
                                        {student.grading === 'done' && <span className="learning-students__grading-done">채점 완료</span>}
                                        {student.grading === 'pending' && <span className="learning-students__grading-pending">채점 대기</span>}
                                        {student.grading === null && <span className="learning-students__muted">-</span>}
                                    </td>
                                    <td><span className="learning-students__muted">{student.submittedAt}</span></td>
                                </tr>
                            );
                        })}
                        {students.length === 0 && <tr><td className="learning-students__empty-cell" colSpan={6}>조건에 맞는 학생이 없습니다.</td></tr>}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default AssignmentProgressPanel;
