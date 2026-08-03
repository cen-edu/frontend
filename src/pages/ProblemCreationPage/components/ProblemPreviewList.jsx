import { difficultyLabels } from '../../../mocks/problemCreation';

function ProblemPreviewList({ problems, selectedId, onSelect }) {
    return (
        <nav className="problem-preview-list" aria-label="생성된 문제 목록">
            {problems.map((problem) => (
                <button
                    type="button"
                    key={problem.id}
                    className={`problem-preview-list__item${selectedId === problem.id ? ' problem-preview-list__item--selected' : ''}`}
                    aria-current={selectedId === problem.id ? 'true' : undefined}
                    onClick={() => onSelect(problem.id)}
                >
                    <span className="problem-preview-list__top"><strong>{problem.no}번</strong><span className={`difficulty-badge difficulty-badge--${problem.difficulty}`}>{difficultyLabels[problem.difficulty]}</span></span>
                    <span className="problem-preview-list__prompt">{problem.prompt}</span>
                    <span className="problem-preview-list__unit">{problem.unitName}</span>
                </button>
            ))}
        </nav>
    );
}

export default ProblemPreviewList;
