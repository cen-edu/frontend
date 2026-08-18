import { useMutation } from '@tanstack/react-query';
import { createWorksheet } from '../../api/problems/worksheetApi.js';
import { buildWorksheetSavePayload } from './worksheetSaveAdapter.js';

export const useWorksheetSaveMutation = () => useMutation({
    mutationFn: (worksheet) => createWorksheet(buildWorksheetSavePayload(worksheet)),
});
