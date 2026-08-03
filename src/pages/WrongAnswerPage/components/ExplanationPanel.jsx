import { useEffect, useState } from 'react';

function ExplanationPanel({ item, onClose, onSave }) {
    const [editing, setEditing] = useState(item.solutionStatus === 'needs-review');
    const [teacherNote, setTeacherNote] = useState(item.teacherNote);

    useEffect(() => {
        const closeOnEscape = (event) => { if (event.key === 'Escape') onClose(); };
        document.addEventListener('keydown', closeOnEscape);
        return () => document.removeEventListener('keydown', closeOnEscape);
    }, [onClose]);

    const save = () => {
        if (!teacherNote.trim()) return;
        onSave(item.id, teacherNote.trim());
        setEditing(false);
    };

    const answers = item.steps.flatMap((step) => step.segments.filter((segment) => segment.type === 'blank').map((segment) => segment.answer));

    return (
        <div className="explanation-panel__overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
            <aside className="explanation-panel" role="dialog" aria-modal="true" aria-labelledby="explanation-panel-title">
                <header className="explanation-panel__header"><div><span>{item.no ? `${item.no}번 문항` : '오답 개념'}</span><h2 id="explanation-panel-title">{item.conceptLabel}</h2></div><button type="button" aria-label="해설 패널 닫기" onClick={onClose}><i className="bi bi-x-lg" aria-hidden="true" /></button></header>
                <div className="explanation-panel__body">
                    <section><h3>문제</h3><p className="explanation-panel__prompt">{item.prompt}</p></section>
                    <section><h3>정답</h3><p className="explanation-panel__answer">{answers.join(' · ')}</p></section>
                    <section><h3>내장 풀이 단계</h3><ol className="explanation-panel__explanation">{item.steps.map((step, index) => <li key={step.id}><strong>{index + 1}단계</strong> {step.segments.map((segment) => segment.type === 'text' ? segment.value : `[${segment.answer}]`).join('')}</li>)}</ol></section>
                    <section><div className="explanation-panel__section-heading"><h3>교사 보완 메모</h3>{!editing && <button type="button" onClick={() => setEditing(true)}><i className="bi bi-pencil" aria-hidden="true" /> {item.teacherNote ? '수정' : '추가'}</button>}</div>
                        {editing ? <div className="explanation-panel__editor"><textarea aria-label="교사 보완 메모" value={teacherNote} placeholder="내장 풀이에 덧붙일 설명을 입력해주세요." autoFocus onChange={(event) => setTeacherNote(event.target.value)} /><div><button type="button" className="wrong-answer-button wrong-answer-button--secondary" onClick={() => { setTeacherNote(item.teacherNote); setEditing(false); }}>취소</button><button type="button" className="wrong-answer-button wrong-answer-button--primary" disabled={!teacherNote.trim()} onClick={save}>저장</button></div></div> : <p className="explanation-panel__explanation">{item.teacherNote || '등록된 보완 메모가 없습니다.'}</p>}
                    </section>
                    <section><h3>관련 개념</h3><div className="explanation-panel__concepts"><span>{item.conceptLabel}</span><span>소인수분해</span></div></section>
                    <section><h3>자주 나온 오답</h3><div className="explanation-panel__wrong-inputs">{item.commonWrongInputs.map((wrong) => <div key={wrong.input}><code>{wrong.input}</code><span>{wrong.count}명</span></div>)}</div></section>
                </div>
            </aside>
        </div>
    );
}

export default ExplanationPanel;
