import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    getStudentAssignment,
    getStudentAssignmentResult,
    getStudentAssignments,
    saveStudentItemAnswers,
    submitStudentAssignment,
    uploadStudentAnswerImage,
} from '../../api/student/studentAssignmentsApi.js';

export const studentAssignmentQueryKeys = {
    all: ['student', 'assignments'],
    list: () => [...studentAssignmentQueryKeys.all, 'list'],
    detail: (assignmentStudentId) => [...studentAssignmentQueryKeys.all, 'detail', assignmentStudentId],
    result: (assignmentStudentId) => [...studentAssignmentQueryKeys.all, 'result', assignmentStudentId],
};

export const useStudentAssignmentsQuery = () => useQuery({
    queryKey: studentAssignmentQueryKeys.list(),
    queryFn: ({ signal }) => getStudentAssignments({ signal }),
    select: (response) => response.assignments,
});

export const useStudentAssignmentQuery = (assignmentStudentId) => useQuery({
    queryKey: studentAssignmentQueryKeys.detail(assignmentStudentId),
    queryFn: ({ signal }) => getStudentAssignment({ assignmentStudentId, signal }),
    enabled: Number.isFinite(assignmentStudentId),
});

export const useStudentAssignmentResultQuery = (assignmentStudentId) => useQuery({
    queryKey: studentAssignmentQueryKeys.result(assignmentStudentId),
    queryFn: ({ signal }) => getStudentAssignmentResult({ assignmentStudentId, signal }),
    enabled: Number.isFinite(assignmentStudentId),
});

export const useSaveStudentItemMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: saveStudentItemAnswers,
        onSuccess: (progress, variables) => {
            queryClient.setQueryData(studentAssignmentQueryKeys.list(), (current) => {
                if (!current?.assignments) return current;
                return {
                    ...current,
                    assignments: current.assignments.map((assignment) => (
                        assignment.assignmentStudentId === variables.assignmentStudentId
                            ? { ...assignment, ...progress }
                            : assignment
                    )),
                };
            });
            queryClient.invalidateQueries({
                queryKey: studentAssignmentQueryKeys.detail(variables.assignmentStudentId),
            });
        },
    });
};

export const useSubmitStudentAssignmentMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: submitStudentAssignment,
        onSuccess: (_, assignmentStudentId) => {
            queryClient.invalidateQueries({ queryKey: studentAssignmentQueryKeys.all });
            queryClient.invalidateQueries({
                queryKey: studentAssignmentQueryKeys.detail(assignmentStudentId),
            });
        },
    });
};

export const useUploadStudentAnswerImageMutation = () => useMutation({
    mutationFn: uploadStudentAnswerImage,
});
