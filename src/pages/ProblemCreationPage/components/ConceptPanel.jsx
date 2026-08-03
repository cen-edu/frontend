function ConceptPanel({ problem }) {
    if (!problem) return <aside className="concept-panel concept-panel--empty">문제를 선택하면 관련 개념이 표시됩니다.</aside>;
    return (
        <aside className="concept-panel" aria-labelledby="concept-panel-title">
            <span className="concept-panel__label">관련 개념</span>
            <h3 id="concept-panel-title">{problem.concept.title}</h3>
            <p>{problem.concept.summary}</p>
            <h4>핵심 포인트</h4>
            <ul>{problem.concept.points.map((point) => <li key={point}>{point}</li>)}</ul>
            <div className="concept-panel__path"><span>단원 경로</span>{problem.unitPath}</div>
        </aside>
    );
}

export default ConceptPanel;
