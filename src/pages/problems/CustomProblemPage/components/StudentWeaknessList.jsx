import { statusLabels } from '../../../../mocks/weaknessAnalysis';

const workLabels = { idle: '미생성', created: '생성됨', assigned: '배정 완료' };
const priority = { priority: 0, review: 1, stable: 2, insufficient: 3 };

function StudentWeaknessList({ students, selectedId, proposals, studentWork, onSelect }) {
    const sorted = [...students].sort((a, b) => priority[a.status] - priority[b.status]);
    return <aside className="student-weakness-list" aria-labelledby="student-weakness-title">
        <header><h2 id="student-weakness-title">학생 목록</h2><span>{students.length}명</span></header>
        <div className="student-weakness-list__items">{sorted.map((student) => {
            const work = studentWork[student.id];
            const workStatus = work?.assignment ? 'assigned' : work?.problems?.length ? 'created' : 'idle';
            const count = proposals[student.id]?.configs.length ?? 0;
            return <button type="button" key={student.id} className={`student-weakness-list__item${selectedId === student.id ? ' student-weakness-list__item--selected' : ''}`} aria-current={selectedId === student.id ? 'true' : undefined} onClick={() => onSelect(student.id)}>
                <span className="student-weakness-list__name"><strong>{student.name}</strong><span className={`custom-status custom-status--${student.status}`}>{statusLabels[student.status]}</span></span>
                <span className="student-weakness-list__meta">취약 개념 {count}개 <span aria-hidden="true">·</span> <em className={`student-weakness-list__work student-weakness-list__work--${workStatus}`}>{workLabels[workStatus]}</em></span>
            </button>;
        })}</div>
    </aside>;
}

export default StudentWeaknessList;
