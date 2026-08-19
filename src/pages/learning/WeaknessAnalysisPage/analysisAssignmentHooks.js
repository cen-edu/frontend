import { useCallback, useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    getAnalysisAssignments,
    getAnalysisOverview,
    getAnalysisStudents,
    getComprehensiveAssessmentInsights,
    getItemAchievement,
    getLearningAssessmentAchievement,
    getLearningAssessmentInsights,
    getScoreTimeDistribution,
    getStudentAnalysisSummary,
    getStudentAnalysisReport,
    getStudentComprehensiveAssessmentPerformance,
    getStudentCustomLearningSessions,
    getStudentItemResults,
    getStudentLearningAssessmentPerformance,
    requestStudentAnalysisReport,
} from '../../../api/analysis/analysisApi.js';
import { ReportGenerationStatus } from '../../../api/analysis/analysisConstants.js';

export const analysisAssignmentQueryKeys = {
    all: ['teacher', 'analysis'],
    assignments: () => [...analysisAssignmentQueryKeys.all, 'assignments'],
    list: ({ classId, semester, worksheetType }) => [
        ...analysisAssignmentQueryKeys.assignments(),
        { classId, semester, worksheetType: worksheetType || null },
    ],
    overview: (assignmentId) => [
        ...analysisAssignmentQueryKeys.all,
        'overview',
        String(assignmentId),
    ],
    students: (assignmentId) => [
        ...analysisAssignmentQueryKeys.all,
        'students',
        String(assignmentId),
    ],
    learningAssessmentInsights: (assignmentId) => [
        ...analysisAssignmentQueryKeys.all,
        'learning-assessment-insights',
        String(assignmentId),
    ],
    learningAssessmentAchievement: (assignmentId) => [
        ...analysisAssignmentQueryKeys.all,
        'learning-assessment-achievement',
        String(assignmentId),
    ],
    comprehensiveAssessmentInsights: (assignmentId) => [
        ...analysisAssignmentQueryKeys.all,
        'comprehensive',
        String(assignmentId),
        'insights',
    ],
    itemAchievement: (assignmentId) => [
        ...analysisAssignmentQueryKeys.all,
        'comprehensive',
        String(assignmentId),
        'item-achievement',
    ],
    scoreTimeDistribution: (assignmentId) => [
        ...analysisAssignmentQueryKeys.all,
        'comprehensive',
        String(assignmentId),
        'score-time-distribution',
    ],
    studentSummary: (assignmentId, studentId) => [
        ...analysisAssignmentQueryKeys.all,
        'assignment',
        String(assignmentId),
        'student',
        String(studentId),
        'summary',
    ],
    studentItems: (assignmentId, studentId) => [
        ...analysisAssignmentQueryKeys.all,
        'assignment',
        String(assignmentId),
        'student',
        String(studentId),
        'items',
    ],
    studentLearningAssessmentPerformance: (assignmentId, studentId) => [
        ...analysisAssignmentQueryKeys.all,
        'assignment', String(assignmentId), 'student', String(studentId),
        'learning-assessment-performance',
    ],
    studentComprehensiveAssessmentPerformance: (assignmentId, studentId) => [
        ...analysisAssignmentQueryKeys.all,
        'assignment', String(assignmentId), 'student', String(studentId),
        'comprehensive-assessment-performance',
    ],
    studentCustomLearningSessions: (assignmentId, studentId) => [
        ...analysisAssignmentQueryKeys.all,
        'assignment', String(assignmentId), 'student', String(studentId),
        'custom-learning-sessions',
    ],
    studentReport: (assignmentId, studentId) => [
        ...analysisAssignmentQueryKeys.all,
        'assignment', String(assignmentId), 'student', String(studentId),
        'report',
    ],
};

