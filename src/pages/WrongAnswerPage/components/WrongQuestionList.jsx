import CustomCheckbox from '../../../components/common/CustomCheckbox/CustomCheckbox';

function WrongQuestionList({ worksheet, selectedIds, onToggle, onSelectAll, onOpen, onAssign }) {
    const readyItems = worksheet.wrongItems.filter((item) => item.explanationReady);
    const allSelected = readyItems.length > 0 && readyItems.every((item) => selectedIds.includes(item.id));

    return (
        <section className="wrong-question-list" aria-labelledby="wrong-question-title">
            <div className="wrong-question-list__heading">
                <div><h3 id="wrong-question-title">오답 {worksheet.type === 'assessment' ? '문항' : '개념'}</h3><span>오답자 많은 순</span></div>
                <button type="button" className="wrong-answer-button wrong-answer-button--primary" disabled={!selectedIds.length} onClick={onAssign}><i className="bi bi-send" aria-hidden="true" /> 선택 배정 <span>{selectedIds.length || ''}</span></button>
            </div>
            <div className="wrong-question-list__table-wrap">
                <table className="wrong-question-list__table">
                    <thead><tr><th><CustomCheckbox label="배정 가능한 항목 전체 선택" checked={allSelected} onChange={onSelectAll} /></th><th>{worksheet.type === 'assessment' ? '문항' : '개념'}</th><th>오답 학생</th><th>해설 상태</th><th><span className="wrong-answer-sr-only">해설 보기</span></th></tr></thead>
                    <tbody>{worksheet.wrongItems.map((item) => (
                        <tr key={item.id} className={!item.explanationReady ? 'wrong-question-list__row--warning' : ''}>
                            <td><CustomCheckbox label={`${item.no ? `${item.no}번 ` : ''}${item.conceptLabel} 선택`} checked={selectedIds.includes(item.id)} disabled={!item.explanationReady} onChange={() => onToggle(item.id)} /></td>
                            <td><button type="button" className="wrong-question-list__item-button" onClick={() => onOpen(item)}>{item.no && <b>{item.no}번</b>}<span>{item.conceptLabel}</span></button></td>
                            <td><strong>{item.wrongStudentIds.length}명</strong></td>
                            <td><button type="button" className={`explanation-badge explanation-badge--${item.explanationReady ? 'ready' : 'warning'}`} onClick={() => onOpen(item)}><i className={`bi ${item.explanationReady ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}`} aria-hidden="true" /> {item.explanationReady ? '준비됨' : '검토 필요'}</button></td>
                            <td><button type="button" className="wrong-question-list__open" aria-label={`${item.conceptLabel} 해설 열기`} onClick={() => onOpen(item)}><i className="bi bi-chevron-right" aria-hidden="true" /></button></td>
                        </tr>
                    ))}</tbody>
                </table>
            </div>
        </section>
    );
}

export default WrongQuestionList;

