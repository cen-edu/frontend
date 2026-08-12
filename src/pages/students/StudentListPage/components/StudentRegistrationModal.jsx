import { useState } from 'react';
import StudentFormModal from '../../shared/StudentFormModal';
import StudentGradeSelector from '../../shared/StudentGradeSelector';
import { EMPTY_STUDENT_FORM } from '../studentFormConfig';

function StudentRegistrationModal({ onClose, onRegister, isPending = false, }) {
    const [form, setForm] = useState(() => ({ ...EMPTY_STUDENT_FORM }));
    const [grade, setGrade] = useState('1');
    const registrationYear = String(new Date().getFullYear());

    const updateField = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    return (
        <StudentFormModal title="학생 개별 등록" closeLabel="학생 등록 창 닫기" onClose={onClose} width={440}>
            <form onSubmit={(event) => {
                event.preventDefault();
                onRegister({ ...form, grade, registrationYear });
            }}>
                <div className="student-form-modal__fields student-form-modal__fields--stacked">
                    <label className="student-form-modal__field">
                        <span>등록 연도</span>
                        <input className="student-form-modal__readonly" value={registrationYear} readOnly aria-readonly="true" />
                    </label>

                    <label className="student-form-modal__field">
                        <span>학생 이름</span>
                        <input
                            autoFocus
                            name="name"
                            value={form.name}
                            placeholder="학생 이름 입력"
                            minLength={2}
                            maxLength={50}
                            required
                            disabled={isPending}
                            onChange={updateField}
                        />
                    </label>

                    <div className="student-form-modal__field">
                        <span>학년</span>
                        <StudentGradeSelector value={grade} onChange={setGrade} />
                    </div>

                </div>

                <footer className="student-form-modal__footer">
                    <button
                        type="submit"
                        className="student-form-modal__primary-button"
                        disabled={isPending}
                    >
                        {isPending ? '등록 중...' : '등록하기'}
                    </button>
                </footer>
            </form>
        </StudentFormModal>
    );
}

export default StudentRegistrationModal;
