import CustomCheckbox from '../../../components/common/CustomCheckbox/CustomCheckbox';
import { isWrongItemAssignable } from '../../../mocks/wrongAnswer';

function WrongQuestionList({ worksheet, selectedIds, onToggle, onSelectAll, onOpen, onAssign }) {
    const readyItems = worksheet.wrongItems.filter(isWrongItemAssignable);
    const allSelected = readyItems.length > 0 && readyItems.every((item) => selectedIds.includes(item.id));

    const handleRowClick = (event, item) => {
        if (!isWrongItemAssignable(item) || event.target.closest('button, input, a, label')) return;
        onToggle(item.id);
    };

    const handleRowKeyDown = (event, item) => {
        if (!isWrongItemAssignable(item) || event.target !== event.currentTarget || !['Enter', ' '].includes(event.key)) return;
        event.preventDefault();
        onToggle(item.id);
    };

    return (
        <section className="wrong-question-list" aria-labelledby="wrong-question-title">
            <div className="wrong-question-list__heading">
                <div><h3 id="wrong-question-title">오답 {worksheet.type === 'assessment' ? '문항' : '개념'}</h3><span>오답자 많은 순</span></div>
                <button type="button" className="wrong-answer-button wrong-answer-button--primary" disabled={!selectedIds.length} onClick={onAssign}>선택 배정 <span>{selectedIds.length || ''}</span></button>
            </div>
            <div className="wrong-question-list__table-wrap">
                <table className="wrong-question-list__table">
                    <thead><tr><th><CustomCheckbox label="배정 가능한 항목 전체 선택" checked={allSelected} onChange={onSelectAll} /></th><th>{worksheet.type === 'assessment' ? '문항' : '개념'}</th><th>오답 학생</th><th>풀이 상태</th><th><span className="wrong-answer-sr-only">풀이 보기</span></th></tr></thead>
                    <tbody>{worksheet.wrongItems.map((item) => { const assignable = isWrongItemAssignable(item); return (
                        <tr
                            key={item.id}
                            className={`wrong-question-list__row${selectedIds.includes(item.id) ? ' wrong-question-list__row--selected' : ''}${!assignable ? ' wrong-question-list__row--warning' : ''}`}
                            tabIndex={assignable ? 0 : undefined}
                            aria-selected={assignable ? selectedIds.includes(item.id) : undefined}
                            aria-disabled={!assignable || undefined}
                            onClick={(event) => handleRowClick(event, item)}
                            onKeyDown={(event) => handleRowKeyDown(event, item)}
                        >
                            <td><CustomCheckbox label={`${item.no ? `${item.no}번 ` : ''}${item.conceptLabel} 선택`} checked={selectedIds.includes(item.id)} disabled={!assignable} onChange={() => onToggle(item.id)} /></td>
                            <td><button type="button" className="wrong-question-list__item-button" onClick={() => onOpen(item)}>{item.no && <b>{item.no}번</b>}<span>{item.conceptLabel}</span></button></td>
                            <td><strong>{item.wrongStudentIds.length}명</strong></td>
                            <td><button type="button" className={`explanation-badge explanation-badge--${assignable ? 'ready' : 'warning'}`} onClick={() => onOpen(item)}>{item.solutionStatus === 'embedded' ? '내장 풀이' : assignable ? '검토 완료' : '검토 필요'}</button></td>
                            <td><button type="button" className="wrong-question-list__open" aria-label={`${item.conceptLabel} 풀이 열기`} onClick={() => onOpen(item)}><i className="bi bi-chevron-right" aria-hidden="true" /></button></td>
                        </tr>
                    ); })}</tbody>
                </table>
            </div>
        </section>
    );
}

export default WrongQuestionList;
