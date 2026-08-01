import { useEffect, useState } from 'react';

function ExplanationPanel({ item, onClose, onSave }) {
    const [editing, setEditing] = useState(!item.explanationReady);
    const [explanation, setExplanation] = useState(item.explanation);

    useEffect(() => {
        const closeOnEscape = (event) => { if (event.key === 'Escape') onClose(); };
        document.addEventListener('keydown', closeOnEscape);
        return () => document.removeEventListener('keydown', closeOnEscape);
    }, [onClose]);

    const save = () => {
        if (!explanation.trim()) return;
        onSave(item.id, explanation.trim());
        setEditing(false);
    };

    return (
        <div className="explanation-panel__overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
            <aside className="explanation-panel" role="dialog" aria-modal="true" aria-labelledby="explanation-panel-title">
                <header className="explanation-panel__header"><div><span>{item.no ? `${item.no}번 문항` : '오답 개념'}</span><h2 id="explanation-panel-title">{item.conceptLabel}</h2></div><button type="button" aria-label="해설 패널 닫기" onClick={onClose}><i className="bi bi-x-lg" aria-hidden="true" /></button></header>
                <div className="explanation-panel__body">
                    <section><h3>문제</h3><p className="explanation-panel__prompt">{item.prompt}</p></section>
                    <section><h3>정답</h3><p className="explanation-panel__answer">{item.answer}</p></section>
                    <section><div className="explanation-panel__section-heading"><h3>해설</h3>{!editing && <button type="button" onClick={() => setEditing(true)}><i className="bi bi-pencil" aria-hidden="true" /> 수정</button>}</div>
                        {editing ? <div className="explanation-panel__editor"><textarea aria-label="해설 내용" value={explanation} placeholder="학생이 이해하기 쉬운 해설을 입력해주세요." autoFocus onChange={(event) => setExplanation(event.target.value)} /><div><button type="button" className="wrong-answer-button wrong-answer-button--secondary" onClick={() => { setExplanation(item.explanation); setEditing(false); }}>취소</button><button type="button" className="wrong-answer-button wrong-answer-button--primary" disabled={!explanation.trim()} onClick={save}>저장</button></div></div> : <p className="explanation-panel__explanation">{item.explanation}</p>}
                    </section>
                    <section><h3>관련 개념</h3><div className="explanation-panel__concepts"><span>{item.conceptLabel}</span><span>소인수분해</span></div></section>
                    <section><h3>자주 나온 오답</h3><div className="explanation-panel__wrong-inputs">{item.commonWrongInputs.map((wrong) => <div key={wrong.input}><code>{wrong.input}</code><span>{wrong.count}명</span></div>)}</div></section>
                </div>
            </aside>
        </div>
    );
}

export default ExplanationPanel;

