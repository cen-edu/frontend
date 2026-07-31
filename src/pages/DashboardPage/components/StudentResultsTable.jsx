import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const columns = [
    { key: 'name', label: '학생', direction: 'ascending' },
    { key: 'score', label: '점수', direction: 'descending' },
    { key: 'accuracy', label: '정답률', direction: 'ascending' },
    { key: 'weakConcept', label: '주요 취약 개념', direction: 'ascending' },
    { key: 'submittedAt', label: '제출 시각', direction: 'descending' },
];

function StudentResultsTable({ students }) {
    const navigate = useNavigate();
    const [sort, setSort] = useState({ key: 'accuracy', direction: 'ascending' });

    const sortedStudents = useMemo(() => [...students].sort((first, second) => {
        const firstValue = first[sort.key];
        const secondValue = second[sort.key];
        const result = typeof firstValue === 'string' ? firstValue.localeCompare(secondValue, 'ko') : firstValue - secondValue;
        return sort.direction === 'ascending' ? result : -result;
    }), [sort, students]);

    const changeSort = (column) => {
        setSort((current) => ({
            key: column.key,
            direction: current.key === column.key
                ? (current.direction === 'ascending' ? 'descending' : 'ascending')
                : column.direction,
        }));
    };

    const openReport = (studentId) => navigate(`/students/reports?student=${studentId}`);

    return (
        <section className="dashboard-section dashboard-section--results" aria-labelledby="student-results-title">
            <div className="dashboard-section__header dashboard-section__header--inline">
                <div>
                    <span className="dashboard-section__kicker">상세 결과</span>
                    <h2 id="student-results-title">학생별 학습 결과</h2>
                    <p>정답률이 낮은 학생부터 확인할 수 있어요.</p>
                </div>
                <button type="button" className="student-results__more" onClick={() => navigate('/learning')}>전체 학습 현황 <i className="bi bi-arrow-right" aria-hidden="true" /></button>
            </div>

            <div className="student-results__table-wrap">
                <table className="student-results__table">
                    <thead>
                        <tr>
                            {columns.map((column) => {
                                const active = sort.key === column.key;
                                return (
                                    <th key={column.key} scope="col" aria-sort={active ? sort.direction : 'none'}>
                                        <button type="button" onClick={() => changeSort(column)}>
                                            {column.label}
                                            <i className={`bi ${active ? (sort.direction === 'ascending' ? 'bi-arrow-up' : 'bi-arrow-down') : 'bi-arrow-down-up'}`} aria-hidden="true" />
                                        </button>
                                    </th>
                                );
                            })}
                            <th scope="col">상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedStudents.map((student) => (
                            <tr key={student.id} tabIndex={0} role="link" aria-label={`${student.name} 학생 개인 리포트 보기`} onClick={() => openReport(student.id)} onKeyDown={(event) => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault();
                                    openReport(student.id);
                                }
                            }}>
                                <td><span className="student-results__avatar">{student.name.slice(0, 1)}</span><strong>{student.name}</strong></td>
                                <td><b>{student.score}</b>점</td>
                                <td><span className={`student-results__accuracy${student.accuracy < 60 ? ' student-results__accuracy--low' : student.accuracy >= 80 ? ' student-results__accuracy--high' : ''}`}>{student.accuracy}%</span></td>
                                <td>{student.weakConcept}</td>
                                <td>{student.submittedAt}</td>
                                <td><span className="student-results__status"><i className="bi bi-check-circle-fill" aria-hidden="true" />채점 완료</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default StudentResultsTable;
