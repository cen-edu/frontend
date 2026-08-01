import { useState } from 'react';
import StudentFormModal from './StudentFormModal';
import StudentGradeSelector from './StudentGradeSelector';
import StudentOptionalFields from './StudentOptionalFields';
import { EMPTY_STUDENT_FORM, formatGrade } from './studentFormConfig';

function StudentRegistrationModal({ onClose, onRegister }) {
    const [form, setForm] = useState(() => ({ ...EMPTY_STUDENT_FORM }));
    const [schoolLevel, setSchoolLevel] = useState('elementary');
    const [gradeYear, setGradeYear] = useState('1');

    const updateField = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    return (
        <StudentFormModal title="학생 개별 등록" closeLabel="학생 등록 창 닫기" onClose={onClose}>
            <form onSubmit={(event) => {
                event.preventDefault();
                onRegister({ ...form, grade: formatGrade(schoolLevel, gradeYear) });
            }}>
                <div className="student-form-modal__section-title">필수 입력 사항</div>
                <div className="student-form-modal__fields student-form-modal__fields--required">
                    <label className="student-form-modal__field">
                        <span>학생 이름 <em>(필수)</em></span>
                        <input autoFocus name="name" value={form.name} placeholder="학생 이름 입력" required onChange={updateField} />
                    </label>

                    <div className="student-form-modal__field">
                        <span>학년 <em>(필수)</em></span>
                        <StudentGradeSelector
                            schoolLevel={schoolLevel}
                            gradeYear={gradeYear}
                            onSchoolLevelChange={setSchoolLevel}
                            onGradeYearChange={setGradeYear}
                        />
                    </div>

                    <label className="student-form-modal__field">
                        <span>출결 번호 <em>(필수)</em></span>
                        <input name="attendanceNumber" value={form.attendanceNumber} inputMode="numeric" placeholder="출결 번호 입력" required onChange={updateField} />
                    </label>
                </div>

                <div className="student-form-modal__section-title">선택 입력 사항</div>
                <div className="student-form-modal__fields">
                    <StudentOptionalFields form={form} onChange={updateField} />
                </div>

                <footer className="student-form-modal__footer">
                    <button type="submit" className="student-form-modal__primary-button">등록하기</button>
                </footer>
            </form>
        </StudentFormModal>
    );
}

export default StudentRegistrationModal;
