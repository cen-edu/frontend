import httpClient from '../httpClient.js';

export const generatePracticeProblems = ({ items }) => (
    httpClient.post('/teacher/problems/generate', { items })
);
