import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    getAutoGradingProgress,
    getGradingScoreTable,
    getGradingStudentDetail,
    getGradingWorksheets,
    patchGradingAnswer,
    releaseGradingResults,
    startAutoGrading,
} from '../../../api/grading/gradingApi.js';
import { normalizeGradingWorksheet, normalizeScoreTable } from './gradingAdapters.js';

export const gradingQueryKeys = {
    all: ['teacher', 'grading'],
    list: (params) => [...gradingQueryKeys.all, 'list', params],
    scoreTable: (assignmentId) => [...gradingQueryKeys.all, 'score-table', assignmentId],
    student: (assignmentId, assignmentStudentId) => [
        ...gradingQueryKeys.all,
        'student',
        assignmentId,
        assignmentStudentId,
    ],
    progress: (assignmentId) => [...gradingQueryKeys.all, 'auto-progress', assignmentId],
};

export const useGradingWorksheetsQuery = (params) => useQuery({
    queryKey: gradingQueryKeys.list(params),
    queryFn: ({ signal }) => getGradingWorksheets({ ...params, signal }),
    select: (data) => (data?.worksheets ?? []).map(normalizeGradingWorksheet),
    placeholderData: keepPreviousData,
});

export const useGradingScoreTableQuery = (assignmentId) => useQuery({
    queryKey: gradingQueryKeys.scoreTable(assignmentId),
    queryFn: ({ signal }) => getGradingScoreTable({ assignmentId, signal }),
    select: normalizeScoreTable,
    enabled: Number.isFinite(assignmentId),
});

export const useGradingStudentDetailQuery = (assignmentId, assignmentStudentId) => useQuery({
    queryKey: gradingQueryKeys.student(assignmentId, assignmentStudentId),
    queryFn: ({ signal }) => getGradingStudentDetail({ assignmentId, assignmentStudentId, signal }),
    enabled: Number.isFinite(assignmentId) && Number.isFinite(assignmentStudentId),
    refetchInterval: 9 * 60 * 1000,
});

export const useAutoGradingProgressQuery = (assignmentId, enabled = true) => useQuery({
    queryKey: gradingQueryKeys.progress(assignmentId),
    queryFn: ({ signal }) => getAutoGradingProgress({ assignmentId, signal }),
    enabled: enabled && Number.isFinite(assignmentId),
    refetchInterval: (query) => query.state.data?.running ? 1500 : false,
});

const invalidateAssignment = (queryClient, assignmentId) => Promise.all([
    queryClient.invalidateQueries({ queryKey: gradingQueryKeys.all }),
    queryClient.invalidateQueries({ queryKey: gradingQueryKeys.scoreTable(assignmentId) }),
]);

export const useStartAutoGradingMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: startAutoGrading,
        onSuccess: (_, variables) => queryClient.invalidateQueries({
            queryKey: gradingQueryKeys.progress(variables.assignmentId),
        }),
    });
};

export const usePatchGradingAnswerMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: patchGradingAnswer,
        onSuccess: (_, variables) => Promise.all([
            invalidateAssignment(queryClient, variables.assignmentId),
            queryClient.invalidateQueries({
                queryKey: gradingQueryKeys.student(
                    variables.assignmentId,
                    variables.assignmentStudentId,
                ),
            }),
        ]),
    });
};

export const useReleaseGradingResultsMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: releaseGradingResults,
        onSuccess: (_, assignmentId) => invalidateAssignment(queryClient, assignmentId),
    });
};
