import { useRef, useState } from 'react';
import StudentFormModal from '../../shared/StudentFormModal';
import './StudentBulkRegistrationModal.scss';

const MAX_CSV_SIZE = 1024 * 1024;

const validateCsvFile = (file) => {
    if (!file) return 'CSV 파일을 선택해 주세요.';
    if (!file.name.toLowerCase().endsWith('.csv')) return 'CSV 파일만 업로드할 수 있습니다.';
    if (file.size > MAX_CSV_SIZE) return 'CSV 파일은 1MB 이하만 업로드할 수 있습니다.';
    return null;
};

function StudentBulkRegistrationModal({
    onClose,
    onRegister,
    onErrorClear,
    isPending = false,
    error = '',
}) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileError, setFileError] = useState('');
    const fileInputRef = useRef(null);

    const downloadTemplate = () => {
        const csv = '\uFEFF학생 이름,학년\r\n홍길동,1\r\n';
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        const downloadUrl = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = downloadUrl;
        anchor.download = '학생_일괄등록_양식.csv';
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        URL.revokeObjectURL(downloadUrl);
    };

    const selectFile = (event) => {
        const file = event.target.files?.[0] ?? null;
        const validationError = validateCsvFile(file);

        setSelectedFile(validationError ? null : file);
        setFileError(validationError ?? '');
        onErrorClear?.();
    };

    const submitFile = (event) => {
        event.preventDefault();

        const validationError = validateCsvFile(selectedFile);
        if (validationError) {
            setFileError(validationError);
            return;
        }

        setFileError('');
        onRegister(selectedFile);
    };

    const displayedError = fileError || error;

    return (
        <StudentFormModal
            title="학생 일괄 등록"
            closeLabel="학생 일괄 등록 창 닫기"
            onClose={onClose}
            width={400}
            closeDisabled={isPending}
        >
            <form className="student-bulk-modal" onSubmit={submitFile}>
                <section className="student-bulk-modal__step">
                    <h3>1. 등록 양식 내려받기</h3>
                    <p>양식 파일에 학생 정보를 입력합니다.</p>
                    <small>열 이름을 변경하지 말고 UTF-8 CSV 형식으로 저장해 주세요.</small>
                    <button type="button" className="student-bulk-modal__download-button" onClick={downloadTemplate}>
                        <i className="bi bi-download" aria-hidden="true" />
                        파일 다운로드
                    </button>
                </section>

                <section className="student-bulk-modal__step student-bulk-modal__step--upload">
                    <h3>2. 작성한 파일 첨부</h3>
                    <p>입력을 마친 CSV 파일을 선택합니다.</p>
                    <small>파일은 1MB 이하, 학생은 최대 500명까지 등록할 수 있습니다.</small>
                    <input
                        ref={fileInputRef}
                        className="student-bulk-modal__file-input"
                        type="file"
                        accept=".csv,text/csv"
                        aria-label="학생 일괄 등록 파일 선택"
                        disabled={isPending}
                        onChange={selectFile}
                    />
                    <div className="student-bulk-modal__upload-row">
                        <div className={`student-bulk-modal__filename${selectedFile ? ' student-bulk-modal__filename--selected' : ''}`}>
                            <i className="bi bi-file-earmark-spreadsheet" aria-hidden="true" />
                            <span>{selectedFile?.name ?? '선택한 파일 없음'}</span>
                        </div>
                        <button
                            type="button"
                            className="student-bulk-modal__attach-button"
                            disabled={isPending}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            파일첨부
                        </button>
                    </div>
                    {displayedError && (
                        <p className="student-bulk-modal__error" role="alert">
                            {displayedError}
                        </p>
                    )}
                </section>

                <footer className="student-bulk-modal__footer">
                    <button type="submit" disabled={!selectedFile || isPending}>
                        {isPending ? '등록 중...' : '등록하기'}
                    </button>
                </footer>
            </form>
        </StudentFormModal>
    );
}

export default StudentBulkRegistrationModal;
