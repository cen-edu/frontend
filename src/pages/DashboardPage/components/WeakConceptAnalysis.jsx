import { useNavigate } from 'react-router-dom';

function WeakConceptAnalysis({ concepts, classId }) {
    const navigate = useNavigate();

    const createProblem = (concept) => {
        const params = new URLSearchParams({ class: classId, concept: concept.name });
        navigate(`/problems/custom?${params.toString()}`);
    };

    return (
        <section className="dashboard-panel dashboard-panel--weak" aria-labelledby="weak-concept-title">
            <div className="dashboard-panel__header">
                <div>
                    <h2 id="weak-concept-title">취약 개념 분석</h2>
                    <p>정답률이 낮은 개념부터 확인하고 맞춤 문제를 만들어 보세요.</p>
                </div>
                <span className="dashboard-panel__badge">최근 30일</span>
            </div>

            <ol className="weak-concept-list">
                {concepts.map((concept, index) => (
                    <li key={concept.id} className="weak-concept-list__item">
                        <span className={`weak-concept-list__rank${index === 0 ? ' weak-concept-list__rank--first' : ''}`}>{index + 1}</span>
                        <div className="weak-concept-list__content">
                            <div className="weak-concept-list__title-row">
                                <strong>{concept.name}</strong>
                                <span>{concept.unit}</span>
                            </div>
                            <div className="weak-concept-list__metrics">
                                <div className="weak-concept-list__progress" aria-label={`${concept.name} 정답률 ${concept.accuracy}%`}>
                                    <span style={{ width: `${concept.accuracy}%` }} />
                                </div>
                                <b>{concept.accuracy}%</b>
                                <span>취약 학생 {concept.weakStudents}명</span>
                            </div>
                        </div>
                        <button type="button" className="weak-concept-list__button" onClick={() => createProblem(concept)}>
                            <i className="bi bi-stars" aria-hidden="true" />
                            이 개념으로 문제 만들기
                        </button>
                    </li>
                ))}
            </ol>
        </section>
    );
}

export default WeakConceptAnalysis;
