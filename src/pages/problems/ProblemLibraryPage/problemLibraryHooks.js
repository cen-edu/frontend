import {
    keepPreviousData,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';
import {
    deleteWorksheet,
    getWorksheet,
    getWorksheets,
} from '../../../api/problems/worksheetApi.js';
import { normalizeGeneratedAssessmentProblems } from '../assessmentGenerationAdapter.js';
import { normalizeGeneratedProblems } from '../problemGenerationAdapter.js';

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
    totalScore: worksheet.totalScore ?? null,
    assignmentCount: worksheet.assignmentCount ?? 0,
    custom: worksheet.origin === 'custom'
        ? { sourceWorksheetId: worksheet.sourceWorksheetId }
        : null,
});

const normalizeEnum = (value) => value?.toLowerCase().replaceAll('_', '-') ?? null;

const formatAssignmentDate = (value, includeTime = false) => {
    if (!value) return '-';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        ...(includeTime ? { hour: '2-digit', minute: '2-digit', hour12: false } : {}),
    }).format(date).replaceAll(' ', '').replace(/\.$/, '');
};

const normalizeWorksheetDetail = (worksheet) => {
    const type = normalizeEnum(worksheet.type);
    const assignments = (worksheet.assignments ?? []).map((assignment) => ({
        ...assignment,
        status: normalizeEnum(assignment.status),
        assignedAt: formatAssignmentDate(assignment.assignedAt),
        dueAt: formatAssignmentDate(assignment.dueAt, true),
    }));
    const items = [...(worksheet.items ?? [])].sort((left, right) => (
        (left.displayOrder ?? 0) - (right.displayOrder ?? 0)
    ));
    const questions = items.map((item) => item.question ?? {});
    const normalizedQuestions = type === 'assessment'
        ? normalizeGeneratedAssessmentProblems(questions)
        : normalizeGeneratedProblems(questions);

    return {
        ...normalizeWorksheet(worksheet),
        type,
        origin: normalizeEnum(worksheet.origin),
        status: normalizeEnum(worksheet.status),
        problemCount: items.length,
        assignmentCount: assignments.length,
        assignments,
        problems: normalizedQuestions.map((problem, index) => ({
            ...problem,
            worksheetItemId: items[index].worksheetItemId,
            no: items[index].displayOrder ?? index + 1,
            maxScore: items[index].maxScore ?? problem.maxScore,
            supportMode: normalizeEnum(items[index].supportMode),
            stage: normalizeEnum(items[index].customStage),
        })),
    };
};

export const problemLibraryQueryKeys = {
    all: ['teacher', 'worksheets'],
    list: (params) => [...problemLibraryQueryKeys.all, 'list', params],
    detail: (worksheetId) => [...problemLibraryQueryKeys.all, 'detail', worksheetId],
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

export const useProblemLibraryDetailQuery = (worksheetId) => useQuery({
    queryKey: problemLibraryQueryKeys.detail(worksheetId),
    queryFn: ({ signal }) => getWorksheet({ worksheetId, signal }),
    select: normalizeWorksheetDetail,
    enabled: Boolean(worksheetId),
});

export const useDeleteWorksheetMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteWorksheet,
        onSuccess: () => queryClient.invalidateQueries({
            queryKey: problemLibraryQueryKeys.all,
        }),
    });
};
