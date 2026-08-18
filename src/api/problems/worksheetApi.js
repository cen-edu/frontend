import httpClient from '../httpClient.js';

export const createWorksheet = (worksheet) => (
    httpClient.post('/teacher/worksheets', worksheet)
);
