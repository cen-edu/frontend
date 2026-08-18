import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getWorksheets } from '../../../api/problems/worksheetApi.js';

const gradeValues = {
    'middle-1': 1,
    'middle-2': 2,
    'middle-3': 3,
};

const formatCreatedAt = (createdAt) => {
    if (!createdAt) return '-';

    const date = new Date(createdAt);

    if (Number.isNaN(date.getTime())) return createdAt;

    return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(date).replaceAll(' ', '').replace(/\.$/, '');
};

const normalizeWorksheet = (worksheet) => ({
    ...worksheet,
    id: worksheet.worksheetId,
    gradeId: worksheet.grade ? `middle-${worksheet.grade}` : null,
    term: worksheet.semester,
    createdAt: formatCreatedAt(worksheet.createdAt),
    totalScore: worksheet.totalScore || null,
    assignmentCount: worksheet.assignmentCount ?? 0,
    custom: worksheet.origin === 'custom'
        ? { sourceWorksheetId: worksheet.sourceWorksheetId }
        : null,
});

export const problemLibraryQueryKeys = {
    all: ['teacher', 'worksheets'],
    list: (params) => [...problemLibraryQueryKeys.all, 'list', params],
};

export const useProblemLibraryQuery = ({ tab, gradeId, semester, q }) => {
    const params = {
        tab,
        grade: gradeValues[gradeId],
        semester: semester === 'all' ? undefined : semester,
        q: q.trim() || undefined,
    };

    return useQuery({
        queryKey: problemLibraryQueryKeys.list(params),
        queryFn: ({ signal }) => getWorksheets({ ...params, signal }),
        select: (data) => (data?.worksheets ?? []).map(normalizeWorksheet),
        placeholderData: keepPreviousData,
    });
};
