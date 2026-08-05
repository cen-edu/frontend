const baseAssignments = [
    {
        id: 'factor-practice',
        sourceWorksheetId: null,
        title: '2단원 소인수분해 연습',
        type: 'practice',
        status: 'in-progress',
        assignedAt: '2026.08.01',
        dueAt: '2026.08.07 18:00',
        doneUnits: 6,
        totalUnits: 10,
    },
    {
        id: 'factor-custom',
        sourceWorksheetId: 'factor-practice',
        title: '공통소인수 맞춤 학습',
        type: 'practice',
        origin: 'custom',
        status: 'not-started',
        assignedAt: '2026.08.03',
        dueAt: '2026.08.07 18:00',
        doneUnits: 0,
        totalUnits: 9,
        stages: ['retrace', 'basic', 'independent'],
    },
    {
        id: 'factor-assessment',
        sourceWorksheetId: null,
        title: '2단원 소인수분해 종합 평가',
        type: 'assessment',
        status: 'not-started',
        assignedAt: '2026.08.04',
        dueAt: '2026.08.08 18:00',
        doneUnits: 0,
        totalUnits: 10,
    },
    {
        id: 'integer-practice',
        sourceWorksheetId: null,
        title: '1단원 정수와 유리수 연습',
        type: 'practice',
        status: 'submitted',
        assignedAt: '2026.07.24',
        dueAt: '2026.07.31 18:00',
        submittedAt: '2026.07.30 16:42',
        doneUnits: 10,
        totalUnits: 10,
        correctUnits: 8,
        resultReady: true,
    },
    {
        id: 'integer-assessment',
        sourceWorksheetId: null,
        title: '1단원 정수와 유리수 종합 평가',
        type: 'assessment',
        status: 'submitted',
        assignedAt: '2026.07.18',
        dueAt: '2026.07.25 18:00',
        submittedAt: '2026.07.25 14:08',
        doneUnits: 10,
        totalUnits: 10,
        score: 91,
        grading: 'done',
        resultReady: true,
    },
];

export const studentAssignmentTypeLabels = {
    practice: '일반 학습',
    assessment: '종합 평가',
};

export const studentAssignmentStatusLabels = {
    'not-started': '미시작',
    'in-progress': '학습 중',
    submitted: '제출 완료',
};

export const customStageLabels = {
    retrace: '되짚기',
    basic: '기본',
    independent: '응용',
};

export const getStudentAssignments = (studentId) => {
    const progressOffset = Number(studentId) % 3;

    return baseAssignments.map((assignment) => assignment.id === 'factor-practice'
        ? { ...assignment, doneUnits: Math.min(assignment.totalUnits, assignment.doneUnits + progressOffset) }
        : { ...assignment });
};
