import './PracticeConceptView.scss';

function PracticeConceptView({ concept, headingId = 'concept-title' }) {
    if (!concept) return null;

    return (
        <aside className="practice-concept-view" aria-labelledby={headingId}>
            <span className="practice-concept-view__label">개념 설명</span>
            <h2 id={headingId}>{concept.title}</h2>
            <p>{concept.summary}</p>
            <ul>
                {concept.points.map((point) => <li key={point}>{point}</li>)}
            </ul>
            {concept.example && (
                <div className="practice-concept-view__example">
                    <span>예시</span>
                    <strong>{concept.example}</strong>
                </div>
            )}
        </aside>
    );
}

export default PracticeConceptView;
