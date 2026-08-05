import CustomCheckbox from '../../../components/common/CustomCheckbox/CustomCheckbox';

function StudentTable({ wrapRef, students, selectedIds, getClassLabel, onToggleAll, onToggleStudent, onOpenDetail, onOpenStudentApp }) {
    const visibleIds = students.map((student) => student.id);
    const isAllSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));

    const handleRowClick = (event, studentId) => {
        if (event.target.closest('button, input, a, label')) return;
        onToggleStudent(studentId);
    };

    const handleRowKeyDown = (event, studentId) => {
        if (event.target !== event.currentTarget || !['Enter', ' '].includes(event.key)) return;
        event.preventDefault();
        onToggleStudent(studentId);
    };

    return (
        <div className="student-list__table-wrap" ref={wrapRef}>
            <table className="student-list__table">
                <thead>
                    <tr>
                        <th className="student-list__check-cell">
                            <CustomCheckbox label="현재 목록 전체 선택" checked={isAllSelected} onChange={onToggleAll} />
                        </th>
                        <th>등록 연도</th>
                        <th>학년</th>
                        <th>반</th>
                        <th>학생 이름</th>
                        <th>출결 번호</th>
                        <th>학생 ID</th>
                        <th>학생앱</th>
                        <th>상세</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr
                            key={student.id}
                            className={`student-list__row${selectedIds.includes(student.id) ? ' student-list__row--selected' : ''}`}
                            tabIndex="0"
                            aria-selected={selectedIds.includes(student.id)}
                            onClick={(event) => handleRowClick(event, student.id)}
                            onKeyDown={(event) => handleRowKeyDown(event, student.id)}
                        >
                            <td className="student-list__check-cell">
                                <CustomCheckbox
                                    label={`${student.name} 선택`}
                                    checked={selectedIds.includes(student.id)}
                                    onChange={() => onToggleStudent(student.id)}
                                />
                            </td>
                            <td>{student.registrationYear}년</td>
                            <td>{student.grade}학년</td>
                            <td>{getClassLabel(student)
                                ?? <span className="student-list__unassigned">미배정</span>}</td>
                            <td>{student.name}</td>
                            <td>{student.attendanceNumber}</td>
                            <td>{student.studentId}</td>
                            <td><button type="button" className="student-list__table-button" onClick={() => onOpenStudentApp(student)}>학생앱으로 이동</button></td>
                            <td><button type="button" className="student-list__table-button" onClick={() => onOpenDetail(student)}>상세보기</button></td>
                        </tr>
                    ))}
                    {students.length === 0 && (
                        <tr><td className="student-list__empty" colSpan="9">검색 조건에 맞는 학생이 없습니다.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default StudentTable;
