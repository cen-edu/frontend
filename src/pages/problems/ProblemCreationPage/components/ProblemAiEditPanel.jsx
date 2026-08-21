import { useEffect, useRef, useState } from 'react';
import sennyChatbot from '../../../../assets/images/senny-chatbot.png';
import { useProblemEditMutation } from '../../problemEditHooks.js';
import './ProblemAiEditPanel.scss';

const actionNotices = {
    CONTINUE_COLLECTION: '추가 대화가 필요한 요청입니다. 현재는 첫 요청 한 턴만 연결되어 있어 적용할 수 없습니다.',
    REQUEST_CONFIRMATION: '변경 제안이 생성되었습니다. 명시적인 확인 API가 제공되기 전까지 화면에서 확정 적용하지 않습니다.',
    CANCEL: '수정 요청이 취소되었습니다.',
};

function ProblemAiEditPanel({ currentProblem, target, onProblemUpdated, onClose }) {
    const [prompt, setPrompt] = useState('');
    const textareaRef = useRef(null);
    const appliedProblemRef = useRef(null);
    const editMutation = useProblemEditMutation();
    const turn = editMutation.data?.turn;

    useEffect(() => {
        setPrompt('');
        editMutation.reset();
        textareaRef.current?.focus();
    }, [target?.type, target?.id]);

    useEffect(() => {
        const editedProblem = editMutation.data?.problem;

        if (editedProblem && appliedProblemRef.current !== editedProblem) {
            appliedProblemRef.current = editedProblem;
            onProblemUpdated(editedProblem);
        }
    }, [editMutation.data?.problem, onProblemUpdated]);

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
        if (!prompt.trim() || !currentProblem?.sessionId) return;
        editMutation.mutate({ currentProblem, target, userInput: prompt });
    };

    const operations = turn?.semanticPatch?.operations ?? [];

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
                        editMutation.reset();
                    }}
                    disabled={editMutation.isPending}
                />
                {!currentProblem?.sessionId && <p className="problem-ai-edit-panel__notice problem-ai-edit-panel__notice--error" role="alert">이 문항에는 편집 세션 정보가 없어 AI 편집을 요청할 수 없습니다.</p>}
                {editMutation.isPending && <p className="problem-ai-edit-panel__notice" role="status">수정 요청을 전달하고 있습니다.</p>}
                {editMutation.isError && <p className="problem-ai-edit-panel__notice problem-ai-edit-panel__notice--error" role="alert">{editMutation.error?.message || '수정 요청을 처리하지 못했습니다.'}</p>}
                {turn && (
                    <section className="problem-ai-edit-panel__response" aria-live="polite">
                        <strong>AI 응답</strong>
                        <p>{turn.assistantMessage || '수정 요청을 확인했습니다.'}</p>
                        {operations.length > 0 && (
                            <ul aria-label="변경 제안 항목">
                                {operations.map((operation, index) => (
                                    <li key={`${operation.type}-${operation.path}-${index}`}>
                                        <span>{operation.type}</span>
                                        {operation.path && <code>{operation.path}</code>}
                                    </li>
                                ))}
                            </ul>
                        )}
                        {actionNotices[turn.action] && <p className="problem-ai-edit-panel__limitation">{actionNotices[turn.action]}</p>}
                        {turn.action === 'CONFIRM_EXECUTION' && <p className="problem-ai-edit-panel__success">수정된 최신 문항을 불러와 미리보기에 반영했습니다.</p>}
                    </section>
                )}
                <div className="problem-ai-edit-panel__actions">
                    <button type="button" onClick={onClose}>취소</button>
                    <button type="submit" disabled={!prompt.trim() || !currentProblem?.sessionId || editMutation.isPending}>
                        {editMutation.isPending ? '요청 중...' : '수정 요청'}
                    </button>
                </div>
            </form>
        </aside>
    );
}

export default ProblemAiEditPanel;
