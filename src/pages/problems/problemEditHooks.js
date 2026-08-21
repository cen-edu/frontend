import { useMutation } from '@tanstack/react-query';
import {
    getProblemAuthoringPreview,
    getProblemAuthoringStatus,
    requestProblemEditTurn,
} from '../../api/problems/problemEditApi.js';
import { buildProblemEditTarget, normalizeEditedProblem } from './problemEditAdapter.js';

const STATUS_POLLING_INTERVAL_MS = 1000;

const wait = (duration) => new Promise((resolve) => {
    window.setTimeout(resolve, duration);
});

const waitForIdleSession = async (sessionId) => {
    while (true) {
        const status = await getProblemAuthoringStatus({ sessionId });

        if (status.errorCode) {
            throw new Error('수정된 문제를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');
        }

        if (status.operationStatus === 'IDLE' && status.pendingVersionId == null) {
            return status;
        }

        await wait(STATUS_POLLING_INTERVAL_MS);
    }
};

export const useProblemEditMutation = () => useMutation({
    mutationFn: async ({ currentProblem, target, userInput }) => {
        const sessionId = currentProblem.sessionId;
        const turn = await requestProblemEditTurn({
            sessionId,
            userInput: userInput.trim(),
            history: [],
            selectedTarget: buildProblemEditTarget(target),
        });

        if (turn.action !== 'CONFIRM_EXECUTION') {
            return { turn, problem: null };
        }

        await waitForIdleSession(sessionId);
        const preview = await getProblemAuthoringPreview({ sessionId });

        return {
            turn,
            problem: normalizeEditedProblem({ preview, currentProblem }),
        };
    },
});
