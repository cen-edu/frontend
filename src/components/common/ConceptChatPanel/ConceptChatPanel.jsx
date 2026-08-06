import { useEffect, useState } from 'react';
import { getConceptChatReply, getRecommendedQuestions } from '../../../mocks/conceptChat';
import sennyChatbotImage from '../../../assets/images/senny-chatbot.png';
import './ConceptChatPanel.scss';

function ConceptChatPanel({
    context = [],
    studentName = '',
    mode = 'default',
    title = '개념 도우미',
    description = '교육과정 개념을 기준으로 답변합니다.',
    welcomeMessage,
    suggestions,
    readOnly = false,
}) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const questions = suggestions ?? getRecommendedQuestions(context);

    useEffect(() => {
        setMessages([{
            id: 'welcome',
            role: 'assistant',
            text: welcomeMessage ?? `${studentName ? `${studentName} 학생의 ` : ''}취약 개념을 기준으로 질문해 주세요.`,
        }]);
        setInput('');
    }, [studentName, welcomeMessage]);

    const sendMessage = (value) => {
        if (readOnly) return;
        const question = value.trim();
        if (!question) return;
        const reply = getConceptChatReply(question, context);
        setMessages((current) => [...current, { id: `user-${Date.now()}`, role: 'user', text: question }, { id: `assistant-${Date.now()}`, role: 'assistant', text: reply.text }]);
        setInput('');
    };

    return (
        <aside className={`concept-chat concept-chat--${mode}${readOnly ? ' concept-chat--readonly' : ''}${isExpanded ? ' concept-chat--expanded' : ''}`} aria-labelledby="concept-chat-title">
            <header className="concept-chat__header">
                <div><h2 id="concept-chat-title">{title}</h2><p>{description}</p></div>
                <button type="button" className="concept-chat__toggle" aria-expanded={isExpanded} aria-label={isExpanded ? '개념 도우미 접기' : '개념 도우미 펼치기'} onClick={() => setIsExpanded((current) => !current)}><i className={`bi bi-chevron-${isExpanded ? 'up' : 'down'}`} aria-hidden="true" /></button>
            </header>
            <div className="concept-chat__body">
                <div className="concept-chat__messages" role="log" aria-live="polite">
                    {messages.map((message) => <p key={message.id} className={`concept-chat__message concept-chat__message--${message.role}`}>{message.text}</p>)}
                </div>
                {questions.length > 0 && <div className="concept-chat__suggestions" aria-label="추천 질문">{questions.map((question) => <button type="button" key={question} disabled={readOnly} tabIndex={readOnly ? -1 : undefined} onClick={() => sendMessage(question)}>{question}</button>)}</div>}
                <form className="concept-chat__form" onSubmit={(event) => { event.preventDefault(); sendMessage(input); }}>
                    <input value={input} onChange={(event) => setInput(event.target.value)} readOnly={readOnly} tabIndex={readOnly ? -1 : undefined} aria-label="개념 질문 입력" placeholder="개념이나 풀이 단계를 질문하세요" />
                    <button type="submit" aria-label="질문 보내기" disabled={readOnly || !input.trim()} tabIndex={readOnly ? -1 : undefined}>
                        <img src={sennyChatbotImage} alt="" />
                    </button>
                </form>
            </div>
        </aside>
    );
}

export default ConceptChatPanel;
