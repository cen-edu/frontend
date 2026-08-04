import { useNavigate } from 'react-router-dom';
import { weakAccuracyThreshold } from '../../../mocks/teacherDashboard';

function WeakConceptActions({ concepts, customWorksheetId }) {
    const navigate = useNavigate();

    // CustomProblemPage는 worksheet / concept(conceptId) / students 세 가지만 읽는다.
    const createProblems = (concept) => {
        const params = new URLSearchParams({ worksheet: customWorksheetId, concept: concept.id });
        if (concept.weakStudentIds.length > 0) params.set('students', concept.weakStudentIds.join(','));
        navigate(`/problems/custom?${params.toString()}`);
    };

    return (
        <section className="dashboard-section" aria-labelledby="weak-concepts-title">
            <div className="dashboard-section__header">
                <div>
                    <h2 id="weak-concepts-title">우선 보완 개념</h2>
                    <p>학기 누적 정답률이 낮은 순서입니다.</p>
                </div>
            </div>

            {concepts.length === 0
                ? <p className="dashboard-empty">개념별 정답률을 낼 만큼 응답이 모이지 않았습니다.</p>
                : <ol className="weak-concept-list">
                    {concepts.slice(0, 3).map((concept, index) => (
                        <li key={concept.id} className="weak-concept-list__item">
                            <span className={`weak-concept-list__rank${index === 0 ? ' weak-concept-list__rank--first' : ''}`}>{index + 1}</span>

                            <div className="weak-concept-list__content">
                                <strong>{concept.label}</strong>
                                <span>정답률 {concept.accuracy}% · 취약 학생 {concept.weakStudentIds.length}명</span>
                                <span className="weak-concept-list__track"><span className="weak-concept-list__bar" style={{ width: `${concept.accuracy}%` }} /></span>
                            </div>

                            {customWorksheetId && (
                                <button type="button" className="weak-concept-list__create" onClick={() => createProblems(concept)}>
                                    문제 만들기
                                </button>
                            )}
                        </li>
                    ))}
                </ol>}

            <p className="weak-concept-list__note">정답률 {weakAccuracyThreshold}% 미만 학생을 취약 학생으로 집계합니다.</p>
        </section>
    );
}

export default WeakConceptActions;
