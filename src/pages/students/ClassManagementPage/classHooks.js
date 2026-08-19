import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    createClass,
    deleteClasses,
    getAvailableClassStudents,
    getClassDetail,
    getClasses,
    updateClass,
    updateClassOrder,
} from '../../../api/classes/classesApi.js';

const normalizeListParams = ({ academicYear, grade, keyword } = {}) => ({
    academicYear: academicYear || undefined,
    grade: grade || undefined,
    keyword: keyword?.trim() || undefined,
});

export const classQueryKeys = {
    all: ['teacher', 'classes'],
    lists: () => [...classQueryKeys.all, 'list'],
    list: (params = {}) => [...classQueryKeys.lists(), normalizeListParams(params)],
    details: () => [...classQueryKeys.all, 'detail'],
    detail: (classId) => [...classQueryKeys.details(), classId],
    availableStudents: ({ grade, keyword }) => [
        ...classQueryKeys.all,
        'available-students',
        { grade: String(grade), keyword: keyword?.trim() || '' },
    ],
};

export const useClassesQuery = (params = {}) => {
    const normalizedParams = normalizeListParams(params);

    return useQuery({
        queryKey: classQueryKeys.list(normalizedParams),
        queryFn: ({ signal }) => getClasses({ ...normalizedParams, signal }),
    });
};

export const useClassDetailQuery = (classId) => useQuery({
    queryKey: classQueryKeys.detail(classId),
    queryFn: ({ signal }) => getClassDetail({ classId, signal }),
    enabled: Boolean(classId),
});

export const useAvailableClassStudentsQuery = ({ grade, keyword }) => useQuery({
    queryKey: classQueryKeys.availableStudents({ grade, keyword }),
    queryFn: ({ signal }) => getAvailableClassStudents({ grade, keyword, signal }),
    enabled: Boolean(grade),
});

const useClassMutation = (mutationFn) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn,
        onSuccess: () => Promise.all([
            queryClient.invalidateQueries({ queryKey: classQueryKeys.all }),
            queryClient.invalidateQueries({ queryKey: ['teacher', 'students'] }),
            queryClient.invalidateQueries({ queryKey: ['teacher', 'academic-contexts'] }),
            queryClient.invalidateQueries({ queryKey: ['teacher', 'dashboard'] }),
            queryClient.invalidateQueries({ queryKey: ['teacher', 'analysis'] }),
            queryClient.invalidateQueries({ queryKey: ['teacher', 'grading'] }),
            queryClient.invalidateQueries({ queryKey: ['teacher', 'learning-status'] }),
        ]),
    });
};

export const useCreateClassMutation = () => useClassMutation(createClass);

export const useUpdateClassMutation = () => useClassMutation(updateClass);

export const useDeleteClassesMutation = () => useClassMutation(deleteClasses);

export const useUpdateClassOrderMutation = () => useClassMutation(updateClassOrder);
