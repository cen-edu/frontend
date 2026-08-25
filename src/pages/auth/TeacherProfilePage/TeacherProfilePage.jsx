import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import Header from '../../../components/Header/Header';
import { clearAuth } from '../../../api/auth/authStorage';
import {
    changeTeacherPassword,
    deleteTeacherAccount,
    getTeacherAccount,
} from '../../../api/teachers/teacherAccountApi';
import { useDialog } from '../../../components/common/feedback';
import './TeacherProfilePage.scss';

const initialPasswordForm = {
    currentPassword: '',
    newPassword: '',
    newPasswordConfirm: '',
};

function TeacherProfilePage() {
    const navigate = useNavigate();
    const { alert, confirm } = useDialog();
    const [passwordForm, setPasswordForm] = useState(initialPasswordForm);
    const [message, setMessage] = useState(null);
    const accountQuery = useQuery({
        queryKey: ['teacher', 'account'],
        queryFn: ({ signal }) => getTeacherAccount({ signal }),
    });
    const passwordMutation = useMutation({
        mutationFn: changeTeacherPassword,
        onSuccess: () => {
            setPasswordForm(initialPasswordForm);
            setMessage(null);
            alert({
                title: '비밀번호 변경 완료',
                message: '비밀번호가 변경되었습니다.',
                tone: 'success',
            });
        },
        onError: (error) => {
            setMessage({
                type: 'error',
                text: error?.message || '비밀번호 변경에 실패했습니다. 잠시 후 다시 시도해 주세요.',
            });
        },
    });
    const deleteAccountMutation = useMutation({
        mutationFn: deleteTeacherAccount,
        onSuccess: () => {
            clearAuth();
            navigate('/', { replace: true });
        },
        onError: (error) => {
            alert({
                title: '회원 탈퇴를 완료하지 못했습니다',
                message: error?.message || '회원 탈퇴에 실패했습니다. 잠시 후 다시 시도해 주세요.',
                tone: 'danger',
            });
        },
    });

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

        if (Object.values(passwordForm).some((value) => value.length < 8 || value.length > 64)) {
            setMessage({ type: 'error', text: '비밀번호는 8자 이상 64자 이하로 입력해 주세요.' });
            return;
        }

        if (passwordForm.newPassword !== passwordForm.newPasswordConfirm) {
            setMessage({ type: 'error', text: '새 비밀번호와 비밀번호 확인이 일치하지 않습니다.' });
            return;
        }

        if (passwordForm.currentPassword === passwordForm.newPassword) {
            setMessage({ type: 'error', text: '현재 비밀번호와 다른 비밀번호를 입력해 주세요.' });
            return;
        }

        passwordMutation.mutate(passwordForm);
    };

    const handleLogout = () => {
        clearAuth();
        navigate('/', { replace: true });
    };

    const handleDeleteAccount = async () => {
        const confirmed = await confirm({
            title: '회원 탈퇴',
            message: '회원 탈퇴 시 계정과 관련 데이터가 삭제되며 복구할 수 없습니다. 정말 탈퇴하시겠습니까?',
            confirmText: '탈퇴하기',
            tone: 'danger',
        });

        if (confirmed) {
            deleteAccountMutation.mutate();
        }
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
                                <dd>{accountQuery.isPending ? '불러오는 중...' : accountQuery.data?.name || '-'}</dd>
                            </div>
                            <div>
                                <dt>이메일</dt>
                                <dd>{accountQuery.isPending ? '불러오는 중...' : accountQuery.data?.email || '-'}</dd>
                            </div>
                        </dl>

                        {accountQuery.isError && (
                            <div className="teacher-profile__account-error" role="alert">
                                <span>{accountQuery.error?.message || '계정 정보를 불러오지 못했습니다.'}</span>
                                <button
                                    type="button"
                                    onClick={() => accountQuery.refetch()}
                                    disabled={accountQuery.isFetching}
                                >
                                    {accountQuery.isFetching ? '다시 불러오는 중...' : '다시 불러오기'}
                                </button>
                            </div>
                        )}
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
                                disabled={passwordMutation.isPending}
                            >
                                {passwordMutation.isPending ? '변경 중...' : '비밀번호 변경'}
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
                                minLength={8}
                                maxLength={64}
                                disabled={passwordMutation.isPending}
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
                                minLength={8}
                                maxLength={64}
                                disabled={passwordMutation.isPending}
                            />
                            <label htmlFor="teacher-confirm-password">새 비밀번호 확인</label>
                            <input
                                id="teacher-confirm-password"
                                type="password"
                                name="newPasswordConfirm"
                                value={passwordForm.newPasswordConfirm}
                                onChange={updatePasswordField}
                                autoComplete="new-password"
                                placeholder="새 비밀번호 다시 입력"
                                minLength={8}
                                maxLength={64}
                                disabled={passwordMutation.isPending}
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

                    <section className="teacher-profile__withdrawal" aria-labelledby="teacher-withdrawal-title">
                        <div>
                            <h2 id="teacher-withdrawal-title">회원 탈퇴</h2>
                            <p>계정과 관련 데이터가 삭제되며 탈퇴 후에는 복구할 수 없습니다.</p>
                        </div>
                        <button
                            type="button"
                            onClick={handleDeleteAccount}
                            disabled={deleteAccountMutation.isPending}
                        >
                            {deleteAccountMutation.isPending ? '탈퇴 처리 중...' : '회원 탈퇴'}
                        </button>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default TeacherProfilePage;
