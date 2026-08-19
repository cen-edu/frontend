import httpClient from '../httpClient.js';

const toDashboardParams = ({ classId, semester }) => ({
    classId: Number(classId),
    semester: Number(semester),
});

export const getDashboardSummary = ({ classId, semester, signal }) => httpClient.get(
    '/teacher/dashboard/summary',
    {
        params: toDashboardParams({ classId, semester }),
        signal,
    },
);

export const getDashboardStudentProgress = ({ classId, semester, signal }) => httpClient.get(
    '/teacher/dashboard/student-progress',
    {
        params: toDashboardParams({ classId, semester }),
        signal,
    },
);

export const getDashboardAssignments = ({
    classId,
    semester,
    page = 0,
    size = 20,
    signal,
}) => httpClient.get('/teacher/dashboard/assignments', {
    params: {
        ...toDashboardParams({ classId, semester }),
        page,
        size,
    },
    signal,
});

