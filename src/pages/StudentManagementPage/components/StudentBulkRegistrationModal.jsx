import { useRef, useState } from 'react';
import StudentFormModal from './StudentFormModal';
import './StudentBulkRegistrationModal.scss';

function StudentBulkRegistrationModal({ onClose, onRegister }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    const downloadTemplate = () => {
        const rows = [
            '학생 이름,학년,출결 번호,학생 연락처,학부모 연락처,생년월일,학생 이메일,집 주소,집 전화,특이사항',
            '홍길동,1,0001,010-1234-5678,010-9876-5432,2013.05.10,student@example.com,서울시 예시구,02-123-4567,',
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
                    <h3>1. 등록 양식 내려받기</h3>
                    <p>양식 파일에 학생 정보를 입력합니다.</p>
                    <small>열 이름과 파일 형식을 변경하면 등록할 수 없습니다.</small>
                    <button type="button" className="student-bulk-modal__download-button" onClick={downloadTemplate}>
                        <i className="bi bi-download" aria-hidden="true" />
                        파일 다운로드
                    </button>
                </section>

                <section className="student-bulk-modal__step student-bulk-modal__step--upload">
                    <h3>2. 작성한 파일 첨부</h3>
                    <p>입력을 마친 엑셀 또는 CSV 파일을 선택합니다.</p>
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
                            <span>{selectedFile?.name ?? '선택한 파일 없음'}</span>
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
