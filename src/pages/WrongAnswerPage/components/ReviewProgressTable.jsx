import { Link } from 'react-router-dom';
import CustomCheckbox from '../../../components/common/CustomCheckbox/CustomCheckbox';
import { reviewStatusLabels } from '../../../mocks/wrongAnswer';

function ReviewProgressTable({ worksheet, selectedIds, remindedIds, onToggle, onToggleAll, onRemind }) {
    const selectable = worksheet.assignments.filter((assignment) => assignment.status !== 'done');
    const allSelected = selectable.length > 0 && selectable.every((assignment) => selectedIds.includes(assignment.studentId));

    return (
        <section className="review-progress" aria-labelledby="review-progress-title">
            <div className="review-progress__heading">
                <div><h3 id="review-progress-title">복습 진행</h3><span>학생별 해설 확인과 재시도 상태를 표시합니다.</span></div>
                <button type="button" className="wrong-answer-button wrong-answer-button--secondary" disabled={!selectedIds.length} onClick={onRemind}><i className="bi bi-bell" aria-hidden="true" /> {selectedIds.length > 0 && selectedIds.every((id) => remindedIds.includes(id)) ? '알림 전송됨' : '알림 보내기'}{selectedIds.length > 0 && <span>{selectedIds.length}</span>}</button>
            </div>
            <div className="review-progress__table-wrap">
                <table className="review-progress__table">
                    <thead><tr><th><CustomCheckbox label="알림 대상 학생 전체 선택" checked={allSelected} onChange={onToggleAll} /></th><th>학생</th><th>배정</th><th>해설 확인</th><th>재시도</th><th>마감</th><th>상태</th></tr></thead>
                    <tbody>
                        {worksheet.assignments.map((assignment) => {
                            const total = assignment.itemNos.length;
                            return <tr key={assignment.studentId}>
                                <td><CustomCheckbox label={`${assignment.name} 알림 대상 선택`} checked={selectedIds.includes(assignment.studentId)} disabled={assignment.status === 'done'} onChange={() => onToggle(assignment.studentId)} /></td>
                                <td><Link className="review-progress__name" to={`/learning/weaknesses/students/${assignment.studentId}?worksheet=${worksheet.id}`}>{assignment.name}</Link></td>
                                <td>{total}개</td><td><b>{assignment.viewed}/{total}</b></td><td>{assignment.mode === 'explanation' ? <span className="review-progress__muted">-</span> : <b>{assignment.retried}/{total}</b>}</td><td>{assignment.dueAt.slice(5).replace('-', '. ')}</td>
                                <td><span className={`review-state review-state--${assignment.status}`}>{reviewStatusLabels[assignment.status]}</span></td>
                            </tr>;
                        })}
                        {!worksheet.assignments.length && <tr><td className="review-progress__empty" colSpan="7"><i className="bi bi-clipboard2-check" aria-hidden="true" /><p>아직 배정된 오답 학습이 없어요.</p></td></tr>}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default ReviewProgressTable;
