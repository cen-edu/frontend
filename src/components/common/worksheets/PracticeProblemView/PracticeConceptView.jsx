import MathText from '../MathText/MathText';
import './PracticeConceptView.scss';

function PracticeConceptView({ concept, headingId = 'concept-title', editMode = false, selected = false, onSelect }) {
    if (!concept) return null;

    return (
        <aside className={`practice-concept-view${editMode ? ' practice-concept-view--edit-mode' : ''}${selected ? ' practice-concept-view--selected' : ''}`} aria-labelledby={headingId}>
            {editMode && (
                <button type="button" className="practice-concept-view__select-button" aria-pressed={selected} onClick={onSelect}>
                    <i className="bi bi-pencil-square" aria-hidden="true" /> 개념 설명 선택
                </button>
            )}
            <span className="practice-concept-view__label">개념 설명</span>
            <h2 id={headingId}><MathText>{concept.title}</MathText></h2>
            <p><MathText>{concept.summary}</MathText></p>
            <ul>
                {concept.points.map((point) => <li key={point}><MathText>{point}</MathText></li>)}
            </ul>
            {concept.example && (
                <div className="practice-concept-view__example">
                    <span>예시</span>
                    <strong><MathText>{concept.example}</MathText></strong>
                </div>
            )}
        </aside>
    );
}

export default PracticeConceptView;