export const useAnalysisAssignmentsQuery = ({
    classId,
    semester,
    worksheetType,
}) => useQuery({
    queryKey: analysisAssignmentQueryKeys.list({ classId, semester, worksheetType }),
    queryFn: ({ signal }) => getAnalysisAssignments({
        classId,
        semester,
        worksheetType,
        signal,
    }),
    enabled: Boolean(classId && semester),
});

export const useAnalysisOverviewQuery = (assignmentId) => useQuery({
    queryKey: analysisAssignmentQueryKeys.overview(assignmentId),
    queryFn: ({ signal }) => getAnalysisOverview({ assignmentId, signal }),
    enabled: Boolean(assignmentId),
});

export const useAnalysisStudentsQuery = (assignmentId) => useQuery({
    queryKey: analysisAssignmentQueryKeys.students(assignmentId),
    queryFn: ({ signal }) => getAnalysisStudents({ assignmentId, signal }),
    enabled: Boolean(assignmentId),
});

export const useLearningAssessmentInsightsQuery = (assignmentId, enabled) => useQuery({
    queryKey: analysisAssignmentQueryKeys.learningAssessmentInsights(assignmentId),
    queryFn: ({ signal }) => getLearningAssessmentInsights({ assignmentId, signal }),
    enabled: Boolean(assignmentId && enabled),
});

export const useLearningAssessmentAchievementQuery = (assignmentId, enabled) => useQuery({
    queryKey: analysisAssignmentQueryKeys.learningAssessmentAchievement(assignmentId),
    queryFn: ({ signal }) => getLearningAssessmentAchievement({ assignmentId, signal }),
    enabled: Boolean(assignmentId && enabled),
});

export const useComprehensiveAssessmentInsightsQuery = (assignmentId, enabled) => useQuery({
    queryKey: analysisAssignmentQueryKeys.comprehensiveAssessmentInsights(assignmentId),
    queryFn: ({ signal }) => getComprehensiveAssessmentInsights({ assignmentId, signal }),
    enabled: Boolean(assignmentId && enabled),
});

export const useItemAchievementQuery = (assignmentId, enabled) => useQuery({
    queryKey: analysisAssignmentQueryKeys.itemAchievement(assignmentId),
    queryFn: ({ signal }) => getItemAchievement({ assignmentId, signal }),
    enabled: Boolean(assignmentId && enabled),
});

export const useScoreTimeDistributionQuery = (assignmentId, enabled) => useQuery({
    queryKey: analysisAssignmentQueryKeys.scoreTimeDistribution(assignmentId),
    queryFn: ({ signal }) => getScoreTimeDistribution({ assignmentId, signal }),
    enabled: Boolean(assignmentId && enabled),
});

export const useStudentAnalysisSummaryQuery = (assignmentId, studentId) => useQuery({
    queryKey: analysisAssignmentQueryKeys.studentSummary(assignmentId, studentId),
    queryFn: ({ signal }) => getStudentAnalysisSummary({ assignmentId, studentId, signal }),
    enabled: Boolean(assignmentId && studentId),
});

export const useStudentItemResultsQuery = (assignmentId, studentId) => useQuery({
    queryKey: analysisAssignmentQueryKeys.studentItems(assignmentId, studentId),
    queryFn: ({ signal }) => getStudentItemResults({ assignmentId, studentId, signal }),
    enabled: Boolean(assignmentId && studentId),
});

export const useStudentLearningAssessmentPerformanceQuery = (assignmentId, studentId, enabled) => useQuery({
    queryKey: analysisAssignmentQueryKeys.studentLearningAssessmentPerformance(assignmentId, studentId),
    queryFn: ({ signal }) => getStudentLearningAssessmentPerformance({ assignmentId, studentId, signal }),
    enabled: Boolean(assignmentId && studentId && enabled),
});

