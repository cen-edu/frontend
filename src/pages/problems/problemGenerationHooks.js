import { useMutation } from '@tanstack/react-query';
import {
    getPracticeProblemGenerationJob,
    startPracticeProblemGeneration,
} from '../../api/problems/problemGenerationApi.js';
import {
    buildProblemGenerationItems,
    normalizeAuthoringGenerationSlots,
} from './problemGenerationAdapter.js';

const POLLING_INTERVAL_MS = 1000;
const TERMINAL_JOB_STATUSES = new Set(['COMPLETED', 'PARTIALLY_FAILED', 'FAILED']);

const wait = (duration) => new Promise((resolve) => {
    window.setTimeout(resolve, duration);
});

const waitForGenerationJob = async (jobId) => {
    while (true) {
        const job = await getPracticeProblemGenerationJob({ jobId });

        if (TERMINAL_JOB_STATUSES.has(job.status)) return job;
        await wait(POLLING_INTERVAL_MS);
    }
};

export const useProblemGenerationMutation = () => useMutation({
    mutationFn: async (configs) => {
        const items = buildProblemGenerationItems(configs);
        const startedJob = await startPracticeProblemGeneration({
            clientRequestId: crypto.randomUUID(),
            items,
        });
        const completedJob = await waitForGenerationJob(startedJob.jobId);

        if (completedJob.status !== 'COMPLETED') {
            throw new Error('일부 문제를 생성하지 못했습니다. 출제 구성을 확인한 뒤 다시 시도해 주세요.');
        }

        const problems = normalizeAuthoringGenerationSlots(completedJob.slots, configs);

        if (!problems?.length) {
            throw new Error('생성된 문제가 없습니다. 출제 구성을 확인한 뒤 다시 시도해 주세요.');
        }

        return problems;
    },
});
