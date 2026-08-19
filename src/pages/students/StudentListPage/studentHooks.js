import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    createStudent,
    createStudentsBulk,
    deleteStudent,
    getStudentDetail,
    getStudents,
    resetStudentPassword,
} from '../../../api/students/studentsApi.js';


export const studentQueryKeys = {
    all: ['teacher', 'students'],
    list: (params) => [...studentQueryKeys.all, 'list', params],
    details: () => [...studentQueryKeys.all, 'detail'],
    detail: (studentId) => [...studentQueryKeys.details(), studentId],
};

const invalidateStudentDependentQueries = (queryClient) => Promise.all([
    queryClient.invalidateQueries({ queryKey: studentQueryKeys.all }),
    queryClient.invalidateQueries({ queryKey: ['teacher', 'dashboard'] }),
    queryClient.invalidateQueries({ queryKey: ['teacher', 'analysis'] }),
    queryClient.invalidateQueries({ queryKey: ['teacher', 'grading'] }),
    queryClient.invalidateQueries({ queryKey: ['teacher', 'learning-status'] }),
]);

export const useStudentsQuery = (params) => useQuery({
    queryKey: studentQueryKeys.list(params),
    queryFn: ({ signal }) => getStudents({ ...params, signal }),
    placeholderData: keepPreviousData,
});

export const useStudentDetailQuery = (studentId) => useQuery({
    queryKey: studentQueryKeys.detail(studentId),
    queryFn: ({ signal }) => getStudentDetail({ studentId, signal }),
    enabled: Boolean(studentId),
});

export const useCreateStudentMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createStudent,
        onSuccess: () => invalidateStudentDependentQueries(queryClient),
    });
};

export const useCreateStudentsBulkMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createStudentsBulk,
        onSuccess: () => invalidateStudentDependentQueries(queryClient),
    });
};

export const useDeleteStudentsMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (studentIds) =>
            Promise.all(studentIds.map((studentId) => deleteStudent(studentId))),
        onSettled: () => invalidateStudentDependentQueries(queryClient),
    });
};

export const useResetStudentPasswordMutation = () => useMutation({
    mutationFn: resetStudentPassword,
});
