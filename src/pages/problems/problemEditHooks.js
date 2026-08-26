import { useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
    getProblemAuthoringPreview,
    getProblemAuthoringStatus,
    requestProblemEditTurn,
} from '../../api/problems/problemEditApi.js';
import { buildProblemEditTarget, normalizeEditedProblem } from './problemEditAdapter.js';
import { hydrateProblemAssetPreviews } from './problemAssetPreview.js';

const STATUS_POLLING_INTERVAL_MS = 1000;
const STATUS_POLLING_TIMEOUT_MS = 120000;

const wait = (duration, signal) => new Promise((resolve, reject) => {
    const finish = () => {
        signal.removeEventListener('abort', abort);
        resolve();
    };
    const timeoutId = window.setTimeout(finish, duration);
    const abort = () => {
        window.clearTimeout(timeoutId);
        reject(new DOMException('편집 요청이 취소되었습니다.', 'AbortError'));
    };

    signal.addEventListener('abort', abort, { once: true });
});

const waitForReadySession = async ({ sessionId, signal, onStatusChange }) => {
    const startedAt = Date.now();

    while (true) {
        const status = await getProblemAuthoringStatus({ sessionId, signal });
        onStatusChange(status.operationStatus);

        if (status.errorCode || status.operationStatus === 'FAILED') {
            throw new Error('수정된 문제를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');
        }

        if (status.operationStatus === 'IDLE' && status.readyForFinalization === true) {
            return status;
        }

        if (Date.now() - startedAt >= STATUS_POLLING_TIMEOUT_MS) {
            throw new Error('문제 수정 시간이 길어지고 있습니다. 잠시 후 다시 요청해 주세요.');
        }

        await wait(STATUS_POLLING_INTERVAL_MS, signal);
    }
};

export const useProblemEditMutation = () => {
    const controllerRef = useRef(null);
    const [operationStatus, setOperationStatus] = useState(null);
    const mutation = useMutation({
        mutationFn: async ({ currentProblem, target, userInput, history = [] }) => {
            controllerRef.current?.abort();
            const controller = new AbortController();
            controllerRef.current = controller;
            setOperationStatus(null);

            const selectedTarget = buildProblemEditTarget(target);

            if (!selectedTarget) {
                throw new Error('선택한 편집 영역의 식별 정보를 찾지 못했습니다. 영역을 다시 선택해 주세요.');
            }

            const sessionId = currentProblem.sessionId;
            const turn = await requestProblemEditTurn({
                sessionId,
                userInput: userInput.trim(),
                history,
                selectedTarget,
                signal: controller.signal,
            });

            if (turn.action !== 'CONFIRM_EXECUTION') {
                return { turn, problem: null };
            }

            await waitForReadySession({
                sessionId,
                signal: controller.signal,
                onStatusChange: setOperationStatus,
            });
            const preview = await getProblemAuthoringPreview({
                sessionId,
                signal: controller.signal,
            });
            const normalizedProblem = normalizeEditedProblem({ preview, currentProblem });
            const problem = await hydrateProblemAssetPreviews({
                problem: normalizedProblem,
                signal: controller.signal,
            });

            return {
                turn,
                problem,
            };
        },
    });

    useEffect(() => () => controllerRef.current?.abort(), []);

    const cancel = () => {
        controllerRef.current?.abort();
        controllerRef.current = null;
        setOperationStatus(null);
        mutation.reset();
    };

    return {
        ...mutation,
        operationStatus,
        cancel,
    };
};
