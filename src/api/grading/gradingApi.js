import httpClient from '../httpClient.js';

export const getGradingWorksheets = ({ grade, classId, semester, status, signal }) => (
    httpClient.get('/teacher/grading', {
        params: { grade, classId, semester, status },
        signal,
    })
);

export const getGradingScoreTable = ({ assignmentId, signal }) => (
    httpClient.get(`/teacher/grading/${assignmentId}`, { signal })
);

export const getGradingStudentDetail = ({ assignmentId, assignmentStudentId, signal }) => (
    httpClient.get(`/teacher/grading/${assignmentId}/students/${assignmentStudentId}`, { signal })
);

export const startAutoGrading = ({ assignmentId, targets }) => (
    httpClient.post(`/teacher/grading/${assignmentId}/auto`, { targets: targets ?? null })
);

export const getAutoGradingProgress = ({ assignmentId, signal }) => (
    httpClient.get(`/teacher/grading/${assignmentId}/auto`, { signal })
);

export const patchGradingAnswer = ({ assignmentId, submissionAnswerId, payload }) => (
    httpClient.patch(`/teacher/grading/${assignmentId}/answers/${submissionAnswerId}`, payload)
);

export const releaseGradingResults = (assignmentId) => (
    httpClient.post(`/teacher/grading/${assignmentId}/release`)
);
