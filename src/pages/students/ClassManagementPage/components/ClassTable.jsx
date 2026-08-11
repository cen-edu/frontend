import { useRef, useState } from 'react';
import { CustomCheckbox } from '../../../../components/common/inputs';
import { formatClassLabel } from '../classFormConfig';

function ClassTable({ classes, selectedIds, onToggleAll, onToggleClass, onOpenDetail, onMoveClass, onReorderClass }) {
    const [draggedClassId, setDraggedClassId] = useState(null);
    const [dropTarget, setDropTarget] = useState(null);
    const ignoreClickAfterDragRef = useRef(false);
    const isAllSelected = classes.length > 0 && classes.every(({ id }) => selectedIds.includes(id));

    const handleMoveKeyDown = (event, classId) => {
        if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
        event.preventDefault();
        onMoveClass(classId, event.key === 'ArrowUp' ? -1 : 1);
    };

    const handleRowKeyDown = (event, classId) => {
        if (event.target !== event.currentTarget || (event.key !== 'Enter' && event.key !== ' ')) return;
        event.preventDefault();
        onToggleClass(classId);
    };

    const handleDragStart = (event, classId) => {
        ignoreClickAfterDragRef.current = true;
        setDraggedClassId(classId);
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', String(classId));
    };

    const handleDragOver = (event, targetId) => {
        if (draggedClassId === null || draggedClassId === targetId) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        const rowBounds = event.currentTarget.getBoundingClientRect();
        const position = event.clientY < rowBounds.top + rowBounds.height / 2 ? 'before' : 'after';
        setDropTarget({ id: targetId, position });
    };

    const handleDrop = (event, targetId) => {
        event.preventDefault();
        if (draggedClassId !== null && draggedClassId !== targetId) {
            onReorderClass(draggedClassId, targetId, dropTarget?.position ?? 'after');
        }
        setDraggedClassId(null);
        setDropTarget(null);
    };

    const finishDragging = () => {
        setDraggedClassId(null);
        setDropTarget(null);
        window.setTimeout(() => {
            ignoreClickAfterDragRef.current = false;
        }, 0);
    };

    const handleRowClick = (classId) => {
        if (ignoreClickAfterDragRef.current) return;
        onToggleClass(classId);
    };

    return (
        <div className="class-management__table-wrap">
            <table className="class-management__table">
                <thead>
                    <tr>
                        <th>
                            <CustomCheckbox
                                label="반 전체 선택"
                                checked={isAllSelected}
                                onChange={onToggleAll}
                            />
                        </th>
                        <th>순서</th>
                        <th>반 이름</th>
                        <th>반 학생</th>
                        <th>담당 선생님</th>
                        <th>상세</th>
                        <th>이동</th>
                    </tr>
                </thead>
                <tbody>
                    {classes.map((classItem, index) => {
                        const classLabel = formatClassLabel(classItem);
                        const rowClasses = [
                            'class-management__row',
                            selectedIds.includes(classItem.id) && 'class-management__row--selected',
                            draggedClassId === classItem.id && 'class-management__row--dragging',
                            dropTarget?.id === classItem.id && `class-management__row--drop-${dropTarget.position}`,
                        ].filter(Boolean).join(' ');

                        return (
                            <tr
                                key={classItem.id}
                                className={rowClasses}
                                tabIndex={0}
                                draggable
                                aria-selected={selectedIds.includes(classItem.id)}
                                onClick={() => handleRowClick(classItem.id)}
                                onKeyDown={(event) => handleRowKeyDown(event, classItem.id)}
                                onDragStart={(event) => handleDragStart(event, classItem.id)}
                                onDragEnd={finishDragging}
                                onDragOver={(event) => handleDragOver(event, classItem.id)}
                                onDragLeave={(event) => {
                                    if (!event.currentTarget.contains(event.relatedTarget)) setDropTarget(null);
                                }}
                                onDrop={(event) => handleDrop(event, classItem.id)}
                            >
                            <td className="class-management__check-cell">
                                <CustomCheckbox
                                    label={`${classLabel} 선택`}
                                    checked={selectedIds.includes(classItem.id)}
                                    onChange={() => onToggleClass(classItem.id)}
                                />
                            </td>
                            <td>{index + 1}</td>
                            <td className="class-management__name">{classLabel}</td>
                            <td>{classItem.studentSummary}</td>
                            <td>{classItem.teacher}</td>
                            <td>
                                <button
                                    type="button"
                                    className="class-management__detail-button"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        onOpenDetail(classItem);
                                    }}
                                >
                                    상세
                                </button>
                            </td>
                            <td>
                                <button
                                    type="button"
                                    className="class-management__move-button"
                                    aria-label={`${classLabel} 순서 이동, 행을 마우스로 끌거나 위아래 방향키 사용`}
                                    onClick={(event) => event.stopPropagation()}
                                    onKeyDown={(event) => handleMoveKeyDown(event, classItem.id)}
                                >
                                    <i className="bi bi-list" aria-hidden="true" />
                                </button>
                            </td>
                            </tr>
                        );
                    })}
                    {classes.length === 0 && (
                        <tr>
                            <td className="class-management__empty" colSpan="7">검색 결과가 없습니다.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default ClassTable;
