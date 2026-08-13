import httpClient from '../httpClient.js';

export const generateAssessmentProblems = ({ items }) => (
    httpClient.post('/teacher/assessments/generate', { items })
);
