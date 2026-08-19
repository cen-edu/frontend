import { useQuery } from '@tanstack/react-query';
import {
    getDashboardAssignments,
    getDashboardStudentProgress,
    getDashboardSummary,
} from '../../../api/dashboard/dashboardApi.js';

const enabled = ({ classId, semester }) => Number(classId) > 0 && ['1', '2'].includes(String(semester));

export const dashboardQueryKeys = {
    all: ['teacher', 'dashboard'],
    summary: ({ classId, semester }) => ['teacher', 'dashboard', 'summary', String(classId), String(semester)],
    studentProgress: ({ classId, semester }) => ['teacher', 'dashboard', 'student-progress', String(classId), String(semester)],
    assignments: ({ classId, semester }) => ['teacher', 'dashboard', 'assignments', String(classId), String(semester)],
};

export const useDashboardSummaryQuery = (params) => useQuery({
    queryKey: dashboardQueryKeys.summary(params),
    queryFn: ({ signal }) => getDashboardSummary({ ...params, signal }),
    enabled: enabled(params),
});

export const useDashboardStudentProgressQuery = (params) => useQuery({
    queryKey: dashboardQueryKeys.studentProgress(params),
    queryFn: ({ signal }) => getDashboardStudentProgress({ ...params, signal }),
    enabled: enabled(params),
});

export const useDashboardAssignmentsQuery = (params) => useQuery({
    queryKey: dashboardQueryKeys.assignments(params),
    queryFn: async ({ signal }) => {
        const firstPage = await getDashboardAssignments({ ...params, page: 0, size: 100, signal });
        const totalPages = firstPage.page?.totalPages ?? 0;

        if (totalPages <= 1) return firstPage;

        const remainingPages = await Promise.all(
            Array.from({ length: totalPages - 1 }, (_, index) => getDashboardAssignments({
                ...params,
                page: index + 1,
                size: 100,
                signal,
            })),
        );

        return {
            ...firstPage,
            assignments: [
                ...(firstPage.assignments ?? []),
                ...remainingPages.flatMap((page) => page.assignments ?? []),
            ],
        };
    },
    enabled: enabled(params),
});

