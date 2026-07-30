import mainLogo from '../../assets/images/login-main-logo.png'
import loginSymbol from '../../assets/images/logo-symbol.png'
import { useNavigate } from 'react-router-dom'

import './LoginPage.scss'

const LoginPage = () => {
    const navigate = useNavigate();

    return (
        <main className="login-page">
            {/* 왼쪽 영역 */}
            <section className="login-page__visual">
                <div className="login-page__grid" />

                <div className="login-page__decorations">
                    <span className="visual-decoration visual-decoration--circle" />
                    <span className="visual-decoration visual-decoration--dots" />
                    <span className="visual-decoration visual-decoration--triangle" />
                    <span className="visual-decoration visual-decoration--cube" />
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
                    <span className="background-circle background-circle--top" />
                    <span className="background-circle background-circle--right" />
                    <span className="background-circle background-circle--bottom" />
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

                    <div className="login-form">
                        <div className="login-form__field">
                            <i className="bi bi-person login-form__field-icon" />

                            <input
                                className="login-form__input"
                                type="text"
                                placeholder="아이디를 입력하세요"
                            />
                        </div>

                        <div className="login-form__field">
                            <i className="bi bi-lock login-form__field-icon" />

                            <input
                                className="login-form__input login-form__input--password"
                                type="password"
                                placeholder="비밀번호를 입력하세요"
                            />

                            <button
                                className="login-form__password-toggle"
                                type="button"
                            >
                                <i className="bi bi-eye" />
                            </button>
                        </div>

                        <label className="login-form__remember">
                            <input type="checkbox" />

                            <span className="login-form__checkbox">
                <i className="bi bi-check" />
              </span>

                            <span>로그인 상태 유지</span>
                        </label>

                        <button
                            className="login-form__submit"
                            type="button"
                            onClick={() => navigate('/dashboard')}
                        >
                            시작하기
                        </button>

                        <div className="login-form__links">
                            <a href="#">회원가입</a>

                            <span className="login-form__divider" />

                            <a href="#">비밀번호 찾기</a>
                        </div>
                    </div>
                </div>

                <footer className="login-footer">
                    <div className="login-footer__contact">
                        <i className="bi bi-headset login-footer__icon" />

                        <strong>고객센터 1670-1234</strong>

                        <span className="login-footer__divider" />

                        <span>평일 09:00 ~ 18:00</span>
                    </div>

                    <p className="login-footer__description">
                        궁금한 내용이 있으시면 언제든지 문의해주세요.
                    </p>
                </footer>
            </section>
        </main>
    );
};

export default LoginPage;
