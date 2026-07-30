import { useState } from 'react';
import StudentFormModal from './StudentFormModal';
import StudentGradeSelector from './StudentGradeSelector';
import StudentOptionalFields from './StudentOptionalFields';
import { formatGrade, parseGrade } from './studentFormConfig';

function StudentDetailModal({ student, onClose, onSave }) {
    const initialGrade = parseGrade(student.grade);
    const [form, setForm] = useState({
        name: student.name,
        attendanceNumber: student.attendanceNumber ?? String(student.id).padStart(4, '0'),
        studentPhone: student.phone === '-' ? '' : student.phone,
        parentPhone: student.parentPhone ?? '',
        school: student.school ?? '',
        classStartDate: student.classStartDate ?? '',
        birthDate: student.birthDate ?? '',
        email: student.email ?? '',
        address: student.address ?? '',
        homePhone: student.homePhone ?? '',
        note: student.note ?? '',
    });
    const [schoolLevel, setSchoolLevel] = useState(initialGrade.schoolLevel);
    const [gradeYear, setGradeYear] = useState(initialGrade.gradeYear);
    const [status, setStatus] = useState(student.status);
    const [passwordReset, setPasswordReset] = useState(false);

    const updateField = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    return (
        <StudentFormModal title="학생 상세 정보" closeLabel="학생 상세 정보 창 닫기" onClose={onClose}>
            <form onSubmit={(event) => {
                event.preventDefault();
                onSave({
                    ...student,
                    ...form,
                    phone: form.studentPhone || '-',
                    grade: formatGrade(schoolLevel, gradeYear),
                    status,
                });
            }}>
                <div className="student-form-modal__section-title">필수 입력 사항</div>
                <div className="student-form-modal__fields student-form-modal__fields--required">
                    <label className="student-form-modal__field">
                        <span>학생 이름</span>
                        <input autoFocus name="name" value={form.name} required onChange={updateField} />
                    </label>

                    <div className="student-form-modal__field">
                        <span>학년</span>
                        <StudentGradeSelector
                            schoolLevel={schoolLevel}
                            gradeYear={gradeYear}
                            onSchoolLevelChange={setSchoolLevel}
                            onGradeYearChange={setGradeYear}
                        />
                    </div>

                    <label className="student-form-modal__field">
                        <span>출결 번호</span>
                        <input name="attendanceNumber" value={form.attendanceNumber} inputMode="numeric" required onChange={updateField} />
                    </label>

                    <div className="student-form-modal__field">
                        <span>학생 상태</span>
                        <div className="student-form-modal__status-buttons">
                            <button type="button" className={status === 'active' ? 'student-form-modal__status-button--active' : ''} onClick={() => setStatus('active')}>활성</button>
                            <button type="button" className={status === 'inactive' ? 'student-form-modal__status-button--active' : ''} onClick={() => setStatus('inactive')}>비활성</button>
                        </div>
                    </div>

                    <label className="student-form-modal__field student-form-modal__field--wide">
                        <span>학생 ID</span>
                        <input className="student-form-modal__readonly" value={student.studentId} readOnly aria-readonly="true" />
                    </label>
                </div>

                <div className="student-form-modal__section-title">선택 입력 사항</div>
                <div className="student-form-modal__fields">
                    <StudentOptionalFields form={form} onChange={updateField} />
                </div>

                <footer className="student-form-modal__footer student-form-modal__footer--split">
                    <button
                        type="button"
                        className="student-form-modal__secondary-button"
                        disabled={passwordReset}
                        onClick={() => setPasswordReset(true)}
                    >
                        {passwordReset ? '학생 비밀번호 초기화 완료' : '학생 비밀번호 초기화'}
                    </button>
                    <button type="submit" className="student-form-modal__primary-button">저장하기</button>
                </footer>
            </form>
        </StudentFormModal>
    );
}

export default StudentDetailModal;
