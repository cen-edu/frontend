import { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'

import loginSymbol from '../../../assets/images/logo-symbol.png'
import './SignupPage.scss'
import {useMutation} from "@tanstack/react-query";
import {signup} from "../../../api/auth/authApi.js";
import { useDialog } from '../../../components/common/feedback';

const SignupPage = () => {
    const navigate = useNavigate();
    const { alert } = useDialog();

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const signupMutation = useMutation({
        mutationFn: signup,
        onSuccess: async (response) => {
            await alert({
                title: '회원가입 완료',
                message: `${response.name}님, 회원가입이 완료되었습니다.`,
                tone: 'success',
            });
            navigate('/', { replace: true });
        },
        onError: (error) => {
            alert({
                title: '회원가입을 완료하지 못했습니다',
                message: error?.message || '회원가입에 실패했습니다.',
                tone: 'danger',
            });
        },
    });

    const handleSubmit = (event) => {
        event.preventDefault();

        if (password !== passwordConfirm) {
            alert({
                title: '입력 내용을 확인해 주세요',
                message: '비밀번호가 일치하지 않습니다.',
                tone: 'warning',
            });
            return;
        }

        signupMutation.mutate({
            email: email.trim(),
            name: name.trim(),
            password,
        });
    };

    return (
        <main className="signup-page">
            <div className="signup-page__decoration" aria-hidden="true">
                <span className="signup-page__circle signup-page__circle--top" />
                <span className="signup-page__circle signup-page__circle--bottom" />
            </div>

            <section className="signup-card" aria-labelledby="signup-title">
                <header className="signup-card__header">
                    <img
                        className="signup-card__logo"
                        src={loginSymbol}
                        alt=""
                    />
                    <div>
                        <h1 id="signup-title" className="signup-card__title">회원가입</h1>
                    </div>
                </header>

                <form className="signup-form" onSubmit={handleSubmit}>
                    <div className="signup-form__field">
                        <label className="signup-form__label" htmlFor="signup-email">이메일</label>
                        <div className="signup-form__control">
                            <i className="bi bi-envelope signup-form__icon" aria-hidden="true" />
                            <input
                                id="signup-email"
                                className="signup-form__input"
                                type="email"
                                name="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="이메일을 입력하세요"
                                autoComplete="email"
                                maxLength={64}
                                required
                            />
                        </div>
                    </div>

                    <div className="signup-form__field">
                        <label className="signup-form__label" htmlFor="signup-name">이름</label>
                        <div className="signup-form__control">
                            <i className="bi bi-person signup-form__icon" aria-hidden="true" />
                            <input
                                id="signup-name"
                                className="signup-form__input"
                                type="text"
                                name="name"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                placeholder="이름을 입력하세요"
                                autoComplete="name"
                                minLength={2}
                                maxLength={50}
                                required
                            />
                        </div>
                        <p className="signup-form__help">2자 이상 50자 이하로 입력해주세요.</p>
                    </div>

                    <div className="signup-form__field">
                        <label className="signup-form__label" htmlFor="signup-password">비밀번호</label>
                        <div className="signup-form__control">
                            <i className="bi bi-lock signup-form__icon" aria-hidden="true" />
                            <input
                                id="signup-password"
                                className="signup-form__input signup-form__input--password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="비밀번호를 입력하세요"
                                autoComplete="new-password"
                                minLength={8}
                                maxLength={64}
                                required
                            />
                            <button
                                className="signup-form__password-toggle"
                                type="button"
                                aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                                aria-pressed={showPassword}
                                onClick={() => setShowPassword((visible) => !visible)}
                            >
                                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} aria-hidden="true" />
                            </button>
                        </div>
                        <p className="signup-form__help">8자 이상 64자 이하로 입력해주세요.</p>
                    </div>

                    <div className="signup-form__field">
                        <label className="signup-form__label" htmlFor="signup-password-confirm">비밀번호 확인</label>
                        <div className="signup-form__control">
                            <i className="bi bi-shield-check signup-form__icon" aria-hidden="true" />
                            <input
                                id="signup-password-confirm"
                                className="signup-form__input signup-form__input--password"
                                type={showPassword ? 'text' : 'password'}
                                name="passwordConfirm"
                                value={passwordConfirm}
                                onChange={(event) => setPasswordConfirm(event.target.value)}
                                placeholder="비밀번호를 다시 입력하세요"
                                autoComplete="new-password"
                                minLength={8}
                                maxLength={64}
                                required
                            />
                        </div>
                    </div>

                    <button
                        className="signup-form__submit"
                        type="submit"
                        disabled={signupMutation.isPending}
                    >
                        {signupMutation.isPending ? '가입 중...' : '가입하기'}
                    </button>
                </form>

                <p className="signup-card__login-link">
                    이미 계정이 있으신가요?
                    <Link to="/">로그인</Link>
                </p>
            </section>
        </main>
    )
}

export default SignupPage
