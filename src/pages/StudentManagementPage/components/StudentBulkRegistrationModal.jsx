import { useRef, useState } from 'react';
import StudentFormModal from './StudentFormModal';
import './StudentBulkRegistrationModal.scss';

function StudentBulkRegistrationModal({ onClose, onRegister }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    const downloadTemplate = () => {
        const rows = [
            '학생 이름,학년,출결 번호,학생 연락처,학부모 연락처,학교,수업 시작일,생년월일,학생 이메일,집 주소,집 전화,특이사항',
            '홍길동,중1,0001,010-1234-5678,010-9876-5432,예시중학교,2026.03.02,2013.05.10,student@example.com,서울시 예시구,02-123-4567,',
        ];
        const blob = new Blob([`\uFEFF${rows.join('\n')}`], { type: 'text/csv;charset=utf-8' });
        const downloadUrl = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = downloadUrl;
        anchor.download = '학생_일괄등록_양식.csv';
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        URL.revokeObjectURL(downloadUrl);
    };

    return (
        <StudentFormModal title="학생 일괄 등록" closeLabel="학생 일괄 등록 창 닫기" onClose={onClose} width={400}>
            <form className="student-bulk-modal" onSubmit={(event) => {
                event.preventDefault();
                if (selectedFile) onRegister(selectedFile);
            }}>
                <section className="student-bulk-modal__step">
                    <strong>STEP 01</strong>
                    <p>양식 파일을 다운로드하여 학생 정보를 입력해주세요.</p>
                    <small>(내용 형식을 수정할 경우 등록이 불가능합니다.)</small>
                    <button type="button" className="student-bulk-modal__download-button" onClick={downloadTemplate}>
                        <i className="bi bi-download" aria-hidden="true" />
                        파일 다운로드
                    </button>
                </section>

                <section className="student-bulk-modal__step student-bulk-modal__step--upload">
                    <strong>STEP 02</strong>
                    <p>내용 입력된 엑셀 또는 CSV 파일을 첨부해 주세요.</p>
                    <input
                        ref={fileInputRef}
                        className="student-bulk-modal__file-input"
                        type="file"
                        accept=".xlsx,.xls,.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
                        aria-label="학생 일괄 등록 파일 선택"
                        onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
                    />
                    <div className="student-bulk-modal__upload-row">
                        <div className={`student-bulk-modal__filename${selectedFile ? ' student-bulk-modal__filename--selected' : ''}`}>
                            <i className="bi bi-file-earmark-spreadsheet" aria-hidden="true" />
                            <span>{selectedFile?.name ?? '엑셀 파일을 업로드하세요.'}</span>
                        </div>
                        <button type="button" className="student-bulk-modal__attach-button" onClick={() => fileInputRef.current?.click()}>
                            파일첨부
                        </button>
                    </div>
                </section>

                <footer className="student-bulk-modal__footer">
                    <button type="submit" disabled={!selectedFile}>등록하기</button>
                </footer>
            </form>
        </StudentFormModal>
    );
}

export default StudentBulkRegistrationModal;
