import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/Header/Header';
import { clearAuth } from '../../../api/auth/authStorage';
import teachers from '../../../mocks/teachers';
import './TeacherProfilePage.scss';

const initialPasswordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
};

function TeacherProfilePage() {
    const navigate = useNavigate();
    const teacher = teachers[0];
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

    const handleLogout = () => {
        clearAuth();
        navigate('/', { replace: true });
    };

    return (
        <div className="teacher-profile">
            <Header />

            <main className="teacher-profile__main">
                <header className="teacher-profile__heading">
                    <h1>마이페이지</h1>
                    <p>계정 정보를 확인하고 비밀번호를 관리합니다.</p>
                </header>

                <div className="teacher-profile__content">
                    <section className="teacher-profile__section" aria-labelledby="teacher-info-title">
                        <div className="teacher-profile__section-heading">
                            <h2 id="teacher-info-title">내 정보</h2>
                            <p>계정 정보 변경이 필요하면 관리자에게 문의해 주세요.</p>
                        </div>

                        <dl className="teacher-profile__info-list">
                            <div>
                                <dt>이름</dt>
                                <dd>{teacher.name}</dd>
                            </div>
                            <div>
                                <dt>이메일</dt>
                                <dd>{teacher.email}</dd>
                            </div>
                        </dl>
                    </section>

                    <section className="teacher-profile__section" aria-labelledby="teacher-password-title">
                        <div className="teacher-profile__section-topline">
                            <div className="teacher-profile__section-heading">
                                <h2 id="teacher-password-title">비밀번호 변경</h2>
                                <p>새 비밀번호는 8자 이상으로 입력해 주세요.</p>
                            </div>
                            <button
                                type="submit"
                                form="teacher-password-form"
                                className="teacher-profile__primary-button"
                            >
                                비밀번호 변경
                            </button>
                        </div>

                        <form
                            id="teacher-password-form"
                            className="teacher-profile__password-form"
                            onSubmit={handlePasswordSubmit}
                            noValidate
                        >
                            <label htmlFor="teacher-current-password">현재 비밀번호</label>
                            <input
                                id="teacher-current-password"
                                type="password"
                                name="currentPassword"
                                value={passwordForm.currentPassword}
                                onChange={updatePasswordField}
                                autoComplete="current-password"
                                placeholder="현재 비밀번호 입력"
                            />
                            <label htmlFor="teacher-new-password">새 비밀번호</label>
                            <input
                                id="teacher-new-password"
                                type="password"
                                name="newPassword"
                                value={passwordForm.newPassword}
                                onChange={updatePasswordField}
                                autoComplete="new-password"
                                placeholder="새 비밀번호 입력"
                            />
                            <label htmlFor="teacher-confirm-password">새 비밀번호 확인</label>
                            <input
                                id="teacher-confirm-password"
                                type="password"
                                name="confirmPassword"
                                value={passwordForm.confirmPassword}
                                onChange={updatePasswordField}
                                autoComplete="new-password"
                                placeholder="새 비밀번호 다시 입력"
                            />

                            <p
                                className={message ? `teacher-profile__message teacher-profile__message--${message.type}` : 'teacher-profile__message'}
                                role="status"
                                aria-live="polite"
                            >
                                {message?.text}
                            </p>
                        </form>
                    </section>

                    <section className="teacher-profile__logout" aria-labelledby="teacher-logout-title">
                        <div>
                            <h2 id="teacher-logout-title">로그아웃</h2>
                            <p>현재 기기에서 교사 계정 사용을 종료합니다.</p>
                        </div>
                        <button type="button" onClick={handleLogout}>로그아웃</button>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default TeacherProfilePage;
