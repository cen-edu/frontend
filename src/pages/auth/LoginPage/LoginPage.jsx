import mainLogo from '../../../assets/images/login-main-logo.png'
import loginSymbol from '../../../assets/images/logo-symbol.png'
import {Link, useNavigate} from 'react-router-dom'

import './LoginPage.scss'
import {useState} from "react";
import {saveAuth} from "../../../api/auth/authStorage.js";
import {login} from "../../../api/auth/authApi.js";
import {useMutation} from "@tanstack/react-query";
import { useDialog } from '../../../components/common/feedback';

const LoginPage = () => {
    const navigate = useNavigate();
    const { alert } = useDialog();

    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const loginMutation = useMutation({
        mutationFn: login,
        onSuccess: (response) => {
            saveAuth(response);

            if (response.role === 'STUDENT') {
                navigate('/student', { replace: true });
                return;
            }

            navigate('/dashboard', { replace: true });
        },
        onError: (error) => {
            alert({
                title: '로그인하지 못했습니다',
                message: error?.message || '로그인에 실패했습니다.',
                tone: 'danger',
            });
        },
    });

    const handleSubmit = (event) => {
        event.preventDefault();

        loginMutation.mutate({
            loginId: loginId.trim(),
            password,
        });
    };

    return (
        <main className="login-page">
            {/* 왼쪽 영역 */}
            <section className="login-page__visual">
                <div className="login-page__grid"/>

                <div className="login-page__decorations">
                    <span className="visual-decoration visual-decoration--circle"/>
                    <span className="visual-decoration visual-decoration--dots"/>
                    <span className="visual-decoration visual-decoration--triangle"/>
                    <span className="visual-decoration visual-decoration--cube"/>
                </div>

                <div className="main-brand">
                    <img
                        className="main-brand__image"
                        src={mainLogo}
                        alt="센의 정석"
                    />

                    <p className="main-brand__description">
                        수학을 쉽게, 센의 정석
                    </p>
                </div>
            </section>

            {/* 오른쪽 영역 */}
            <section className="login-page__panel">
                <div className="login-page__background">
                    <span className="background-circle background-circle--top"/>
                    <span className="background-circle background-circle--right"/>
                    <span className="background-circle background-circle--bottom"/>
                </div>

                <div className="login-container">
                    <header className="login-brand">
                        <img
                            className="login-brand__logo"
                            src={loginSymbol}
                            alt="센의 정석 로고"
                        />

                        <h1 className="login-brand__title">
                            센의 정석
                        </h1>
                    </header>

                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="login-form__field">
                            <i className="bi bi-person login-form__field-icon"/>

                            <input
                                className="login-form__input"
                                type="text"
                                name="loginId"
                                value={loginId}
                                onChange={(event) => setLoginId(event.target.value)}
                                placeholder="아이디를 입력하세요"
                                autoComplete="username"
                                maxLength={64}
                                required
                            />
                        </div>

                        <div className="login-form__field">
                            <i className="bi bi-lock login-form__field-icon"/>

                            <input
                                className="login-form__input login-form__input--password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="비밀번호를 입력하세요"
                                autoComplete="current-password"
                                minLength={8}
                                maxLength={64}
                                required
                            />

                            <button
                                className="login-form__password-toggle"
                                type="button"
                                aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
                                onClick={() => setShowPassword((current) => !current)}
                            >
                                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} />
                            </button>
                        </div>

                        <button
                            className="login-form__submit"
                            type="submit"
                            disabled={loginMutation.isPending}
                        >
                            {loginMutation.isPending ? '로그인 중...' : '시작하기'}
                        </button>

                        <div className="login-form__links">
                            <span>계정이 없으신가요?</span>
                            <Link to="/signup">회원가입</Link>
                        </div>
                    </form>
                </div>

            </section>
        </main>
    );
};

export default LoginPage;
