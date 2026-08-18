import { useQuery } from '@tanstack/react-query';
import { getAnalysisAssignments } from '../../../api/analysis/analysisApi.js';

export const analysisAssignmentQueryKeys = {
    all: ['teacher', 'analysis', 'assignments'],
    list: ({ classId, semester, worksheetType }) => [
        ...analysisAssignmentQueryKeys.all,
        { classId, semester, worksheetType: worksheetType || null },
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
