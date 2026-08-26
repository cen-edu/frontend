import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    assignWorksheet,
    createWorksheet,
    getWorksheetGenSpec,
} from '../../api/problems/worksheetApi.js';
import { buildWorksheetSavePayload } from './worksheetSaveAdapter.js';
import { normalizeWorksheetGenSpec } from './worksheetGenSpecAdapter.js';

export const worksheetGenSpecQueryKeys = {
    all: ['teacher', 'worksheets', 'gen-spec'],
    detail: (worksheetId) => [...worksheetGenSpecQueryKeys.all, worksheetId],
};

export const useWorksheetGenSpecQuery = (worksheetId) => {
    const normalizedWorksheetId = Number(worksheetId);
    const enabled = Number.isInteger(normalizedWorksheetId) && normalizedWorksheetId > 0;

    return useQuery({
        queryKey: worksheetGenSpecQueryKeys.detail(normalizedWorksheetId),
        queryFn: ({ signal }) => getWorksheetGenSpec({
            worksheetId: normalizedWorksheetId,
            signal,
        }),
        select: normalizeWorksheetGenSpec,
        enabled,
    });
};

export const useWorksheetSaveMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (worksheet) => createWorksheet(buildWorksheetSavePayload(worksheet)),
        onSuccess: () => queryClient.invalidateQueries({
            queryKey: ['teacher', 'worksheets', 'list'],
            refetchType: 'all',
        }),
    });
};

export const useWorksheetAssignmentMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: assignWorksheet,
        onSuccess: () => Promise.all([
            queryClient.invalidateQueries({ queryKey: ['teacher', 'worksheets'] }),
            queryClient.invalidateQueries({ queryKey: ['teacher', 'learning-status'] }),
            queryClient.invalidateQueries({ queryKey: ['teacher', 'analysis'] }),
        ]),
    });
};
