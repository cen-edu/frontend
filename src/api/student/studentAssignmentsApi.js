import httpClient from '../httpClient.js';

export const getStudentAssignments = ({ signal } = {}) => (
    httpClient.get('/student/assignments', { signal })
);

export const getStudentAssignment = ({ assignmentStudentId, signal }) => (
    httpClient.get(`/student/assignments/${assignmentStudentId}`, { signal })
);

export const saveStudentItemAnswers = ({
    assignmentStudentId,
    worksheetItemId,
    timeSpentSeconds,
    answers,
}) => httpClient.put(
    `/student/assignments/${assignmentStudentId}/items/${worksheetItemId}`,
    { timeSpentSeconds, answers },
);

export const submitStudentAssignment = (assignmentStudentId) => (
    httpClient.post(`/student/assignments/${assignmentStudentId}/submit`)
);

export const getStudentAssignmentResult = ({ assignmentStudentId, signal }) => (
    httpClient.get(`/student/assignments/${assignmentStudentId}/result`, { signal })
);

export const uploadStudentAnswerImage = ({ assignmentStudentId, answerUnitId, file }) => {
    const formData = new FormData();
    formData.append('file', file);

    return httpClient.post(
        `/images/answers/${assignmentStudentId}/answer-units/${answerUnitId}`,
        formData,
    );
};
