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

export const getStudentDetail = ({ studentId, signal }) =>
    httpClient.get(`/teacher/students/${studentId}`, { signal });

export const createStudent = ({
                                  name,
                                  registrationYear,
                                  grade,
                              }) => httpClient.post('/teacher/students', {
    name,
    registrationYear,
    grade,
});

export const createStudentsBulk = (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return httpClient.post('/teacher/students/bulk', formData);
};

export const deleteStudent = (studentId) =>
    httpClient.delete(`/teacher/students/${studentId}`);

export const resetStudentPassword = (studentId) =>
    httpClient.patch(`/teacher/students/${studentId}/password/reset`);
