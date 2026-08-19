import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
    changeStudentPassword,
    getStudentAccount,
} from '../../../api/student/studentAccountApi';
import Header from '../../../components/Header/Header';
import './StudentProfilePage.scss';

const initialPasswordForm = {
    currentPassword: '',
    newPassword: '',
    newPasswordConfirm: '',
};

function StudentProfilePage() {
    const navigate = useNavigate();
    const [passwordForm, setPasswordForm] = useState(initialPasswordForm);
    const accountQuery = useQuery({
        queryKey: ['student', 'account'],
        queryFn: ({ signal }) => getStudentAccount({ signal }),
    });
    const passwordMutation = useMutation({
        mutationFn: changeStudentPassword,
        onSuccess: () => {
            setPasswordForm(initialPasswordForm);
            window.alert('비밀번호가 변경되었습니다.');
        },
        onError: (error) => {
            window.alert(error?.message || '비밀번호 변경에 실패했습니다. 잠시 후 다시 시도해 주세요.');
        },
    });

    const updatePasswordField = (event) => {
        const { name, value } = event.target;
        setPasswordForm((current) => ({ ...current, [name]: value }));
    };

    const handlePasswordSubmit = (event) => {
        event.preventDefault();

        if (Object.values(passwordForm).some((value) => !value)) {
            window.alert('비밀번호를 모두 입력해 주세요.');
            return;
        }

        if (Object.values(passwordForm).some((value) => value.length < 8 || value.length > 64)) {
            window.alert('비밀번호는 8자 이상 64자 이하로 입력해 주세요.');
            return;
        }

        if (passwordForm.newPassword !== passwordForm.newPasswordConfirm) {
            window.alert('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
            return;
        }

        if (passwordForm.currentPassword === passwordForm.newPassword) {
            window.alert('현재 비밀번호와 다른 비밀번호를 입력해 주세요.');
            return;
        }

        passwordMutation.mutate(passwordForm);
    };

    return (
        <div className="student-profile">
            <Header mode="student" userName={accountQuery.data?.name || '...'} />

            <main className="student-profile__main">
                <div className="student-profile__heading">
                    <h1>마이페이지</h1>
                    <p>내 정보를 확인하고 비밀번호를 변경할 수 있습니다.</p>
                </div>

                <div className="student-profile__content">
                    <section className="student-profile__section" aria-labelledby="student-info-title">
                        <div className="student-profile__section-heading">
                            <h2 id="student-info-title">내 정보</h2>
                            <p>이름이나 학년을 바꾸려면 선생님께 요청해 주세요.</p>
                        </div>

                        <dl className="student-profile__info-list">
                            <div>
                                <dt>이름</dt>
                                <dd>{accountQuery.isPending ? '불러오는 중...' : accountQuery.data?.name || '-'}</dd>
                            </div>
                            <div>
                                <dt>학년</dt>
                                <dd>
                                    {accountQuery.isPending
                                        ? '불러오는 중...'
                                        : accountQuery.data?.grade != null
                                            ? `${accountQuery.data.grade}학년`
                                            : '-'}
                                </dd>
                            </div>
                            <div>
                                <dt>아이디</dt>
                                <dd>{accountQuery.isPending ? '불러오는 중...' : accountQuery.data?.loginId || '-'}</dd>
                            </div>
                        </dl>

                        {accountQuery.isError && (
                            <div className="student-profile__account-error" role="alert">
                                <span>{accountQuery.error?.message || '내 정보를 불러오지 못했습니다.'}</span>
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
                                disabled={passwordMutation.isPending}
                            >
                                {passwordMutation.isPending ? '변경 중...' : '비밀번호 변경'}
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
                                    minLength={8}
                                    maxLength={64}
                                    disabled={passwordMutation.isPending}
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
                                    minLength={8}
                                    maxLength={64}
                                    disabled={passwordMutation.isPending}
                                />
                            </label>
                            <label>
                                <span>새 비밀번호 확인</span>
                                <input
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
                            </label>
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
