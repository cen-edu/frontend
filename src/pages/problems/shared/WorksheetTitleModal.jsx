import { useEffect, useRef, useState } from 'react';
import StudentFormModal from '../../students/shared/StudentFormModal.jsx';
import './WorksheetTitleModal.scss';

function WorksheetTitleModal({ initialTitle, isSaving, error, onClose, onSave }) {
    const [title, setTitle] = useState(initialTitle);
    const inputRef = useRef(null);
    const normalizedTitle = title.trim();

    useEffect(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
    }, []);

    const submit = (event) => {
        event.preventDefault();
        if (!normalizedTitle || isSaving) return;
        onSave(normalizedTitle);
    };

    return (
        <StudentFormModal
            title="학습지 제목 입력"
            closeLabel="학습지 제목 입력 창 닫기"
            onClose={onClose}
            closeDisabled={isSaving}
            width={520}
        >
            <form className="worksheet-title-modal" onSubmit={submit}>
                <div className="worksheet-title-modal__content">
                    <label htmlFor="worksheet-title-input">학습지 제목</label>
                    <input
                        ref={inputRef}
                        id="worksheet-title-input"
                        type="text"
                        value={title}
                        placeholder="학습지 제목을 입력하세요"
                        disabled={isSaving}
                        onChange={(event) => setTitle(event.target.value)}
                    />
                    {error && <p className="worksheet-title-modal__error" role="alert"><i className="bi bi-exclamation-circle-fill" aria-hidden="true" /> {error}</p>}
                </div>
                <footer className="student-form-modal__footer">
                    <button type="button" className="student-form-modal__secondary-button" disabled={isSaving} onClick={onClose}>취소</button>
                    <button type="submit" className="student-form-modal__primary-button" disabled={!normalizedTitle || isSaving}>{isSaving ? '저장 중...' : '저장'}</button>
                </footer>
            </form>
        </StudentFormModal>
    );
}

export default WorksheetTitleModal;
