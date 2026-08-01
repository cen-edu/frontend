import { useEffect, useMemo, useState } from 'react';
import CustomCheckbox from '../../../components/common/CustomCheckbox/CustomCheckbox';
import CustomSelect from '../../../components/common/CustomSelect/CustomSelect';
import StudentFormModal from '../../StudentManagementPage/components/StudentFormModal';
import { wrongAnswerStudents } from '../../../mocks/wrongAnswer';

const timeOptions = [
    { value: '15:00', label: '15:00' },
    { value: '18:00', label: '18:00' },
    { value: '21:00', label: '21:00' },
];

function RadioCard({ checked, name, value, title, description, onChange }) {
    return (
        <label className={`assign-review__radio-card${checked ? ' assign-review__radio-card--checked' : ''}`}>
            <input type="radio" name={name} value={value} checked={checked} onChange={() => onChange(value)} />
            <span className="assign-review__radio" aria-hidden="true" />
            <span><strong>{title}</strong>{description && <small>{description}</small>}</span>
        </label>
    );
}

function AssignReviewModal({ items, initialStudentIds, onClose, onAssign }) {
    const wrongStudentIds = useMemo(() => [...new Set(items.flatMap((item) => item.wrongStudentIds))], [items]);
    const availableStudents = wrongAnswerStudents.filter((student) => wrongStudentIds.includes(student.id));
    const validInitialIds = initialStudentIds.filter((id) => wrongStudentIds.includes(id));
    const [target, setTarget] = useState(validInitialIds.length ? 'selected' : 'all');
    const [selectedStudentIds, setSelectedStudentIds] = useState(validInitialIds);
    const [mode, setMode] = useState('explanation-retry');
    const [dueDate, setDueDate] = useState('2026-08-05');
    const [dueTime, setDueTime] = useState('18:00');

    useEffect(() => {
        if (target === 'selected' && !selectedStudentIds.length && availableStudents.length) setSelectedStudentIds([availableStudents[0].id]);
    }, [availableStudents, selectedStudentIds.length, target]);

    const targetIds = target === 'all' ? wrongStudentIds : selectedStudentIds;
    const itemLabels = items.map((item) => item.no ? `${item.no}번` : item.conceptLabel).join(', ');

    return (
        <StudentFormModal title="오답 학습 배정" closeLabel="오답 학습 배정 닫기" onClose={onClose} width={600}>
            <div className="assign-review">
                <div className="assign-review__items"><span>배정 항목</span><strong>{itemLabels}</strong><em>{items.length}개</em></div>
                <fieldset className="assign-review__section"><legend>대상</legend>
                    <div className="assign-review__options">
                        <RadioCard name="target" value="all" checked={target === 'all'} onChange={setTarget} title={`해당 항목을 틀린 학생 전체 (${wrongStudentIds.length}명)`} description="선택한 항목 중 하나라도 틀린 학생에게 배정해요." />
                        <RadioCard name="target" value="selected" checked={target === 'selected'} onChange={setTarget} title={`선택한 학생만 (${selectedStudentIds.length}명)`} description="배정할 학생을 직접 선택해요." />
                    </div>
                    {target === 'selected' && <div className="assign-review__students" aria-label="배정 학생 선택">{availableStudents.map((student) => {
                        const toggleStudent = () => setSelectedStudentIds((current) => current.includes(student.id) ? current.filter((id) => id !== student.id) : [...current, student.id]);
                        return <div key={student.id} className={selectedStudentIds.includes(student.id) ? 'assign-review__student assign-review__student--selected' : 'assign-review__student'}><CustomCheckbox label={`${student.name} 선택`} checked={selectedStudentIds.includes(student.id)} onChange={toggleStudent} /><button type="button" onClick={toggleStudent}>{student.name}</button></div>;
                    })}</div>}
                </fieldset>
                <fieldset className="assign-review__section"><legend>방식</legend><div className="assign-review__options assign-review__options--columns">
                    <RadioCard name="mode" value="explanation" checked={mode === 'explanation'} onChange={setMode} title="해설만 확인" description="해설을 읽으면 완료돼요." />
                    <RadioCard name="mode" value="explanation-retry" checked={mode === 'explanation-retry'} onChange={setMode} title="해설 확인 + 재시도" description="해설 확인 후 다시 풀어요." />
                </div></fieldset>
                <fieldset className="assign-review__section"><legend>마감</legend><div className="assign-review__deadline"><label><span className="wrong-answer-sr-only">마감 날짜</span><input type="date" value={dueDate} min="2026-08-01" onChange={(event) => setDueDate(event.target.value)} /></label><CustomSelect label="마감 시간" value={dueTime} options={timeOptions} onChange={setDueTime} width={112} /></div></fieldset>
            </div>
            <footer className="student-form-modal__footer"><button type="button" className="student-form-modal__secondary-button" onClick={onClose}>취소</button><button type="button" className="student-form-modal__primary-button" disabled={!targetIds.length} onClick={() => onAssign({ studentIds: targetIds, mode, dueAt: `${dueDate} ${dueTime}` })}>배정하기</button></footer>
        </StudentFormModal>
    );
}

export default AssignReviewModal;
