import httpClient from '../httpClient.js';

export const getProblemUnits = ({ grade, semester, signal }) =>
    httpClient.get('/teacher/problems/units', {
        params: { grade, semester },
        signal,
    });
