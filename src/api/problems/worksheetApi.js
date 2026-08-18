import httpClient from '../httpClient.js';

export const getWorksheets = ({
    tab,
    grade,
    semester,
    q,
    signal,
}) => httpClient.get('/teacher/worksheets', {
    params: {
        tab,
        grade,
        semester,
        q,
    },
    signal,
});

export const createWorksheet = (worksheet) => (
    httpClient.post('/teacher/worksheets', worksheet)
);
