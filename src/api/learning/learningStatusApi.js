import httpClient from '../httpClient.js';

export const getLearningStatus = ({
    grade,
    classId,
    semester,
    q,
    signal,
} = {}) => httpClient.get('/teacher/learning-status', {
    params: {
        grade: grade ? Number(grade) : undefined,
        classId: classId ? Number(classId) : undefined,
        semester: semester || undefined,
        q: q?.trim() || undefined,
    },
    signal,
});

export const getLearningStatusStudents = ({
    assignmentId,
    status,
    signal,
}) => httpClient.get(`/teacher/learning-status/${assignmentId}/students`, {
    params: {
        status: status || undefined,
    },
    signal,
});
