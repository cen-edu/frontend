import { formatLabels } from '../../../mocks/assessmentCreation';
import { difficultyLabels } from '../../../mocks/problemCreation';

function AssessmentPreviewList({ problems, selectedId, onSelect }) {
    return (
        <div className="assessment-preview-list" aria-label="생성된 평가 문항 목록">
            {problems.map((problem) => (
                <button
                    type="button"
                    key={problem.id}
                    className={`assessment-preview-list__item${selectedId === problem.id ? ' assessment-preview-list__item--selected' : ''}`}
                    aria-pressed={selectedId === problem.id}
                    onClick={() => onSelect(problem.id)}
                >
                    <span className="assessment-preview-list__top">
                        <strong>{problem.no}번</strong>
                        <span className="assessment-preview-list__badges">
                            <span className="assessment-format-badge">{formatLabels[problem.format]}</span>
                            <span className={`assessment-difficulty-badge assessment-difficulty-badge--${problem.difficulty}`}>{difficultyLabels[problem.difficulty]}</span>
                            <span>{problem.maxScore}점</span>
                        </span>
                    </span>
                    <span className="assessment-preview-list__prompt">{problem.prompt}</span>
                    <span className="assessment-preview-list__unit">{problem.unitName}</span>
                </button>
            ))}
        </div>
    );
}

export default AssessmentPreviewList;
