import { useEffect, useRef, useState } from 'react';
import sennyChatbot from '../../../../assets/images/senny-chatbot.png';
import { useProblemEditMutation } from '../../problemEditHooks.js';
import './ProblemAiEditPanel.scss';

const actionNotices = {
    CONTINUE_COLLECTION: '수정 방향을 정할 수 있도록 필요한 내용을 더 입력해 주세요.',
    REQUEST_CONFIRMATION: '제안 내용을 확인한 뒤 수정 적용을 눌러 주세요.',
    CANCEL: '수정 요청이 취소되었습니다.',
};

const operationNotices = {
    MODIFYING: '수정 후보를 만들고 있습니다.',
    VERIFYING: '수정 결과를 검증하고 있습니다.',
    IDLE: '최신 문항을 불러오고 있습니다.',
};

const CONFIRMATION_INPUT = '변경 사항을 적용해 주세요.';

function ProblemAiEditPanel({ currentProblem, target, onProblemUpdated, onClose }) {
    const [prompt, setPrompt] = useState('');
    const [history, setHistory] = useState([]);
    const textareaRef = useRef(null);
    const appliedProblemRef = useRef(null);
    const editMutation = useProblemEditMutation();
    const turn = editMutation.data?.turn;

    useEffect(() => {
        setPrompt('');
        setHistory([]);
        editMutation.cancel();
        textareaRef.current?.focus();
    }, [currentProblem?.sessionId, currentProblem?.versionId, target?.type, target?.id, target?.targetKey]);

    useEffect(() => {
        const editedProblem = editMutation.data?.problem;

        if (editedProblem && appliedProblemRef.current !== editedProblem) {
            appliedProblemRef.current = editedProblem;
            onProblemUpdated?.(editedProblem);
        }
    }, [editMutation.data?.problem, onProblemUpdated]);

    useEffect(() => {
        const closeOnEscape = (event) => {
            if (event.key === 'Escape') {
                editMutation.cancel();
                onClose();
            }
        };
        document.addEventListener('keydown', closeOnEscape);
        return () => document.removeEventListener('keydown', closeOnEscape);
    }, [onClose]);

    if (!target) return null;

    const requestTurn = (userInput) => {
        if (!userInput.trim() || !currentProblem?.sessionId) return;

        editMutation.mutate({ currentProblem, target, userInput, history }, {
            onSuccess: ({ turn: nextTurn }) => {
                const assistantMessage = nextTurn?.assistantMessage?.trim();
                setHistory((current) => [
                    ...current,
                    { role: 'user', content: userInput.trim() },
                    ...(assistantMessage ? [{ role: 'assistant', content: assistantMessage }] : []),
                ]);
                setPrompt('');
            },
        });
    };

    const submit = (event) => {
        event.preventDefault();
        requestTurn(prompt);
    };

    const close = () => {
        editMutation.cancel();
        onClose();
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
                <button type="button" className="problem-ai-edit-panel__close" aria-label="AI 편집 요청 창 닫기" onClick={close}>
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
                    onChange={(event) => setPrompt(event.target.value)}
                    disabled={editMutation.isPending || turn?.action === 'REQUEST_CONFIRMATION'}
                />
                {!currentProblem?.sessionId && <p className="problem-ai-edit-panel__notice problem-ai-edit-panel__notice--error" role="alert">이 문항에는 편집 세션 정보가 없어 AI 편집을 요청할 수 없습니다.</p>}
                {editMutation.isPending && <p className="problem-ai-edit-panel__notice" role="status">{operationNotices[editMutation.operationStatus] || '수정 요청을 전달하고 있습니다.'}</p>}
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
                    <button type="button" onClick={close}>취소</button>
                    {turn?.action === 'REQUEST_CONFIRMATION' ? (
                        <button type="button" onClick={() => requestTurn(CONFIRMATION_INPUT)} disabled={!currentProblem?.sessionId || editMutation.isPending}>
                            {editMutation.isPending ? '적용 중...' : '수정 적용'}
                        </button>
                    ) : turn?.action !== 'CONFIRM_EXECUTION' && (
                        <button type="submit" disabled={!prompt.trim() || !currentProblem?.sessionId || editMutation.isPending}>
                            {editMutation.isPending ? '요청 중...' : history.length ? '추가 내용 보내기' : '수정 요청'}
                        </button>
                    )}
                </div>
            </form>
        </aside>
    );
}

export default ProblemAiEditPanel;
