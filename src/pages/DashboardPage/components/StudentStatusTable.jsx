import { Link, useNavigate } from 'react-router-dom';

function StudentStatusTable({ students }) {
    const navigate = useNavigate();

    const openStudentReport = (studentId) => navigate(`/students/reports?student=${studentId}`);
    const handleKeyDown = (event, studentId) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openStudentReport(studentId);
        }
    };

    return (
        <section className="dashboard-panel dashboard-panel--students" aria-labelledby="student-status-title">
            <div className="dashboard-panel__header dashboard-panel__header--inline">
                <div>
                    <h2 id="student-status-title">학생별 학습 현황</h2>
                    <p>정답률이 낮은 학생부터 표시했어요.</p>
                </div>
                <Link to="/learning" className="dashboard-panel__more">전체 보기 <i className="bi bi-arrow-right" aria-hidden="true" /></Link>
            </div>

            <div className="student-status__table-wrap">
                <table className="student-status__table">
                    <thead>
                        <tr>
                            <th scope="col">학생</th>
                            <th scope="col">최근 학습일</th>
                            <th scope="col">진행률</th>
                            <th scope="col">정답률</th>
                            <th scope="col">취약 개념</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr
                                key={student.id}
                                tabIndex={0}
                                role="link"
                                aria-label={`${student.name} 학생 리포트 보기`}
                                onClick={() => openStudentReport(student.id)}
                                onKeyDown={(event) => handleKeyDown(event, student.id)}
                            >
                                <td><span className="student-status__avatar">{student.name.slice(0, 1)}</span><strong>{student.name}</strong></td>
                                <td>{student.lastStudy}</td>
                                <td>
                                    <span className="student-status__progress"><i style={{ width: `${student.progress}%` }} /></span>
                                    <b>{student.progress}%</b>
                                </td>
                                <td><span className={`student-status__accuracy${student.accuracy < 60 ? ' student-status__accuracy--low' : ''}`}>{student.accuracy}%</span></td>
                                <td><span className="student-status__weakness">{student.weakConcepts}개</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default StudentStatusTable;
