import { useState } from 'react';
import StudentFormModal from './StudentFormModal';
import StudentGradeSelector from './StudentGradeSelector';

function StudentDetailModal({ student, onClose, onSave }) {
    const [form, setForm] = useState({
        name: student.name,
    });
    const [grade, setGrade] = useState(student.grade);
    const [passwordReset, setPasswordReset] = useState(false);

    const updateField = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    return (
        <StudentFormModal title="학생 상세 정보" closeLabel="학생 상세 정보 창 닫기" onClose={onClose} width={440}>
            <form onSubmit={(event) => {
                event.preventDefault();
                onSave({ ...student, ...form, grade });
            }}>
                <div className="student-form-modal__fields student-form-modal__fields--stacked">
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
                        <span>학생 ID</span>
                        <input className="student-form-modal__readonly" value={student.studentId} readOnly aria-readonly="true" />
                    </label>
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
