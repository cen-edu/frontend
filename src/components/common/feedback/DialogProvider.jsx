import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
} from 'react';
import { createPortal } from 'react-dom';
import './DialogProvider.scss';

const DialogContext = createContext(null);

const getFocusableElements = (container) => [...container.querySelectorAll(
    'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
)];

function DialogModal({ dialog, onResolve }) {
    const titleId = useId();
    const messageId = useId();
    const dialogRef = useRef(null);
    const primaryButtonRef = useRef(null);
    const cancelButtonRef = useRef(null);
    const isConfirm = dialog.type === 'confirm';
    const isDanger = dialog.tone === 'danger';

    useEffect(() => {
        const previouslyFocusedElement = document.activeElement;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const initialFocusTarget = isDanger && isConfirm
            ? cancelButtonRef.current
            : primaryButtonRef.current;
        initialFocusTarget?.focus();

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                onResolve(isConfirm ? false : true);
                return;
            }

            if (event.key !== 'Tab') return;

            const focusableElements = getFocusableElements(dialogRef.current);
            if (focusableElements.length === 0) {
                event.preventDefault();
                return;
            }

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', handleKeyDown);
            previouslyFocusedElement?.focus?.();
        };
    }, [isConfirm, isDanger, onResolve]);

    const closeFromOverlay = (event) => {
        if (event.target === event.currentTarget) {
            onResolve(isConfirm ? false : true);
        }
    };

    return createPortal(
        <div className="common-dialog__overlay" onMouseDown={closeFromOverlay}>
            <section
                ref={dialogRef}
                className={`common-dialog common-dialog--${dialog.tone}${dialog.audience === 'student' ? ' common-dialog--student' : ''}`}
                role={dialog.tone === 'danger' ? 'alertdialog' : 'dialog'}
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={messageId}
            >
                <div className="common-dialog__content">
                    <h2 id={titleId}>{dialog.title}</h2>
                    <p id={messageId}>{dialog.message}</p>
                </div>
                <footer className="common-dialog__footer">
                    {isConfirm && (
                        <button
                            ref={cancelButtonRef}
                            type="button"
                            className="common-dialog__button common-dialog__button--secondary"
                            onClick={() => onResolve(false)}
                        >
                            {dialog.cancelText}
                        </button>
                    )}
                    <button
                        ref={primaryButtonRef}
                        type="button"
                        className={`common-dialog__button common-dialog__button--${isDanger ? 'danger' : 'primary'}`}
                        onClick={() => onResolve(true)}
                    >
                        {dialog.confirmText}
                    </button>
                </footer>
            </section>
        </div>,
        document.body,
    );
}

const normalizeOptions = (type, options) => {
    const normalizedOptions = typeof options === 'string' ? { message: options } : options;

    return {
        type,
        title: normalizedOptions.title ?? (type === 'confirm' ? '확인해 주세요' : '안내'),
        message: normalizedOptions.message,
        confirmText: normalizedOptions.confirmText ?? '확인',
        cancelText: normalizedOptions.cancelText ?? '취소',
        tone: normalizedOptions.tone ?? 'default',
        audience: normalizedOptions.audience ?? 'teacher',
    };
};

export function DialogProvider({ children }) {
    const [dialogs, setDialogs] = useState([]);
    const nextDialogIdRef = useRef(1);
    const activeDialog = dialogs[0] ?? null;

    const openDialog = useCallback((type, options) => new Promise((resolve) => {
        setDialogs((current) => [
            ...current,
            {
                ...normalizeOptions(type, options),
                id: nextDialogIdRef.current++,
                resolve,
            },
        ]);
    }), []);

    const alert = useCallback((options) => openDialog('alert', options), [openDialog]);
    const confirm = useCallback((options) => openDialog('confirm', options), [openDialog]);

    const resolveActiveDialog = useCallback((result) => {
        if (!activeDialog) return;

        activeDialog.resolve(result);
        setDialogs((current) => (
            current[0] === activeDialog ? current.slice(1) : current
        ));
    }, [activeDialog]);

    const value = useMemo(() => ({ alert, confirm }), [alert, confirm]);

    return (
        <DialogContext.Provider value={value}>
            {children}
            {activeDialog && (
                <DialogModal
                    key={activeDialog.id}
                    dialog={activeDialog}
                    onResolve={resolveActiveDialog}
                />
            )}
        </DialogContext.Provider>
    );
}

export function useDialog() {
    const context = useContext(DialogContext);

    if (!context) {
        throw new Error('useDialog은 DialogProvider 안에서 사용해야 합니다.');
    }

    return context;
}
