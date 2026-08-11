import { useEffect, useRef, useState } from 'react';
import sennyChatbot from '../../../../assets/images/senny-chatbot.png';
import './ProblemAiEditPanel.scss';

function ProblemAiEditPanel({ target, onClose }) {
    const [prompt, setPrompt] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const textareaRef = useRef(null);

    useEffect(() => {
        setPrompt('');
        setSubmitted(false);
        textareaRef.current?.focus();
    }, [target]);

    useEffect(() => {
        const closeOnEscape = (event) => {
            if (event.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', closeOnEscape);
        return () => document.removeEventListener('keydown', closeOnEscape);
    }, [onClose]);

    if (!target) return null;

    const submit = (event) => {
        event.preventDefault();
        if (!prompt.trim()) return;
        setSubmitted(true);
    };

    return (
        <aside className="problem-ai-edit-panel" aria-labelledby="problem-ai-edit-panel-title">
            <header className="problem-ai-edit-panel__header">
                <img src={sennyChatbot} alt="" />
                <div>
                    <h3 id="problem-ai-edit-panel-title">AI 편집 요청</h3>
                    <p><strong>{target.label}</strong> 영역을 선택했습니다.</p>
                </div>
                <button type="button" className="problem-ai-edit-panel__close" aria-label="AI 편집 요청 창 닫기" onClick={onClose}>
                    <i className="bi bi-x-lg" aria-hidden="true" />
                </button>
            </header>
            <form onSubmit={submit}>
                <label htmlFor="problem-ai-edit-prompt">어떻게 수정할까요?</label>
                <textarea
                    ref={textareaRef}
                    id="problem-ai-edit-prompt"
                    rows={4}
                    value={prompt}
                    placeholder="예) 풀이 과정을 더 작은 단계로 나눠 주세요"
                    onChange={(event) => {
                        setPrompt(event.target.value);
                        setSubmitted(false);
                    }}
                />
                {submitted && <p className="problem-ai-edit-panel__mock-notice" role="status">UI 미리보기입니다. 백엔드 연결 후 선택한 영역에 요청이 적용됩니다.</p>}
                <div className="problem-ai-edit-panel__actions">
                    <button type="button" onClick={onClose}>취소</button>
                    <button type="submit" disabled={!prompt.trim()}>수정 요청</button>
                </div>
            </form>
        </aside>
    );
}

export default ProblemAiEditPanel;
