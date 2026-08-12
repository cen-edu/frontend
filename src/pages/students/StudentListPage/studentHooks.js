import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {createStudent, deleteStudent, getStudents } from '../../../api/students/studentsApi.js';


export const studentQueryKeys = {
    all: ['teacher', 'students'],
    list: (params) => [...studentQueryKeys.all, 'list', params],
};

export const useStudentsQuery = (params) => useQuery({
    queryKey: studentQueryKeys.list(params),
    queryFn: ({ signal }) => getStudents({ ...params, signal }),
    placeholderData: keepPreviousData,
});

export const useCreateStudentMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createStudent,
        onSuccess: () => queryClient.invalidateQueries({
            queryKey: ['teacher', 'students'],
        }),
    });
};

export const useDeleteStudentsMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (studentIds) =>
            Promise.all(studentIds.map((studentId) => deleteStudent(studentId))),
        onSettled: () => queryClient.invalidateQueries({
            queryKey: studentQueryKeys.all,
        }),
    });
};