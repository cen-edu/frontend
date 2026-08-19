import { CustomSelect, SearchInput } from '../../../../components/common/inputs';
import { statusLabels } from '../../../../mocks/weaknessAnalysis';

const statusOrder = { priority: 0, review: 1, stable: 2, insufficient: 3 };
const getRateSortValue = (student) => student.performanceRate ?? Number.POSITIVE_INFINITY;

function AnalysisTargetList({ worksheet, classPerformanceRate, isPending, error, selectedStudentId, search, onSearch, sortBy, onSortChange, onSelectAll, onSelectStudent }) {
    const students = worksheet.students
        .filter((student) => student.name.includes(search.trim()))
        .sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name, 'ko');
            if (sortBy === 'score') return getRateSortValue(a) - getRateSortValue(b);
            return statusOrder[a.status] - statusOrder[b.status] || getRateSortValue(a) - getRateSortValue(b);
        });
    const classRateLabel = classPerformanceRate === null || classPerformanceRate === undefined
        ? '-'
        : `${classPerformanceRate}%`;

    return (
        <aside className="analysis-targets" aria-label="분석 대상">
            <div className="analysis-targets__heading"><h2>분석 대상</h2><span>{worksheet.students.length}명</span></div>
            {isPending && <p className="analysis-targets__state">학생 목록을 불러오는 중입니다.</p>}
            {error && <p className="analysis-targets__state" role="alert">{error.message || '학생 목록을 불러오지 못했습니다.'}</p>}
            {!isPending && !error && <>
            <button type="button" className={`analysis-targets__all${!selectedStudentId ? ' analysis-targets__all--active' : ''}`} onClick={onSelectAll}>
                <span><strong>전체</strong><small>{worksheet.title}</small></span>
                <span><strong>{classRateLabel}</strong><small>학급 성취율</small></span>
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
                    const rateLabel = student.performanceRate === null ? '-' : `${student.performanceRate}%`;
                    return <li key={student.id}><button type="button" className={selectedStudentId === student.id ? 'active' : ''} onClick={() => onSelectStudent(student.id)} aria-current={selectedStudentId === student.id ? 'page' : undefined}>
                        <span><strong>{student.name}</strong><small className={`status-badge status-badge--${student.status}`}>{statusLabels[student.status]}</small></span>
                        <b className={student.performanceRate !== null && student.performanceRate < 60 ? 'low' : ''}>{rateLabel}</b>
                    </button></li>;
                })}
                {!students.length && <li className="analysis-targets__empty">{search.trim() ? '검색 결과가 없습니다.' : '분석할 학생이 없습니다.'}</li>}
            </ul>
            </>}
        </aside>
    );
}

export default AnalysisTargetList;