export const useStudentComprehensiveAssessmentPerformanceQuery = (assignmentId, studentId, enabled) => useQuery({
    queryKey: analysisAssignmentQueryKeys.studentComprehensiveAssessmentPerformance(assignmentId, studentId),
    queryFn: ({ signal }) => getStudentComprehensiveAssessmentPerformance({ assignmentId, studentId, signal }),
    enabled: Boolean(assignmentId && studentId && enabled),
});

export const useStudentCustomLearningSessionsQuery = (assignmentId, studentId) => useQuery({
    queryKey: analysisAssignmentQueryKeys.studentCustomLearningSessions(assignmentId, studentId),
    queryFn: ({ signal }) => getStudentCustomLearningSessions({ assignmentId, studentId, signal }),
    enabled: Boolean(assignmentId && studentId),
});

export const useStudentAnalysisReport = (assignmentId, studentId) => {
    const queryClient = useQueryClient();
    const [reportEnabled, setReportEnabled] = useState(false);
    const [retryAfterMs, setRetryAfterMs] = useState(3000);
    const autoRequestedKey = useRef('');
    const currentTargetKey = useRef('');

    const generationMutation = useMutation({
        mutationFn: ({ requestAssignmentId, requestStudentId }) => requestStudentAnalysisReport({
            assignmentId: requestAssignmentId,
            studentId: requestStudentId,
        }),
        onSuccess: (data, variables) => {
            if (currentTargetKey.current !== `${variables.requestAssignmentId}:${variables.requestStudentId}`) return;
            const nextRetryAfterMs = Number(data?.retryAfterMs);
            setRetryAfterMs(nextRetryAfterMs > 0 ? nextRetryAfterMs : 3000);
            setReportEnabled(true);
        },
        onError: (_error, variables) => {
            if (currentTargetKey.current === `${variables.requestAssignmentId}:${variables.requestStudentId}`) {
                setReportEnabled(false);
            }
        },
    });

    const requestGeneration = useCallback(() => {
        if (!assignmentId || !studentId) return;
        currentTargetKey.current = `${assignmentId}:${studentId}`;
        setReportEnabled(false);
        queryClient.removeQueries({
            queryKey: analysisAssignmentQueryKeys.studentReport(assignmentId, studentId),
            exact: true,
        });
        generationMutation.mutate({
            requestAssignmentId: assignmentId,
            requestStudentId: studentId,
        });
    }, [assignmentId, generationMutation.mutate, queryClient, studentId]);

    useEffect(() => {
        const requestKey = assignmentId && studentId
            ? `${assignmentId}:${studentId}`
            : '';

        setReportEnabled(false);
        currentTargetKey.current = requestKey;
        if (!requestKey) {
            autoRequestedKey.current = '';
            return;
        }
        if (autoRequestedKey.current === requestKey) return;

        autoRequestedKey.current = requestKey;
        queryClient.removeQueries({
            queryKey: analysisAssignmentQueryKeys.studentReport(assignmentId, studentId),
            exact: true,
        });
        generationMutation.mutate({
            requestAssignmentId: assignmentId,
            requestStudentId: studentId,
        });
    }, [assignmentId, generationMutation.mutate, queryClient, studentId]);

    const reportQuery = useQuery({
        queryKey: analysisAssignmentQueryKeys.studentReport(assignmentId, studentId),
        queryFn: ({ signal }) => getStudentAnalysisReport({ assignmentId, studentId, signal }),
        enabled: Boolean(assignmentId && studentId && reportEnabled),
        refetchInterval: (query) => {
            const status = query.state.data?.generationStatus;
            return status === ReportGenerationStatus.PENDING
                || status === ReportGenerationStatus.GENERATING
                ? retryAfterMs
                : false;
        },
    });

    const mutationError = assignmentId && studentId
        ? generationMutation.error
        : null;
    return {
        generationMutation,
        reportQuery,
        retry: requestGeneration,
        error: mutationError ?? reportQuery.error,
        errorUpdatedAt: mutationError
            ? generationMutation.submittedAt
            : reportQuery.errorUpdatedAt,
    };
};
