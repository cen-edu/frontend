import { useState } from 'react';
import StudentFormModal from './StudentFormModal';
import StudentGradeSelector from './StudentGradeSelector';
import StudentOptionalFields from './StudentOptionalFields';

function StudentDetailModal({ student, onClose, onSave }) {
    const [form, setForm] = useState({
        name: student.name,
        attendanceNumber: student.attendanceNumber ?? String(student.id).padStart(4, '0'),
        studentPhone: student.phone === '-' ? '' : student.phone,
        parentPhone: student.parentPhone ?? '',
        birthDate: student.birthDate ?? '',
        email: student.email ?? '',
        address: student.address ?? '',
        homePhone: student.homePhone ?? '',
        note: student.note ?? '',
    });
    const [grade, setGrade] = useState(student.grade);
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
                    grade,
                });
            }}>
                <div className="student-form-modal__section-title">필수 입력 사항</div>
                <div className="student-form-modal__fields student-form-modal__fields--required">
                    <label className="student-form-modal__field">
                        <span>등록 연도</span>
                        <input className="student-form-modal__readonly" value={student.registrationYear} readOnly aria-readonly="true" />
                    </label>

                    <label className="student-form-modal__field">
                        <span>학생 이름</span>
                        <input autoFocus name="name" value={form.name} required onChange={updateField} />
                    </label>

                    <div className="student-form-modal__field">
                        <span>학년</span>
                        <StudentGradeSelector value={grade} onChange={setGrade} />
                    </div>

                    <label className="student-form-modal__field">
                        <span>출결 번호</span>
                        <input name="attendanceNumber" value={form.attendanceNumber} inputMode="numeric" required onChange={updateField} />
                    </label>

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
