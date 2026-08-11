import { useState } from 'react'
import { Link } from 'react-router-dom'

import loginSymbol from '../../assets/images/logo-symbol.png'
import './SignupPage.scss'

const SignupPage = () => {
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = (event) => {
        event.preventDefault()
    }

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
                                placeholder="비밀번호를 다시 입력하세요"
                                autoComplete="new-password"
                                minLength={8}
                                maxLength={64}
                                required
                            />
                        </div>
                    </div>

                    <button className="signup-form__submit" type="submit">가입하기</button>
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
