import { prescriptionLabels } from '../../../mocks/weaknessAnalysis';
import { Link } from 'react-router-dom';
function PrescriptionTable({ worksheet }) {
    const rows = worksheet.students.filter((student) => student.prescription);
    return <section className="prescription-table diagnosis-card"><div className="diagnosis-card__heading"><div><span>FOLLOW-UP</span><h2>처방 효과 검증</h2></div><small>맞춤 출제 후 ③ 자립 문항 결과</small></div><div className="prescription-table__wrap"><table><thead><tr><th>학생</th><th>취약 개념</th><th>처방일</th><th>재확인</th><th>상태</th><th /></tr></thead><tbody>{rows.map((student) => { const item = student.prescription; const concept = worksheet.concepts.find((value) => value.id === item.conceptId); const recheckTotal = item.stageCounts.independent; return <tr key={student.id}><td>{student.name}</td><td>{concept?.label}</td><td>{item.assignedAt}</td><td>{item.recheckCorrect}/{recheckTotal}</td><td><span className={`status-badge status-badge--${item.status}`}>{prescriptionLabels[item.status]}</span></td><td>{item.status === 'unresolved' && <Link to={`/problems/custom?worksheet=${worksheet.id}&students=${student.id}&concept=${item.conceptId}`}>새 문제 재처방</Link>}</td></tr>; })}</tbody></table></div></section>;
}
export default PrescriptionTable;
