import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import students from '../../mocks/students';
import './StudentProfilePage.scss';

const initialPasswordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
};

function StudentProfilePage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const requestedStudentId = Number(searchParams.get('student'));
    const student = students.find((item) => item.id === requestedStudentId) ?? students[0];
    const [passwordForm, setPasswordForm] = useState(initialPasswordForm);
    const [message, setMessage] = useState(null);

    const updatePasswordField = (event) => {
        const { name, value } = event.target;
        setPasswordForm((current) => ({ ...current, [name]: value }));
        setMessage(null);
    };

    const handlePasswordSubmit = (event) => {
        event.preventDefault();

        if (Object.values(passwordForm).some((value) => !value)) {
            setMessage({ type: 'error', text: '비밀번호를 모두 입력해 주세요.' });
            return;
        }

        if (passwordForm.newPassword.length < 8) {
            setMessage({ type: 'error', text: '새 비밀번호는 8자 이상으로 입력해 주세요.' });
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setMessage({ type: 'error', text: '새 비밀번호와 비밀번호 확인이 일치하지 않습니다.' });
            return;
        }

        if (passwordForm.currentPassword === passwordForm.newPassword) {
            setMessage({ type: 'error', text: '현재 비밀번호와 다른 비밀번호를 입력해 주세요.' });
            return;
        }

        setPasswordForm(initialPasswordForm);
        setMessage({ type: 'success', text: '비밀번호가 변경되었습니다.' });
    };

    return (
        <div className="student-profile">
            <Header mode="student" userName={student.name} />

            <main className="student-profile__main">
                <div className="student-profile__heading">
                    <h1>마이페이지</h1>
                    <p>내 정보를 확인하고 비밀번호를 변경할 수 있습니다.</p>
                </div>

                <div className="student-profile__content">
                    <section className="student-profile__section" aria-labelledby="student-info-title">
                        <div className="student-profile__section-heading">
                            <h2 id="student-info-title">내 정보</h2>
                            <p>이름이나 출석번호를 바꾸려면 선생님께 요청해 주세요.</p>
                        </div>

                        <dl className="student-profile__info-list">
                            <div>
                                <dt>이름</dt>
                                <dd>{student.name}</dd>
                            </div>
                            <div>
                                <dt>학년</dt>
                                <dd>{student.grade}학년</dd>
                            </div>
                            <div>
                                <dt>아이디</dt>
                                <dd>{student.studentId}</dd>
                            </div>
                            <div>
                                <dt>출석번호</dt>
                                <dd>{Number(student.attendanceNumber)}번</dd>
                            </div>
                        </dl>
                    </section>

                    <section className="student-profile__section" aria-labelledby="password-title">
                        <div className="student-profile__section-topline">
                            <div className="student-profile__section-heading">
                                <h2 id="password-title">비밀번호 변경</h2>
                                <p>새 비밀번호는 8자 이상으로 입력해 주세요.</p>
                            </div>
                            <button
                                type="submit"
                                form="student-password-form"
                                className="student-profile__password-submit"
                            >
                                비밀번호 변경
                            </button>
                        </div>

                        <form
                            id="student-password-form"
                            className="student-profile__password-form"
                            onSubmit={handlePasswordSubmit}
                            noValidate
                        >
                            <label>
                                <span>현재 비밀번호</span>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={passwordForm.currentPassword}
                                    onChange={updatePasswordField}
                                    autoComplete="current-password"
                                    placeholder="현재 비밀번호 입력"
                                />
                            </label>
                            <label>
                                <span>새 비밀번호</span>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordForm.newPassword}
                                    onChange={updatePasswordField}
                                    autoComplete="new-password"
                                    placeholder="새 비밀번호 입력"
                                />
                            </label>
                            <label>
                                <span>새 비밀번호 확인</span>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordForm.confirmPassword}
                                    onChange={updatePasswordField}
                                    autoComplete="new-password"
                                    placeholder="새 비밀번호 다시 입력"
                                />
                            </label>

                            <p
                                className={message ? `student-profile__message student-profile__message--${message.type}` : 'student-profile__message'}
                                role="status"
                                aria-live="polite"
                            >
                                {message?.text}
                            </p>
                        </form>
                    </section>

                    <section className="student-profile__logout" aria-labelledby="logout-title">
                        <div>
                            <h2 id="logout-title">로그아웃</h2>
                            <p>현재 기기에서 학생 계정 사용을 종료합니다.</p>
                        </div>
                        <button type="button" onClick={() => navigate('/')}>로그아웃</button>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default StudentProfilePage;
