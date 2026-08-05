import { useCallback, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import logoSymbol from "../../assets/images/logo-symbol.png";
import "./Header.scss";

function Header({ hideOnWheel = false, onHiddenChange, mode = 'teacher', userName }) {
    const location = useLocation();
    const studentId = new URLSearchParams(location.search).get('student');
    const studentQuery = studentId ? `?student=${encodeURIComponent(studentId)}` : '';
    const studentHomePath = `/student${studentQuery}`;
    const studentWorksheetsPath = `/student/worksheets${studentQuery}`;
    const studentProfilePath = `/student/profile${studentQuery}`;
    const [isHidden, setIsHidden] = useState(false);
    const downwardWheelCount = useRef(0);
    const updateVisibility = useCallback((hidden) => {
        setIsHidden(hidden);
        onHiddenChange?.(hidden);
    }, [onHiddenChange]);

    useEffect(() => {
        if (!hideOnWheel) {
            downwardWheelCount.current = 0;
            updateVisibility(false);
            return undefined;
        }

        const handleWheel = ({ deltaY }) => {
            if (deltaY > 0) {
                downwardWheelCount.current += 1;

                if (downwardWheelCount.current >= 2) {
                    updateVisibility(true);
                }

                return;
            }

            if (deltaY < 0) {
                downwardWheelCount.current = 0;
                updateVisibility(false);
            }
        };

        const handleScroll = () => {
            if (window.scrollY <= 0) {
                downwardWheelCount.current = 0;
                updateVisibility(false);
            }
        };

        window.addEventListener("wheel", handleWheel, { passive: true });
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("wheel", handleWheel);
            window.removeEventListener("scroll", handleScroll);
        };
    }, [hideOnWheel, updateVisibility]);

    const revealForKeyboard = () => {
        downwardWheelCount.current = 0;
        updateVisibility(false);
    };

    return (
        <header
            className={`header ${isHidden ? "header--hidden" : ""}`}
            onFocusCapture={revealForKeyboard}
        >
            <div className="header__inner">
                <div className="header__left">
                    <NavLink to={mode === 'student' ? studentHomePath : '/dashboard'} className="header__brand">
                        <img
                            src={logoSymbol}
                            alt=""
                            className="header__brand-image"
                        />

                        <span className="header__brand-name">센의 정석</span>
                    </NavLink>

                    {mode === 'teacher' ? <nav className="header__navigation" aria-label="주요 메뉴">
                        <NavLink
                            to="/dashboard"
                            className={({ isActive }) =>
                                `header__menu ${isActive ? "header__menu--active" : ""}`
                            }
                        >
                            대시보드
                        </NavLink>

                        <NavLink
                            to="/problems"
                            className={({ isActive }) =>
                                `header__menu ${isActive ? "header__menu--active" : ""}`
                            }
                        >
                            문제 만들기
                        </NavLink>

                        <NavLink
                            to="/learning"
                            className={({ isActive }) =>
                                `header__menu ${isActive ? "header__menu--active" : ""}`
                            }
                        >
                            학습 관리
                        </NavLink>

                        <NavLink
                            to="/students"
                            className={({ isActive }) =>
                                `header__menu ${isActive ? "header__menu--active" : ""}`
                            }
                        >
                            학생 관리
                        </NavLink>
                    </nav> : (
                        <nav className="header__navigation" aria-label="학생 메뉴">
                            <NavLink
                                to={studentHomePath}
                                end
                                className={({ isActive }) =>
                                    `header__menu ${isActive ? "header__menu--active" : ""}`
                                }
                            >
                                내 학습
                            </NavLink>
                            <NavLink
                                to={studentWorksheetsPath}
                                className={({ isActive }) =>
                                    `header__menu ${isActive ? "header__menu--active" : ""}`
                                }
                            >
                                학습지
                            </NavLink>
                        </nav>
                    )}
                </div>

                {mode === 'teacher' ? <button type="button" className="header__profile">
          <span className="header__profile-icon">
            <i className="bi bi-person-fill" />
          </span>

                    <span className="header__profile-name">이하영 선생님</span>

                    <i className="bi bi-chevron-down header__profile-arrow" />
                </button> : (
                    <div className="header__student-actions">
                        <NavLink
                            to={studentProfilePath}
                            aria-label={`${userName} 학생 마이페이지`}
                            className={({ isActive }) => `header__student-name${isActive ? ' header__student-name--active' : ''}`}
                        >
                            <i className="bi bi-person-fill" aria-hidden="true" />
                            {userName} 학생
                            <i className="bi bi-chevron-right header__student-name-arrow" aria-hidden="true" />
                        </NavLink>
                        <Link to="/students" className="header__return-link">
                            교사 화면으로 돌아가기
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;
