import httpClient from '../httpClient.js';

export const startPracticeProblemGeneration = ({ clientRequestId, items }) => (
    httpClient.post('/teacher/problems/generate/async', { clientRequestId, items })
);

export const getPracticeProblemGenerationJob = ({ jobId, signal }) => (
    httpClient.get(`/teacher/problems/generation-jobs/${jobId}`, { signal })
);
