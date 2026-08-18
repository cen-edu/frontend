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

export const getWorksheet = ({ worksheetId, signal }) => (
    httpClient.get(`/teacher/worksheets/${worksheetId}`, { signal })
);

export const createWorksheet = (worksheet) => (
    httpClient.post('/teacher/worksheets', worksheet)
);
