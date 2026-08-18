import httpClient from '../httpClient.js';

export const sendStudentChat = ({
    question,
    history = [],
    currentConceptId = null,
    subUnitId = null,
    signal,
}) => httpClient.post('/chat', {
    question,
    history,
    currentConceptId,
    subUnitId,
}, { signal });
