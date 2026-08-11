function CustomAssignBar({ student, assignment, onAssign }) {
    const today = new Date();
    today.setDate(today.getDate() + 7);
    const defaultDueAt = today.toISOString().slice(0, 10);
    return <form className="custom-assign" onSubmit={(event) => { event.preventDefault(); onAssign(event.currentTarget.elements.dueAt.value); }}>
        {assignment ? <p role="status"><i className="bi bi-check-circle-fill" aria-hidden="true" /> {student.name} 학생에게 {assignment.dueAt} 기한으로 배정했습니다.</p> : <p>검토한 문제를 {student.name} 학생에게 바로 배정합니다.</p>}
        <div><label htmlFor={`custom-due-${student.id}`}>학습 기한</label><input id={`custom-due-${student.id}`} name="dueAt" type="date" defaultValue={assignment?.dueAt ?? defaultDueAt} required /><button type="submit">{assignment ? '기한 변경 후 재배정' : '학생에게 배정'}</button></div>
    </form>;
}

export default CustomAssignBar;
