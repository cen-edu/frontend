import { useNavigate } from 'react-router-dom';

function DiagnosisSelectionBar({ selectedStudents, worksheetId, conceptId }) {
    const navigate = useNavigate();
    if (!selectedStudents.length) return null;

    const assignWrongAnswers = () => {
        const params = new URLSearchParams({
            worksheet: worksheetId,
            students: selectedStudents.map((student) => student.id).join(','),
        });
        if (conceptId) params.set('concept', conceptId);
        navigate(`/learning/wrong-answers?${params.toString()}`);
    };

    return <div className="diagnosis-selection-bar" role="status"><strong>{selectedStudents.length}명 선택됨</strong><div><button type="button" className="diagnosis-button diagnosis-button--secondary" onClick={assignWrongAnswers}>오답 학습 배정</button><button type="button" className="diagnosis-button diagnosis-button--primary">맞춤 문제 출제 <i className="bi bi-arrow-right" /></button></div></div>;
}
export default DiagnosisSelectionBar;
