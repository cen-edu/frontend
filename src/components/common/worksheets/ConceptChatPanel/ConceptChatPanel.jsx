import { useEffect, useRef, useState } from 'react';
import { sendStudentChat } from '../../../../api/student/studentChatApi.js';
import { getRecommendedQuestions } from '../../../../mocks/conceptChat';
import sennyChatbotImage from '../../../../assets/images/senny-chatbot.png';
import MathText from '../MathText/MathText';
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
    const [currentConceptId, setCurrentConceptId] = useState(null);
    const [input, setInput] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const requestControllerRef = useRef(null);
    const questions = suggestions ?? getRecommendedQuestions(context);
    const rawSubUnitId = context[0]?.subUnitId;
    const parsedSubUnitId = Number(rawSubUnitId);
    const subUnitId = rawSubUnitId !== null
        && rawSubUnitId !== undefined
        && Number.isInteger(parsedSubUnitId)
        ? parsedSubUnitId
        : null;

    useEffect(() => {
        requestControllerRef.current?.abort();
        requestControllerRef.current = null;
        setMessages([]);
        setCurrentConceptId(null);
        setInput('');
        setIsSending(false);
        setErrorMessage('');

        return () => requestControllerRef.current?.abort();
    }, [studentName, welcomeMessage, subUnitId]);

    const sendMessage = async (value) => {
        if (readOnly || isSending) return;
        const question = value.trim();
        if (!question) return;

        const controller = new AbortController();
        requestControllerRef.current = controller;
        setIsSending(true);
        setErrorMessage('');

        try {
            const data = await sendStudentChat({
                question,
                history: messages.slice(-20).map(({ role, content }) => ({ role, content })),
                currentConceptId,
                subUnitId,
                signal: controller.signal,
            });

            setMessages((current) => [
                ...current,
                { role: 'user', content: question },
                { role: 'assistant', content: data.answer },
            ]);
            setCurrentConceptId(data.currentConceptId);
            setInput('');
        } catch (error) {
            if (error.code !== 'ERR_CANCELED') {
                setErrorMessage(error.message || '챗봇 요청에 실패했습니다.');
            }
        } finally {
            if (requestControllerRef.current === controller) {
                requestControllerRef.current = null;
                setIsSending(false);
            }
        }
    };

    const welcomeText = welcomeMessage
        ?? `${studentName ? `${studentName} 학생의 ` : ''}취약 개념을 기준으로 질문해 주세요.`;

    return (
        <aside className={`concept-chat concept-chat--${mode}${readOnly ? ' concept-chat--readonly' : ''}${isExpanded ? ' concept-chat--expanded' : ''}`} aria-labelledby="concept-chat-title">
            <header className="concept-chat__header">
                <div><h2 id="concept-chat-title">{title}</h2><p>{description}</p></div>
                <button type="button" className="concept-chat__toggle" aria-expanded={isExpanded} aria-label={isExpanded ? '개념 도우미 접기' : '개념 도우미 펼치기'} onClick={() => setIsExpanded((current) => !current)}><i className={`bi bi-chevron-${isExpanded ? 'up' : 'down'}`} aria-hidden="true" /></button>
            </header>
            <div className="concept-chat__body">
                <div className="concept-chat__messages" role="log" aria-live="polite">
                    <p className="concept-chat__message concept-chat__message--assistant"><MathText>{welcomeText}</MathText></p>
                    {messages.map((message, index) => (
                        <p key={`${message.role}-${index}`} className={`concept-chat__message concept-chat__message--${message.role}`}>
                            {message.role === 'assistant'
                                ? <MathText>{message.content}</MathText>
                                : message.content}
                        </p>
                    ))}
                    {isSending && <p className="concept-chat__message concept-chat__message--assistant concept-chat__message--loading">답변을 생각하고 있어요.</p>}
                </div>
                {errorMessage && <p className="concept-chat__error" role="alert">{errorMessage}</p>}
                {questions.length > 0 && <div className="concept-chat__suggestions" aria-label="추천 질문">{questions.map((question) => <button type="button" key={question} disabled={readOnly || isSending} tabIndex={readOnly ? -1 : undefined} onClick={() => sendMessage(question)}>{question}</button>)}</div>}
                <form className="concept-chat__form" onSubmit={(event) => { event.preventDefault(); sendMessage(input); }}>
                    <input value={input} onChange={(event) => setInput(event.target.value)} readOnly={readOnly} disabled={isSending} maxLength={500} tabIndex={readOnly ? -1 : undefined} aria-label="개념 질문 입력" placeholder="개념이나 풀이 단계를 질문하세요" />
                    <button type="submit" aria-label={isSending ? '답변 생성 중' : '질문 보내기'} disabled={readOnly || isSending || !input.trim()} tabIndex={readOnly ? -1 : undefined}>
                        <img src={sennyChatbotImage} alt="" />
                    </button>
                </form>
            </div>
        </aside>
    );
}

export default ConceptChatPanel;
