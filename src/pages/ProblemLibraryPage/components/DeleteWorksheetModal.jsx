import StudentFormModal from '../../StudentManagementPage/components/StudentFormModal';

function DeleteWorksheetModal({ worksheet, onClose, onConfirm }) {
    return <StudentFormModal title="학습지 삭제" closeLabel="삭제 확인 창 닫기" onClose={onClose} width={480}><div className="library-modal__confirm"><p><strong>{worksheet.title}</strong>을 삭제하시겠습니까?</p><span>삭제한 학습지는 다시 복구할 수 없습니다.</span></div><footer className="student-form-modal__footer"><button type="button" className="student-form-modal__secondary-button" onClick={onClose}>취소</button><button type="button" className="library-modal__danger-button" onClick={onConfirm}>삭제</button></footer></StudentFormModal>;
}

export default DeleteWorksheetModal;
