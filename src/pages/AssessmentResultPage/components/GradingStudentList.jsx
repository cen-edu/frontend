const isComplete = (student, isPractice) => student.answers.every((answer) => isPractice
    ? ['correct', 'partial', 'wrong'].includes(answer.result) || typeof answer.isCorrect === 'boolean'
    : answer.score !== null);

function GradingStudentList({ students, selectedId, onSelect, isPractice = false }) {
    const completedCount = students.filter((student) => isComplete(student, isPractice)).length;

    return (
        <aside className="grading-student-list" aria-label="학생 목록">
            <div className="grading-student-list__heading"><span>학생</span><strong>{completedCount}/{students.length}</strong></div>
            <div className="grading-student-list__items">
                {students.map((student) => {
                    const complete = isComplete(student, isPractice);
                    return <button key={student.id} type="button" className={`grading-student-list__item${selectedId === student.id ? ' grading-student-list__item--selected' : ''}`} onClick={() => onSelect(student.id)}><span><em>{student.number}</em><strong>{student.name}</strong></span><span className={complete ? 'grading-student-list__status grading-student-list__status--complete' : 'grading-student-list__status'}>{complete ? '완료' : '대기'}</span></button>;
                })}
            </div>
        </aside>
    );
}

export default GradingStudentList;
