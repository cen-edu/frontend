import { useState } from 'react';
import StudentFormModal from '../../StudentManagementPage/components/StudentFormModal';
import CustomSelect from '../../../components/common/CustomSelect/CustomSelect';
import classes from '../../../mocks/classes';

const classOptions = classes.map((item) => ({ value: `middle-${item.grade}-${item.id}`, label: `${item.year}학년도 ${item.grade}학년 ${item.name}` }));

function AssignWorksheetModal({ worksheet, onClose, onAssign }) {
    const [classId, setClassId] = useState(classOptions[0]?.value ?? '');
    const [dueAt, setDueAt] = useState('2026-08-10T18:00');
    const selectedClass = classOptions.find((item) => item.value === classId);
    return <StudentFormModal title="학습지 출제" closeLabel="출제 창 닫기" onClose={onClose} width={560}>
        <div className="library-modal__content"><p><strong>{worksheet.title}</strong>을 출제할 반과 기한을 선택합니다.</p><label><span>반</span><CustomSelect label="출제할 반 선택" value={classId} options={classOptions} onChange={setClassId} width="100%" /></label><label><span>제출 기한</span><input type="datetime-local" value={dueAt} onChange={(event) => setDueAt(event.target.value)} /></label></div>
        <footer className="student-form-modal__footer"><button type="button" className="student-form-modal__secondary-button" onClick={onClose}>취소</button><button type="button" className="student-form-modal__primary-button" disabled={!classId || !dueAt} onClick={() => onAssign({ classId, className: selectedClass.label, dueAt: dueAt.replace('T', ' ') })}>출제</button></footer>
    </StudentFormModal>;
}

export default AssignWorksheetModal;
