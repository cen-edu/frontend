import { useNavigate } from 'react-router-dom';
import CustomCheckbox from '../../../components/common/CustomCheckbox/CustomCheckbox';
import { getStudentMetrics, statusLabels } from '../../../mocks/weaknessAnalysis';

const filters = [['all', '전체'], ['priority', '우선 지도'], ['review', '관찰 필요'], ['stable', '안정'], ['insufficient', '데이터 부족']];

function StudentDiagnosisTable({ worksheet, selected, onToggle, statusFilter, onStatusFilter }) {
    const navigate = useNavigate();
    const rows = worksheet.students.filter((student) => statusFilter === 'all' || student.status === statusFilter);

    return (
        <section className="diagnosis-card student-diagnosis">
            <div className="student-diagnosis__header">
                <div><span>학생별 결과</span><h2>학생 진단</h2></div>
                <div className="diagnosis-tabs">
                    {filters.map(([value, label]) => <button key={value} type="button" className={statusFilter === value ? 'diagnosis-tabs__button diagnosis-tabs__button--active' : 'diagnosis-tabs__button'} onClick={() => onStatusFilter(value)}>{label}</button>)}
                </div>
            </div>
            <div className="student-diagnosis__wrap">
                <table>
                    <thead><tr><th>선택</th><th>학생</th><th>득점률</th>{worksheet.type === 'assessment' && <><th>소요 시간</th><th>힌트</th></>}<th>{worksheet.type === 'assessment' ? '취약 문항' : '주요 취약'}</th><th>상태</th><th>다음 행동</th></tr></thead>
                    <tbody>
                        {rows.map((student) => {
                            const metric = getStudentMetrics(student);
                            const weakest = worksheet.type === 'assessment'
                                ? student.responses.filter((response) => response.score < response.maxScore).slice(0, 2).map((response) => `${response.no}번`).join(', ')
                                : student.nextAction.split(' ').slice(0, -1).join(' ');
                            const openStudent = () => navigate(`/learning/weaknesses/students/${student.id}?worksheet=${worksheet.id}`);
                            return (
                                <tr key={student.id} tabIndex={0} onClick={openStudent} onKeyDown={(event) => { if (event.key === 'Enter') openStudent(); }}>
                                    <td><CustomCheckbox label={`${student.name} 선택`} checked={selected.includes(student.id)} onChange={() => onToggle(student.id)} /></td>
                                    <td><strong>{student.name}</strong></td>
                                    <td><b className={`score-rate${metric.scoreRate < 60 ? ' score-rate--low' : ''}`}>{metric.scoreRate}%</b></td>
                                    {worksheet.type === 'assessment' && <><td>{Math.round(metric.seconds / 60)}분</td><td>{metric.hints}회</td></>}
                                    <td>{weakest || '없음'}</td>
                                    <td><span className={`status-badge status-badge--${student.status}`}>{statusLabels[student.status]}</span></td>
                                    <td>{student.nextAction}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default StudentDiagnosisTable;
