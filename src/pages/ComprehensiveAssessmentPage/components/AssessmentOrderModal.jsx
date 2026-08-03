import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { formatLabels } from '../../../mocks/assessmentCreation';
import { difficultyLabels } from '../../../mocks/problemCreation';
import './AssessmentOrderModal.scss';

function AssessmentOrderModal({ problems, onClose, onApply }) {
    const [orderedProblems, setOrderedProblems] = useState(() => [...problems]);
    const [announcement, setAnnouncement] = useState('');
    const [draggedId, setDraggedId] = useState('');
    const [dragOverId, setDragOverId] = useState('');
    const titleId = useId();
    const closeButtonRef = useRef(null);

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        closeButtonRef.current?.focus();

        const closeOnEscape = (event) => {
            if (event.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', closeOnEscape);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', closeOnEscape);
        };
    }, [onClose]);

    const moveProblem = (index, direction) => {
        const nextIndex = index + direction;
        if (nextIndex < 0 || nextIndex >= orderedProblems.length) return;

        setOrderedProblems((current) => {
            const next = [...current];
            [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
            return next;
        });
        setAnnouncement(`${index + 1}번 문항을 ${nextIndex + 1}번 위치로 이동했습니다.`);
    };

    const moveDraggedProblem = (targetId) => {
        if (!draggedId || draggedId === targetId) return;

        setOrderedProblems((current) => {
            const fromIndex = current.findIndex((problem) => problem.id === draggedId);
            const targetIndex = current.findIndex((problem) => problem.id === targetId);
            if (fromIndex < 0 || targetIndex < 0) return current;

            const next = [...current];
            const [draggedProblem] = next.splice(fromIndex, 1);
            next.splice(targetIndex, 0, draggedProblem);
            return next;
        });
        setDragOverId(targetId);
    };

    return createPortal(
        <div className="assessment-order-modal__overlay" onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
        }}>
            <section className="assessment-order-modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
                <header className="assessment-order-modal__header">
                    <div>
                        <h2 id={titleId}>문항 순서 변경</h2>
                        <p>문항을 드래그해 순서를 조정합니다. 키보드에서는 Alt와 위·아래 방향키를 함께 누릅니다.</p>
                    </div>
                    <button ref={closeButtonRef} type="button" aria-label="문항 순서 변경 닫기" onClick={onClose}>
                        <i className="bi bi-x-lg" aria-hidden="true" />
                    </button>
                </header>

                <div className="assessment-order-modal__list" aria-label="문항 순서">
                    {orderedProblems.map((problem, index) => (
                        <article
                            className={`assessment-order-modal__item${draggedId === problem.id ? ' assessment-order-modal__item--dragging' : ''}${dragOverId === problem.id ? ' assessment-order-modal__item--drag-over' : ''}`}
                            key={problem.id}
                            draggable
                            tabIndex={0}
                            aria-label={`${index + 1}번 문항, 드래그하여 순서 변경`}
                            onDragStart={(event) => {
                                setDraggedId(problem.id);
                                event.dataTransfer.effectAllowed = 'move';
                                event.dataTransfer.setData('text/plain', problem.id);
                            }}
                            onDragEnter={() => moveDraggedProblem(problem.id)}
                            onDragOver={(event) => {
                                event.preventDefault();
                                event.dataTransfer.dropEffect = 'move';
                            }}
                            onDrop={(event) => {
                                event.preventDefault();
                                setAnnouncement('문항 순서를 변경했습니다.');
                                setDraggedId('');
                                setDragOverId('');
                            }}
                            onDragEnd={() => {
                                setDraggedId('');
                                setDragOverId('');
                            }}
                            onKeyDown={(event) => {
                                if (!event.altKey || !['ArrowUp', 'ArrowDown'].includes(event.key)) return;
                                event.preventDefault();
                                moveProblem(index, event.key === 'ArrowUp' ? -1 : 1);
                            }}
                        >
                            <strong className="assessment-order-modal__number">{index + 1}</strong>
                            <div className="assessment-order-modal__content">
                                <div>
                                    <span className="assessment-format-badge">{formatLabels[problem.format]}</span>
                                    <span className={`assessment-difficulty-badge assessment-difficulty-badge--${problem.difficulty}`}>{difficultyLabels[problem.difficulty]}</span>
                                    <span>{problem.unitName}</span>
                                </div>
                                <p>{problem.prompt}</p>
                            </div>
                        </article>
                    ))}
                </div>

                <p className="assessment-order-modal__announcement" aria-live="polite">{announcement}</p>
                <footer className="assessment-order-modal__footer">
                    <button type="button" className="assessment-button assessment-button--secondary" onClick={onClose}>취소</button>
                    <button type="button" className="assessment-button assessment-button--primary" onClick={() => onApply(orderedProblems)}>순서 적용</button>
                </footer>
            </section>
        </div>,
        document.body,
    );
}

export default AssessmentOrderModal;
