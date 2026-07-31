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
                    <span className="dashboard-section__kicker">맞춤 학습 연결</span>
                    <h2 id="weak-concepts-title">취약 개념 TOP 3</h2>
                    <p>분석 결과를 확인하고 필요한 문제를 바로 출제하세요.</p>
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
                            <button type="button" className="weak-action-list__create" onClick={() => moveToProblems(concept)}><i className="bi bi-stars" aria-hidden="true" />문제 만들기</button>
                        </div>
                    </li>
                ))}
            </ol>
        </section>
    );
}

export default WeakConceptActions;
