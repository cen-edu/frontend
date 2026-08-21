import { statusLabels } from '../../../../mocks/weaknessAnalysis';

const priority = { priority: 0, review: 1, stable: 2, insufficient: 3 };

function StudentWeaknessList({ students, selectedId, proposalCount, isPending, error, onSelect }) {
    const sorted = [...students].sort((a, b) => priority[a.status] - priority[b.status]);
    return <aside className="student-weakness-list" aria-labelledby="student-weakness-title">
        <header><h2 id="student-weakness-title">학생 목록</h2><span>{students.length}명</span></header>
        <div className="student-weakness-list__items">
            {isPending && <p className="student-weakness-list__state" role="status">학생 목록을 불러오는 중입니다.</p>}
            {error && <p className="student-weakness-list__state student-weakness-list__state--error" role="alert">{error.message || '학생 목록을 불러오지 못했습니다.'}</p>}
            {!isPending && !error && !sorted.length && <p className="student-weakness-list__state">배정된 학생이 없습니다.</p>}
            {sorted.map((student) => {
            const countLabel = selectedId === student.id && proposalCount !== null
                ? `제안 소분류 ${proposalCount}개`
                : '선택 후 제안 조회';
            return <button type="button" key={student.id} className={`student-weakness-list__item${selectedId === student.id ? ' student-weakness-list__item--selected' : ''}`} aria-current={selectedId === student.id ? 'true' : undefined} onClick={() => onSelect(student.id)}>
                <span className="student-weakness-list__name"><strong>{student.name}</strong><span className={`custom-status custom-status--${student.status}`}>{statusLabels[student.status]}</span></span>
                <span className="student-weakness-list__meta">{countLabel}</span>
            </button>;
        })}</div>
    </aside>;
}

export default StudentWeaknessList;
