import CustomSelect from '../../../components/common/CustomSelect/CustomSelect';

const statusLabels = {
    submitted: '제출 완료',
    'in-progress': '학습 중',
    'not-started': '미시작',
};

function StudentProgressTable({ assignment, students, status, statusOptions, onStatusChange, remindedIds, onRemind }) {
    if (!assignment) {
        return (
            <section className="learning-panel learning-students learning-students--empty">
                <i className="bi bi-inbox" aria-hidden="true" />
                <p>확인할 학습을 선택해 주세요.</p>
            </section>
        );
    }

    return (
        <section className="learning-panel learning-students" aria-labelledby="student-progress-title">
            <div className="learning-panel__header learning-students__header">
                <div>
                    <span className="learning-students__class">{assignment.className} · {assignment.type}</span>
                    <h2 id="student-progress-title">{assignment.title}</h2>
                    <p>학생별 풀이 진행과 채점 결과입니다.</p>
                </div>
                <CustomSelect label="학생 학습 상태" value={status} options={statusOptions} onChange={onStatusChange} width={116} />
            </div>

            <div className="learning-students__table-wrap">
                <table className="learning-students__table">
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>이름</th>
                            <th>학습 상태</th>
                            <th>진행률</th>
                            <th>점수</th>
                            <th>제출 일시</th>
                            <th><span className="learning-status__sr-only">관리</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student.id}>
                                <td>{student.number}</td>
                                <td><strong className="learning-students__name">{student.name}</strong></td>
                                <td><span className={`learning-students__status learning-students__status--${student.status}`}>{statusLabels[student.status]}</span></td>
                                <td>
                                    <span className="learning-students__progress">
                                        <span><span style={{ width: `${student.progress}%` }} /></span>
                                        <b>{student.progress}%</b>
                                    </span>
                                </td>
                                <td>{student.score === null ? <span className="learning-students__muted">-</span> : <strong>{student.score}점</strong>}</td>
                                <td><span className="learning-students__muted">{student.submittedAt}</span></td>
                                <td>
                                    {student.status !== 'submitted' && (
                                        <button
                                            type="button"
                                            className={`learning-students__remind${remindedIds.includes(student.id) ? ' learning-students__remind--sent' : ''}`}
                                            onClick={() => onRemind(student.id)}
                                        >
                                            <i className={`bi ${remindedIds.includes(student.id) ? 'bi-check2' : 'bi-bell'}`} aria-hidden="true" />
                                            {remindedIds.includes(student.id) ? '알림 완료' : '학습 알림'}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {students.length === 0 && <tr><td className="learning-students__empty-cell" colSpan="7">조건에 맞는 학생이 없습니다.</td></tr>}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default StudentProgressTable;
