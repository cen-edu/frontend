import CustomSelect from '../../../../components/common/CustomSelect/CustomSelect';
import SearchInput from '../../../../components/common/SearchInput/SearchInput';
import { getStudentMetrics, statusLabels } from '../../../../mocks/weaknessAnalysis';

const statusOrder = { priority: 0, review: 1, stable: 2, insufficient: 3 };

function AnalysisTargetList({ worksheet, selectedStudentId, search, onSearch, sortBy, onSortChange, onSelectAll, onSelectStudent }) {
    const students = worksheet.students
        .filter((student) => student.name.includes(search.trim()))
        .sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name, 'ko');
            if (sortBy === 'score') return getStudentMetrics(a).scoreRate - getStudentMetrics(b).scoreRate;
            return statusOrder[a.status] - statusOrder[b.status] || getStudentMetrics(a).scoreRate - getStudentMetrics(b).scoreRate;
        });
    const classRate = Math.round(worksheet.students.filter((student) => student.status !== 'insufficient').reduce((sum, student) => sum + getStudentMetrics(student).scoreRate, 0) / Math.max(worksheet.students.filter((student) => student.status !== 'insufficient').length, 1));

    return (
        <aside className="analysis-targets" aria-label="분석 대상">
            <div className="analysis-targets__heading"><h2>분석 대상</h2><span>{worksheet.students.length}명</span></div>
            <button type="button" className={`analysis-targets__all${!selectedStudentId ? ' analysis-targets__all--active' : ''}`} onClick={onSelectAll}>
                <span><strong>전체</strong><small>{worksheet.title}</small></span>
                <span><strong>{classRate}%</strong><small>학급 정답률</small></span>
            </button>
            <div className="analysis-targets__tools">
                <SearchInput value={search} onChange={onSearch} placeholder="학생 이름 검색" label="학생 이름 검색" width="100%" />
                <CustomSelect label="학생 정렬" value={sortBy} onChange={onSortChange} width="100%" options={[
                    { value: 'status', label: '상태 우선' },
                    { value: 'score', label: '정답률 낮은순' },
                    { value: 'name', label: '이름순' },
                ]} />
            </div>
            <ul className="analysis-targets__list">
                {students.map((student) => {
                    const metrics = getStudentMetrics(student);
                    return <li key={student.id}><button type="button" className={selectedStudentId === student.id ? 'active' : ''} onClick={() => onSelectStudent(student.id)} aria-current={selectedStudentId === student.id ? 'page' : undefined}>
                        <span><strong>{student.name}</strong><small className={`status-badge status-badge--${student.status}`}>{statusLabels[student.status]}</small></span>
                        <b className={metrics.scoreRate < 60 ? 'low' : ''}>{metrics.scoreRate}%</b>
                    </button></li>;
                })}
                {!students.length && <li className="analysis-targets__empty">검색 결과가 없습니다.</li>}
            </ul>
        </aside>
    );
}

export default AnalysisTargetList;
