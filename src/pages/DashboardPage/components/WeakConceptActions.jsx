import { useNavigate } from 'react-router-dom';

function WeakConceptActions({ concepts, worksheetId }) {
    const navigate = useNavigate();

    const moveToProblems = (concept) => {
        const params = new URLSearchParams({ worksheet: worksheetId, concept: concept.label });
        navigate(`/problems/custom?${params.toString()}`);
    };

    return (
        <section className="dashboard-section dashboard-section--weakness" aria-labelledby="weak-concepts-title">
            <div className="dashboard-section__header">
                <div>
                    <h2 id="weak-concepts-title">우선 보완 개념</h2>
                    <p>정답률이 낮은 순서입니다. 개념별 보충 문제를 바로 만들 수 있습니다.</p>
                </div>
            </div>

            <ol className="weak-action-list">
                {concepts.slice(0, 3).map((concept, index) => (
                    <li key={concept.id} className="weak-action-list__item">
                        <span className={`weak-action-list__rank${index === 0 ? ' weak-action-list__rank--first' : ''}`}>{index + 1}</span>
                        <div className="weak-action-list__content">
                            <strong>{concept.label}</strong>
                            <span>정답률 {concept.accuracy}% · 취약 학생 {concept.weakStudents}명</span>
                        </div>
                        <div className="weak-action-list__actions">
                            <button type="button" className="weak-action-list__detail" onClick={() => navigate('/learning/weaknesses')}>상세 보기</button>
                            <button type="button" className="weak-action-list__create" onClick={() => moveToProblems(concept)}>문제 만들기</button>
                        </div>
                    </li>
                ))}
            </ol>
        </section>
    );
}

export default WeakConceptActions;
