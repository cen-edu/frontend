import httpClient from '../httpClient.js';

export const getStudents = ({
    registrationYear,
    grade,
    classId,
    keyword,
    sort,
    page,
    size,
    signal,
}) => httpClient.get('/teacher/students', {
    params: {
        registrationYear,
        grade,
        classId,
        keyword,
        sort,
        page,
        size,
    },
    signal,
});

export const createStudent = ({
                                  name,
                                  registrationYear,
                                  grade,
                              }) => httpClient.post('/teacher/students', {
    name,
    registrationYear,
    grade,
});

export const deleteStudent = (studentId) =>
    httpClient.delete(`/teacher/students/${studentId}`);