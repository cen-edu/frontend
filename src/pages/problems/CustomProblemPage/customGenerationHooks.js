import { useMutation, useQuery } from '@tanstack/react-query';
import {
    getPracticeProblemGenerationJob,
    startCustomProblemGeneration,
} from '../../../api/problems/problemGenerationApi.js';

const POLLING_INTERVAL_MS = 1000;
const TERMINAL_JOB_STATUSES = new Set(['COMPLETED', 'PARTIALLY_FAILED', 'FAILED']);

export const customGenerationQueryKeys = {
    job: (jobId) => ['teacher', 'custom-problems', 'generation-job', Number(jobId)],
};

export const useCustomProblemGenerationMutation = () => useMutation({
    mutationFn: startCustomProblemGeneration,
});

export const useCustomProblemGenerationJobQuery = (jobId) => {
    const normalizedJobId = Number(jobId);

    return useQuery({
        queryKey: customGenerationQueryKeys.job(normalizedJobId),
        queryFn: ({ signal }) => getPracticeProblemGenerationJob({
            jobId: normalizedJobId,
            signal,
        }),
        enabled: Number.isInteger(normalizedJobId) && normalizedJobId > 0,
        refetchInterval: (query) => (
            TERMINAL_JOB_STATUSES.has(query.state.data?.status)
                ? false
                : POLLING_INTERVAL_MS
        ),
    });
};
