import { useLayoutEffect, useRef, useState } from 'react';
import { revisionPresets } from '../../../mocks/problemRevision';

function ProblemRevisePanel({ problem, requests, onAddRequest, onRemoveRequest }) {
    const [prompt, setPrompt] = useState('');
    const inputRef = useRef(null);

    useLayoutEffect(() => {
        const input = inputRef.current;
        if (!input) return;

        input.style.height = '38px';
        if (prompt) input.style.height = `${Math.max(38, input.scrollHeight + 2)}px`;
    }, [prompt]);

    const submit = (event) => {
        event.preventDefault();
        if (!problem || !prompt.trim()) return;
        onAddRequest(prompt.trim());
        setPrompt('');
    };

    const applyPreset = (preset) => {
        setPrompt(preset);
        inputRef.current?.focus();
    };

    return (
        <section className="problem-revise" aria-labelledby="problem-revise-title">
            <header className="problem-revise__header">
                <div>
                    <h3 id="problem-revise-title"><i className="bi bi-stars" aria-hidden="true" />문제 수정 요청</h3>
                    <p>{problem ? `${problem.no}번 문항을 어떻게 바꿀지 문장으로 작성합니다.` : '수정할 문항을 목록에서 선택해 주세요.'}</p>
                </div>
                {requests.length > 0 && <span className="problem-revise__count">요청 {requests.length}건</span>}
            </header>
            <div className="problem-revise__presets" role="group" aria-label="자주 쓰는 수정 요청">
                {revisionPresets.map((preset) => <button type="button" key={preset} disabled={!problem} onClick={() => applyPreset(preset)}>{preset}</button>)}
            </div>
            <form className="problem-revise__form" onSubmit={submit}>
                <textarea
                    ref={inputRef}
                    rows={1}
                    value={prompt}
                    disabled={!problem}
                    aria-label="문제 수정 요청 입력"
                    placeholder="예) 난이도를 한 단계 낮추고 풀이 단계를 더 나눠 주세요"
                    onChange={(event) => setPrompt(event.target.value)}
                />
                <button type="submit" className="problem-creation-button problem-creation-button--primary" disabled={!problem || !prompt.trim()}>요청 추가</button>
            </form>
            <p className="problem-revise__notice">
                <i className="bi bi-info-circle" aria-hidden="true" />
                AI 연동 전 화면입니다. 지금은 요청 내용만 문항별로 기록하고, 연동 후 이 영역에서 수정 결과를 확인합니다.
            </p>
            {requests.length > 0 && (
                <ol className="problem-revise__requests" aria-label={`${problem.no}번 문항 수정 요청 목록`}>
                    {requests.map((request, index) => (
                        <li key={request.id}>
                            <span>{index + 1}</span>
                            <p>{request.prompt}</p>
                            <button type="button" aria-label={`${index + 1}번째 수정 요청 삭제`} onClick={() => onRemoveRequest(request.id)}><i className="bi bi-x-lg" aria-hidden="true" /></button>
                        </li>
                    ))}
                </ol>
            )}
        </section>
    );
}

export default ProblemRevisePanel;
