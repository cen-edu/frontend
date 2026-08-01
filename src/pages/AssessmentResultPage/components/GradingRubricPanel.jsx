function GradingRubricPanel({ question }) {
    return (
        <aside className="grading-rubric-panel" aria-label="채점 기준">
            <span className="grading-rubric-panel__eyebrow">GRADING GUIDE</span>
            <h2>채점 기준</h2>
            <section><h3>모범답안</h3><p>{question.answer}</p></section>
            <section><h3>배점</h3>{question.rubric.length ? <ul>{question.rubric.map((item) => <li key={item.label}><span>{item.label}</span><strong>{item.score}</strong></li>)}</ul> : <p>정답 일치 시 {question.maxScore}점</p>}</section>
            <div className="grading-rubric-panel__shortcuts"><h3>키보드 단축키</h3><p><kbd>0</kbd>–<kbd>{Math.min(question.maxScore, 9)}</kbd> 점수 입력</p><p><kbd>Enter</kbd> 저장하고 다음</p><p><kbd>←</kbd><kbd>→</kbd> 이전·다음 답안</p></div>
        </aside>
    );
}

export default GradingRubricPanel;
