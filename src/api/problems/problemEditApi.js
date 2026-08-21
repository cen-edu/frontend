import httpClient from '../httpClient.js';

const getSessionPath = (sessionId) => (
    `/teacher/problems/authoring-sessions/${sessionId}`
);

export const requestProblemEditTurn = ({ sessionId, userInput, history = [], selectedTarget }) => (
    httpClient.post(`${getSessionPath(sessionId)}/edit/turns`, {
        userInput,
        history,
        selectedTarget,
    })
);

export const getProblemAuthoringStatus = ({ sessionId, signal }) => (
    httpClient.get(`${getSessionPath(sessionId)}/status`, { signal })
);

export const getProblemAuthoringPreview = ({ sessionId, signal }) => (
    httpClient.get(`${getSessionPath(sessionId)}/preview`, { signal })
);
