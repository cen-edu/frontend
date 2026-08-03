export const learningTypeLabels = {
    practice: '일반 학습',
    assessment: '종합 평가',
};

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

export function getDueStatus(dueAt, now = new Date()) {
    const dueDate = new Date(dueAt.replaceAll('.', '-').replace(' ', 'T'));
    if (Number.isNaN(dueDate.getTime())) return null;
    if (dueDate < now) return { label: '마감 지남', tone: 'overdue' };

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dueDay = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
    const daysLeft = Math.round((dueDay - today) / 86400000);
    if (daysLeft === 0) return { label: 'D-DAY', tone: 'today' };
    if (daysLeft === 1) return { label: 'D-1', tone: 'soon' };
    return null;
}
