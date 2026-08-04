import { Link } from 'react-router-dom';
import { getCustomSessionSummary, getStudentCustomSessions, prescriptionLabels } from '../../../mocks/weaknessAnalysis';

function PrescriptionTable({ worksheet, onSelectStudent }) {
    const rows = worksheet.students
        .map((student) => ({ student, sessions: getStudentCustomSessions(worksheet, student) }))
        .filter(({ sessions }) => sessions.length)
        .map(({ student, sessions }) => {
            const session = sessions[sessions.length - 1];
            return { student, session, round: sessions.length, summary: getCustomSessionSummary(session) };
        });

    if (!rows.length) return null;

    return <section className="prescription-table diagnosis-card">
        <div className="diagnosis-card__heading"><div><span>취약 개념 맞춤 출제 후</span><h2>맞춤 학습 후속 확인</h2></div><small>학생별 최근 회차 기준</small></div>
        <div className="prescription-table__wrap"><table>
            <thead><tr><th>학생</th><th>취약 개념</th><th>회차</th><th>배정일</th><th>풀이 진행</th><th>상태</th><th /></tr></thead>
            <tbody>{rows.map(({ student, session, round, summary }) => <tr key={student.id}>
                <td><button type="button" onClick={() => onSelectStudent(student.id)}>{student.name}</button></td>
                <td>{worksheet.concepts.find((concept) => concept.id === session.conceptId)?.label ?? session.conceptId}</td>
                <td>{round}회차</td>
                <td>{session.assignedAt}</td>
                <td>{summary.solvedCount}/{summary.totalCount}문항 <small>{summary.solvedCount === summary.totalCount ? '완료' : '푸는 중'}</small></td>
                <td><span className={`status-badge status-badge--${summary.status}`}>{prescriptionLabels[summary.status]}</span></td>
                <td>{summary.status === 'unresolved' && <Link to={`/problems/custom?worksheet=${worksheet.id}&students=${student.id}&concept=${session.conceptId}`}>새 문제 재처방</Link>}</td>
            </tr>)}</tbody>
        </table></div>
    </section>;
}

export default PrescriptionTable;
