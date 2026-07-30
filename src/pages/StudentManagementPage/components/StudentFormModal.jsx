import { useEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import './StudentFormModal.scss';

function StudentFormModal({ title, closeLabel, onClose, children, width = 752 }) {
    const titleId = useId();

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const closeOnEscape = (event) => {
            if (event.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', closeOnEscape);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', closeOnEscape);
        };
    }, [onClose]);

    return createPortal(
        <div className="student-form-modal__overlay" onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
        }}>
            <section
                className="student-form-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                style={{ '--student-form-modal-width': typeof width === 'number' ? `${width}px` : width }}
            >
                <header className="student-form-modal__header">
                    <h2 id={titleId}>{title}</h2>
                    <button type="button" aria-label={closeLabel} onClick={onClose}>
                        <i className="bi bi-x-lg" aria-hidden="true" />
                    </button>
                </header>
                {children}
            </section>
        </div>,
        document.body,
    );
}

export default StudentFormModal;
