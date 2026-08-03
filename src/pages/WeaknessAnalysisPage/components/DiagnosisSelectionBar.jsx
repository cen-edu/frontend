function DiagnosisSelectionBar({ selectedStudents }) {
    if (!selectedStudents.length) return null;

    return <div className="diagnosis-selection-bar" role="status"><strong>{selectedStudents.length}명 선택됨</strong><div><button type="button" className="diagnosis-button diagnosis-button--primary">맞춤 문제 출제 <i className="bi bi-arrow-right" /></button></div></div>;
}
export default DiagnosisSelectionBar;
