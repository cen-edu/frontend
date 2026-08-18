import httpClient from '../httpClient.js';

export const getAnalysisAssignments = ({
    classId,
    semester,
    worksheetType,
    signal,
}) => httpClient.get('/teacher/analysis/assignments', {
    params: {
        classId: Number(classId),
        semester: Number(semester),
        worksheetType: worksheetType || undefined,
    },
    signal,
});
