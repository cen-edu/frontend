import { useMutation } from '@tanstack/react-query';
import { startAssessmentProblemGeneration } from '../../api/problems/assessmentGenerationApi.js';
import { getPracticeProblemGenerationJob } from '../../api/problems/problemGenerationApi.js';
import {
    buildAssessmentGenerationItems,
    normalizeAssessmentGenerationSlots,
} from './assessmentGenerationAdapter.js';
import { hydrateProblemAssetPreviews } from './problemAssetPreview.js';

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

export const useAssessmentGenerationMutation = () => useMutation({
    mutationFn: async (groups) => {
        const items = buildAssessmentGenerationItems(groups);
        const startedJob = await startAssessmentProblemGeneration({
            clientRequestId: crypto.randomUUID(),
            items,
        });
        const completedJob = await waitForGenerationJob(startedJob.jobId);

        if (completedJob.status !== 'COMPLETED') {
            throw new Error('일부 평가 문항을 생성하지 못했습니다. 출제 구성을 확인한 뒤 다시 시도해 주세요.');
        }

        const normalizedProblems = normalizeAssessmentGenerationSlots(completedJob.slots, groups);

        if (!normalizedProblems.length) {
            throw new Error('생성된 평가 문항이 없습니다. 출제 구성을 확인한 뒤 다시 시도해 주세요.');
        }

        return Promise.all(normalizedProblems.map((problem) => (
            hydrateProblemAssetPreviews({ problem })
        )));
    },
});
