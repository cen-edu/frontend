import httpClient from '../httpClient.js';

export const getClasses = ({
    academicYear,
    grade,
    keyword,
    signal,
} = {}) => httpClient.get('/teacher/classes', {
    params: {
        academicYear: academicYear ? Number(academicYear) : undefined,
        grade: grade ? Number(grade) : undefined,
        keyword: keyword?.trim() || undefined,
    },
    signal,
});

export const getClassDetail = ({ classId, signal }) => (
    httpClient.get(`/teacher/classes/${classId}`, { signal })
);

export const getAvailableClassStudents = ({
    grade,
    keyword,
    signal,
}) => httpClient.get('/teacher/classes/available-students', {
    params: {
        grade: Number(grade),
        keyword: keyword?.trim() || undefined,
    },
    signal,
});

export const createClass = ({
    academicYear,
    grade,
    name,
    studentIds = [],
}) => httpClient.post('/teacher/classes', {
    academicYear: Number(academicYear),
    grade: Number(grade),
    name: name.trim(),
    studentIds,
});

export const updateClass = ({
    classId,
    academicYear,
    grade,
    name,
    studentIds,
}) => httpClient.patch(`/teacher/classes/${classId}`, {
    academicYear: Number(academicYear),
    grade: Number(grade),
    name: name.trim(),
    studentIds,
});

export const deleteClasses = ({ classIds }) => (
    httpClient.delete('/teacher/classes', {
        data: { classIds },
    })
);

export const updateClassOrder = ({ classIds }) => (
    httpClient.patch('/teacher/classes/order', { classIds })
);
