import StudentFormModal from '../../shared/StudentFormModal';

function StudentDetailModal({
    student,
    isPending,
    error,
    onRetry,
    onClose,
    onResetPassword,
    isPasswordResetPending,
    isPasswordResetSuccess,
    passwordResetError,
}) {
    const classLabel = student?.classes
        ?.map(({ academicYear, grade, name }) => `${academicYear}학년도 ${grade}학년 ${name}`)
        .join(', ');

    return (
        <StudentFormModal
            title="학생 상세 정보"
            closeLabel="학생 상세 정보 창 닫기"
            onClose={onClose}
            closeDisabled={isPasswordResetPending}
            width={440}
        >
            {isPending && (
                <div className="student-form-modal__state" role="status">
                    학생 상세 정보를 불러오는 중입니다.
                </div>
            )}

            {!isPending && error && (
                <div className="student-form-modal__state student-form-modal__state--error" role="alert">
                    <span>{error.message || '학생 상세 정보를 불러오지 못했습니다.'}</span>
                    <button type="button" onClick={onRetry}>다시 시도</button>
                </div>
            )}

            {!isPending && !error && student && (
                <div>
                <div className="student-form-modal__fields student-form-modal__fields--stacked">
                    <label className="student-form-modal__field">
                        <span>등록 연도</span>
                        <input className="student-form-modal__readonly" value={student.registrationYear} readOnly aria-readonly="true" />
                    </label>

                    <label className="student-form-modal__field">
                        <span>학생 이름</span>
                        <input className="student-form-modal__readonly" value={student.name} readOnly aria-readonly="true" />
                    </label>

                    <label className="student-form-modal__field">
                        <span>학년</span>
                        <input className="student-form-modal__readonly" value={`${student.grade}학년`} readOnly aria-readonly="true" />
                    </label>

                    <label className="student-form-modal__field">
                        <span>학생 ID</span>
                        <input className="student-form-modal__readonly" value={student.loginId} readOnly aria-readonly="true" />
                    </label>

                    <label className="student-form-modal__field">
                        <span>소속 반</span>
                        <input className="student-form-modal__readonly" value={classLabel || '미배정'} readOnly aria-readonly="true" />
                    </label>
                </div>

                {passwordResetError && (
                    <p className="student-form-modal__feedback student-form-modal__feedback--error" role="alert">
                        {passwordResetError.message || '학생 비밀번호를 초기화하지 못했습니다.'}
                    </p>
                )}
                {isPasswordResetSuccess && (
                    <p className="student-form-modal__feedback student-form-modal__feedback--success" role="status">
                        학생 비밀번호를 초기화했습니다.
                    </p>
                )}

                <footer className="student-form-modal__footer student-form-modal__footer--split">
                    <button
                        type="button"
                        className="student-form-modal__secondary-button"
                        disabled={isPasswordResetPending || isPasswordResetSuccess}
                        onClick={onResetPassword}
                    >
                        {isPasswordResetPending
                            ? '초기화 중...'
                            : isPasswordResetSuccess
                                ? '비밀번호 초기화 완료'
                                : '학생 비밀번호 초기화'}
                    </button>
                    <button type="button" className="student-form-modal__primary-button" onClick={onClose}>닫기</button>
                </footer>
                </div>
            )}
        </StudentFormModal>
    );
}

export default StudentDetailModal;
