import httpClient from '../httpClient.js';

export const getAcademicContexts = ({ signal }) => httpClient.get('/teacher/academic-contexts', {
    signal,
});
