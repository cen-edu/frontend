function WeaknessSummaryCard({ student, configs, reason }) {
    return <section className="weakness-summary" aria-labelledby="weakness-summary-title">
        <header><div><h2 id="weakness-summary-title">{student.name} 학생의 제안 근거</h2><p>틀린 풀이 단계와 실제 입력을 기준으로 구성했습니다.</p></div><span>{configs.length}개 개념</span></header>
        {configs.length === 0 ? <p className="weakness-summary__empty">{reason}</p> : <div className="weakness-summary__items">{configs.map((config) => <article key={config.conceptId}>
            <div><strong>{config.conceptLabel}</strong><span>원본 {config.sourceQuestionNos.map((no) => `${no}번`).join(', ')}</span></div>
            <ul>{config.incorrectSteps.map((item, index) => <li key={`${item.questionNo}-${item.stepOrder}-${index}`}><span>{item.questionNo}번 · {item.label}</span><em>입력: {item.input || '미입력'}</em></li>)}</ul>
        </article>)}</div>}
    </section>;
}

export default WeaknessSummaryCard;
