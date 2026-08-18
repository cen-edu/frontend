import { worksheetTypeLabels } from '../../../mocks/labels';

export const learningTypeLabels = worksheetTypeLabels;

export function getProgress(assignment, student) {
    const totalUnits = student.totalUnits ?? assignment.totalUnits;
    if (!totalUnits) return 0;
    return Math.round((student.doneUnits / totalUnits) * 100);
}

export function getProgressLabel(assignment, student) {
    const unitLabel = assignment.type === 'assessment' ? '문항' : '풀이';
    const suffix = assignment.type === 'assessment' ? '' : '칸';
    const totalUnits = student.totalUnits ?? assignment.totalUnits;
    return `${unitLabel} ${student.doneUnits}/${totalUnits}${suffix}`;
}

// 원본 학습지에서 파생된 맞춤 학습. 목록 필터와 무관하게 찾아야 하므로 전체 배정 목록을 넘긴다.
export function getDerivedCustomAssignments(assignments, sourceId) {
    if (!sourceId) return [];
    return assignments.filter((assignment) => (
        assignment.origin === 'custom'
        && String(assignment.sourceAssignmentId) === String(sourceId)
    ));
}

export function getDueStatus(dueAt, now = new Date()) {
    const dueDate = new Date(dueAt);
    if (Number.isNaN(dueDate.getTime())) return null;
    if (dueDate < now) return { label: '마감 지남', tone: 'overdue' };

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dueDay = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
    const daysLeft = Math.round((dueDay - today) / 86400000);
    if (daysLeft === 0) return { label: 'D-DAY', tone: 'today' };
    if (daysLeft === 1) return { label: 'D-1', tone: 'soon' };
    return null;
}

export function formatDateTime(value, { includeYear = true } = {}) {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';

    const parts = new Intl.DateTimeFormat('ko-KR', {
        ...(includeYear ? { year: 'numeric' } : {}),
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).formatToParts(date);
    const values = Object.fromEntries(parts.map(({ type, value: partValue }) => [type, partValue]));
    const datePart = includeYear
        ? `${values.year}.${values.month}.${values.day}`
        : `${values.month}.${values.day}`;
    return `${datePart} ${values.hour}:${values.minute}`;
}
