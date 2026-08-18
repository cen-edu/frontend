import { useQuery } from '@tanstack/react-query';
import {
    getLearningStatus,
    getLearningStatusStudents,
} from '../../../api/learning/learningStatusApi.js';

const normalizeListParams = ({ grade, classId, semester, q } = {}) => ({
    grade: grade || undefined,
    classId: classId || undefined,
    semester: semester || undefined,
    q: q?.trim() || undefined,
});

export const learningStatusQueryKeys = {
    all: ['teacher', 'learning-status'],
    lists: () => [...learningStatusQueryKeys.all, 'list'],
    list: (params = {}) => [...learningStatusQueryKeys.lists(), normalizeListParams(params)],
    students: (assignmentId, status) => [
        ...learningStatusQueryKeys.all,
        'students',
        String(assignmentId),
        status || null,
    ],
};

export const useLearningStatusQuery = (params = {}) => {
    const normalizedParams = normalizeListParams(params);

    return useQuery({
        queryKey: learningStatusQueryKeys.list(normalizedParams),
        queryFn: ({ signal }) => getLearningStatus({ ...normalizedParams, signal }),
    });
};

export const useLearningStatusStudentsQuery = ({ assignmentId, status }) => useQuery({
    queryKey: learningStatusQueryKeys.students(assignmentId, status),
    queryFn: ({ signal }) => getLearningStatusStudents({
        assignmentId,
        status,
        signal,
    }),
    enabled: Boolean(assignmentId),
});
