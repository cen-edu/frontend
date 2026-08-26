import { useState } from 'react';

const padDatePart = (value) => String(value).padStart(2, '0');

const getDefaultDueAt = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    date.setHours(23, 59, 0, 0);

    return `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(date.getDate())}T${padDatePart(date.getHours())}:${padDatePart(date.getMinutes())}`;
};

const formatDueAt = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).format(date);
};

function CustomAssignBar({
    student,
    initialTitle,
    assignment,
    isSaving,
    isAssigning,
    error,
    disabledReason,
    onAssign,
}) {
    const [title, setTitle] = useState(initialTitle);
    const [dueAt, setDueAt] = useState(getDefaultDueAt);
    const [validationError, setValidationError] = useState('');
    const isPending = isSaving || isAssigning;

    const submit = (event) => {
        event.preventDefault();
        const selectedDueAt = new Date(dueAt);

        if (!title.trim()) {
            setValidationError('학습지 이름을 입력해 주세요.');
            return;
        }
        if (Number.isNaN(selectedDueAt.getTime()) || selectedDueAt.getTime() <= Date.now()) {
            setValidationError('제출 기한은 현재보다 미래로 설정해 주세요.');
            return;
        }

        setValidationError('');
        onAssign({ title: title.trim(), dueAt: selectedDueAt.toISOString() });
    };

    if (assignment) {
        return <div className="custom-assign custom-assign--complete" role="status">
            <p><i className="bi bi-check-circle-fill" aria-hidden="true" /> <strong>{student.name}</strong> 학생에게 맞춤 학습을 배정했습니다.</p>
            <span>제출 기한 {formatDueAt(assignment.dueAt)}</span>
        </div>;
    }

    const errorMessage = validationError || error || disabledReason;

    return <form className="custom-assign" aria-busy={isPending} onSubmit={submit}>
        <div className="custom-assign__context">
            <p>검토한 문제를 <strong>{student.name}</strong> 학생의 맞춤 학습지로 저장하고 배정합니다.</p>
            {errorMessage && <span className={validationError || error ? 'custom-assign__error' : 'custom-assign__help'} role={validationError || error ? 'alert' : undefined}>{errorMessage}</span>}
        </div>
        <div className="custom-assign__fields">
            <label htmlFor={`custom-title-${student.id}`}>
                <span>학습지 이름</span>
                <input id={`custom-title-${student.id}`} type="text" value={title} maxLength={100} disabled={isPending} onChange={(event) => { setTitle(event.target.value); setValidationError(''); }} required />
            </label>
            <label htmlFor={`custom-due-${student.id}`}>
                <span>제출 기한</span>
                <input id={`custom-due-${student.id}`} type="datetime-local" value={dueAt} disabled={isPending} onChange={(event) => { setDueAt(event.target.value); setValidationError(''); }} required />
            </label>
            <button type="submit" disabled={Boolean(disabledReason) || isPending || !title.trim() || !dueAt}>
                {isSaving ? '학습지 저장 중...' : isAssigning ? '학생에게 배정 중...' : '학생에게 배정'}
            </button>
        </div>
    </form>;
}

export default CustomAssignBar;
