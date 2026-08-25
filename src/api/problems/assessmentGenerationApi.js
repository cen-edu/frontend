import httpClient from '../httpClient.js';

export const startAssessmentProblemGeneration = ({ clientRequestId, items }) => (
    httpClient.post('/teacher/assessments/generate/async', { clientRequestId, items })
);
