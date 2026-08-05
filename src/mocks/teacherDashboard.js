export const dashboardFilterOptions = {
    years: [
        { value: '2026', label: '2026학년도' },
        { value: '2025', label: '2025학년도' },
    ],
    grades: [
        { value: 'middle-1', label: '1학년' },
    ],
    classes: [
        { value: 'middle-1-1', label: '1반' },
        { value: 'middle-1-2', label: '2반' },
    ],
    terms: [
        { value: 'first', label: '1학기' },
        { value: 'second', label: '2학기' },
    ],
};

export const worksheetTypeLabels = { practice: '일반 학습', assessment: '종합평가' };
export const resultStatusLabels = { submitted: '제출 완료', inProgress: '풀이 중', notStarted: '미시작', unassigned: '미배정' };
export const studentStatusLabels = { overdue: '미제출 지연', weak: '보완 필요', steady: '양호', noData: '자료 부족' };
export const weakAccuracyThreshold = 60;

// 오늘 기준 날짜. 기한 초과 판정에 사용한다.
const today = '2026.08.04';

const classOneRoster = [
    { id: '101', number: 1, name: '김민수' },
    { id: '102', number: 2, name: '박지수' },
    { id: '103', number: 3, name: '정도윤' },
    { id: '104', number: 4, name: '조현우' },
    { id: '105', number: 5, name: '이서윤' },
    { id: '106', number: 6, name: '한예린' },
    { id: '107', number: 7, name: '윤하준' },
    { id: '108', number: 8, name: '오서아' },
];

const classTwoRoster = [
    { id: '201', number: 1, name: '서지민' },
    { id: '202', number: 2, name: '강도현' },
    { id: '203', number: 3, name: '김나윤' },
    { id: '204', number: 4, name: '문시우' },
    { id: '205', number: 5, name: '배서아' },
];

const done = (accuracy, completedAt) => ({ status: 'submitted', accuracy, completedAt });
const scored = (score, completedAt) => ({ status: 'submitted', accuracy: score, score, grading: 'done', completedAt });
const awaiting = (completedAt) => ({ status: 'submitted', accuracy: null, score: null, grading: 'pending', completedAt });
const solving = { status: 'inProgress', accuracy: null };
const idle = { status: 'notStarted', accuracy: null };

const classOneFirstTerm = {
    updatedAt: '오늘 오전 10:30 기준',
    roster: classOneRoster,
    worksheets: [
        {
            id: 'unit-2-practice', title: '2단원 연습', type: 'practice', origin: 'manual',
            analysisId: 'factor-practice', resultId: 'unit-2-practice',
            assignedAt: '2026.06.24', dueAt: '2026.06.27', status: 'completed',
            results: {
                101: done(45, '06.26'), 102: done(56, '06.27'), 103: done(50, '06.26'), 104: done(68, '06.25'),
                105: done(61, '06.27'), 106: done(80, '06.25'), 107: done(54, '06.27'), 108: done(85, '06.25'),
            },
        },
        {
            id: 'factor-practice-review', title: '소인수분해 개념 복습', type: 'practice', origin: 'manual',
            analysisId: 'factor-practice', resultId: 'factor-practice-review',
            assignedAt: '2026.07.06', dueAt: '2026.07.09', status: 'completed',
            results: {
                101: done(50, '07.09'), 102: done(62, '07.08'), 103: done(47, '07.09'), 104: done(74, '07.07'),
                105: done(66, '07.08'), 106: done(85, '07.07'), 107: idle, 108: done(90, '07.07'),
            },
        },
        {
            id: 'gcd-lcm-assessment', title: '최대공약수와 최소공배수 평가', type: 'assessment', origin: 'manual',
            analysisId: 'factor-assessment', resultId: 'gcd-lcm-assessment', maxScore: 100,
            assignedAt: '2026.07.13', dueAt: '2026.07.16', status: 'completed',
            results: {
                101: scored(44, '07.16'), 102: scored(55, '07.15'), 103: scored(52, '07.16'), 104: scored(70, '07.15'),
                105: scored(60, '07.16'), 106: scored(82, '07.14'), 107: scored(58, '07.16'), 108: scored(88, '07.14'),
            },
        },
        {
            id: 'factor-custom', title: '공통소인수 맞춤 학습', type: 'practice', origin: 'custom',
            analysisId: 'factor-practice', resultId: null,
            assignedAt: '2026.07.21', dueAt: '2026.07.25', status: 'completed',
            results: {
                101: done(58, '07.24'), 103: done(55, '07.25'), 105: done(70, '07.25'), 107: idle,
            },
        },
        {
            id: 'factor-assessment', title: '2단원 소인수분해 종합 평가', type: 'assessment', origin: 'manual',
            analysisId: 'factor-assessment', resultId: 'factor-assessment', maxScore: 100,
            assignedAt: '2026.07.29', dueAt: '2026.08.06', status: 'ongoing',
            results: {
                101: scored(47, '08.01'), 102: awaiting('08.01'), 103: solving, 104: scored(73, '07.31'),
                105: scored(66, '08.02'), 106: scored(84, '07.30'), 107: idle, 108: awaiting('07.30'),
            },
        },
        {
            id: 'factor-practice', title: '2단원 소인수분해 연습', type: 'practice', origin: 'manual',
            analysisId: 'factor-practice', resultId: null,
            assignedAt: '2026.08.01', dueAt: '2026.08.07', status: 'ongoing',
            results: {
                101: solving, 102: done(63, '08.03'), 103: idle, 104: done(72, '08.02'),
                105: solving, 106: done(86, '08.02'), 107: idle, 108: done(91, '08.02'),
            },
        },
    ],
    concepts: [
        { id: 'common', label: '공통소인수', accuracy: 44, weakStudentIds: ['101', '103', '107'] },
        { id: 'gcd', label: '최대공약수', accuracy: 52, weakStudentIds: ['101', '102', '103'] },
        { id: 'exponent', label: '지수 비교', accuracy: 58, weakStudentIds: ['101', '103', '105'] },
        { id: 'lcm', label: '최소공배수', accuracy: 63, weakStudentIds: ['102', '107'] },
        { id: 'prime-factor', label: '소인수', accuracy: 71, weakStudentIds: ['103'] },
        { id: 'power', label: '거듭제곱', accuracy: 76, weakStudentIds: ['101'] },
        { id: 'prime', label: '소인수분해', accuracy: 82, weakStudentIds: [] },
    ],
};

const classOneSecondTerm = {
    updatedAt: '오늘 오전 10:30 기준',
    roster: classOneRoster,
    worksheets: [
        {
            id: 'linear-equation-practice', title: '일차방정식 개념 확인', type: 'practice', origin: 'manual',
            analysisId: 'factor-practice', resultId: null,
            assignedAt: '2026.08.03', dueAt: '2026.08.10', status: 'ongoing',
            results: {
                101: idle, 102: solving, 103: idle, 104: done(69, '08.04'),
                105: idle, 106: done(81, '08.04'), 107: idle, 108: solving,
            },
        },
    ],
    // 배정 직후라 개념별 누적 정답률을 낼 만큼 응답이 모이지 않은 학기.
    concepts: [],
};

const classTwoFirstTerm = {
    updatedAt: '어제 오후 5:00 기준',
    roster: classTwoRoster,
    worksheets: [
        {
            id: 'integer-practice-class2', title: '1단원 정수와 유리수 연습', type: 'practice', origin: 'manual',
            analysisId: 'factor-practice', resultId: null,
            assignedAt: '2026.07.06', dueAt: '2026.07.10', status: 'completed',
            results: {
                201: done(91, '07.09'), 202: done(84, '07.10'), 203: done(62, '07.10'), 204: done(89, '07.08'), 205: idle,
            },
        },
        {
            id: 'integer-unit-test', title: '1단원 정수와 유리수 종합 평가', type: 'assessment', origin: 'manual',
            analysisId: 'factor-assessment', resultId: null, maxScore: 100,
            assignedAt: '2026.07.27', dueAt: '2026.07.31', status: 'completed',
            results: {
                201: scored(88, '07.31'), 202: scored(80, '07.31'), 203: scored(58, '07.31'), 204: scored(85, '07.31'), 205: idle,
            },
        },
        {
            id: 'factor-practice-class2', title: '2단원 소인수분해 연습', type: 'practice', origin: 'manual',
            analysisId: 'factor-practice', resultId: null,
            assignedAt: '2026.08.01', dueAt: '2026.08.07', status: 'ongoing',
            results: {
                201: done(84, '08.03'), 202: done(76, '08.03'), 203: done(55, '08.03'), 204: done(82, '08.02'), 205: idle,
            },
        },
    ],
    concepts: [
        { id: 'gcd', label: '최대공약수', accuracy: 57, weakStudentIds: ['203'] },
        { id: 'lcm', label: '최소공배수', accuracy: 66, weakStudentIds: ['203', '202'] },
        { id: 'prime-factor', label: '소인수', accuracy: 79, weakStudentIds: [] },
    ],
};

const classTwoSecondTerm = {
    updatedAt: '어제 오후 5:00 기준',
    roster: classTwoRoster,
    worksheets: [],
    concepts: [],
};

export const dashboardClassTerms = {
    'middle-1-1:first': classOneFirstTerm,
    'middle-1-1:second': classOneSecondTerm,
    'middle-1-2:first': classTwoFirstTerm,
    'middle-1-2:second': classTwoSecondTerm,
};

export function getClassTerm(classId, term) {
    return dashboardClassTerms[`${classId}:${term}`] ?? { updatedAt: '', roster: [], worksheets: [], concepts: [] };
}

const isOverdue = (worksheet) => worksheet.dueAt < today;
const average = (values) => (values.length === 0 ? null : Math.round(values.reduce((sum, value) => sum + value, 0) / values.length));

// 학기에 배정된 모든 학습지를 학생 단위로 누적한다.
export function getStudentProgress(classTerm) {
    const conceptsByAccuracy = [...classTerm.concepts].sort((first, second) => first.accuracy - second.accuracy);

    return classTerm.roster.map((student) => {
        const results = classTerm.worksheets.map((worksheet) => {
            const result = worksheet.results[student.id];
            return {
                worksheetId: worksheet.id,
                title: worksheet.title,
                type: worksheet.type,
                origin: worksheet.origin,
                dueAt: worksheet.dueAt,
                status: result?.status ?? 'unassigned',
                accuracy: result?.accuracy ?? null,
                score: result?.score ?? null,
                grading: result?.grading ?? null,
                completedAt: result?.completedAt ?? null,
                overdue: Boolean(result) && result.status !== 'submitted' && isOverdue(worksheet),
            };
        });

        const assigned = results.filter((result) => result.status !== 'unassigned');
        const submitted = assigned.filter((result) => result.status === 'submitted');
        const overdue = assigned.filter((result) => result.overdue);
        const accuracy = average(results.filter((result) => result.accuracy !== null).map((result) => result.accuracy));
        const weakConcept = conceptsByAccuracy.find((concept) => concept.weakStudentIds.includes(student.id)) ?? null;
        const lastActivity = submitted.map((result) => result.completedAt).sort().at(-1) ?? null;

        return {
            ...student,
            results,
            assignedCount: assigned.length,
            submittedCount: submitted.length,
            pendingCount: assigned.length - submitted.length,
            overdueCount: overdue.length,
            participation: assigned.length === 0 ? 0 : Math.round((submitted.length / assigned.length) * 100),
            accuracy,
            weakConcept,
            lastActivity,
            status: overdue.length > 0 ? 'overdue' : accuracy === null ? 'noData' : accuracy < weakAccuracyThreshold ? 'weak' : 'steady',
        };
    });
}

// 학습지 한 개의 반 전체 진행 상태. 유형에 따라 대표 지표가 달라진다.
export function getWorksheetSummary(classTerm) {
    return classTerm.worksheets.map((worksheet) => {
        const results = Object.values(worksheet.results);
        const submitted = results.filter((result) => result.status === 'submitted');
        const graded = submitted.filter((result) => result.accuracy !== null);

        return {
            ...worksheet,
            assignedCount: results.length,
            submittedCount: submitted.length,
            submissionRate: results.length === 0 ? 0 : Math.round((submitted.length / results.length) * 100),
            accuracy: average(graded.map((result) => result.accuracy)),
            score: worksheet.type === 'assessment' ? average(graded.map((result) => result.score)) : null,
            gradingCount: submitted.filter((result) => result.grading === 'pending').length,
            overdue: isOverdue(worksheet),
        };
    });
}

export function getDashboardSummaries(classTerm) {
    const students = getStudentProgress(classTerm);
    const worksheets = getWorksheetSummary(classTerm);
    const ongoing = worksheets.filter((worksheet) => worksheet.status === 'ongoing').length;
    const pending = students.reduce((sum, student) => sum + student.pendingCount, 0);
    const overdue = students.reduce((sum, student) => sum + student.overdueCount, 0);
    const rated = students.filter((student) => student.accuracy !== null);
    const weak = rated.filter((student) => student.accuracy < weakAccuracyThreshold).length;

    return [
        { id: 'worksheets', label: '배정 학습지', valueLabel: '이번 학기 누적', value: `${worksheets.length}개`, support: ongoing > 0 ? `진행 중 ${ongoing}개` : '진행 중인 학습지 없음' },
        { id: 'accuracy', label: '반 평균 정답률', valueLabel: '채점 완료 기준', value: rated.length === 0 ? '-' : `${average(rated.map((student) => student.accuracy))}%`, support: `집계 학생 ${rated.length}명` },
        { id: 'pending', label: '미완료 제출', valueLabel: '배정 대비', value: `${pending}건`, support: overdue > 0 ? `기한 지난 ${overdue}건` : '기한 초과 없음', trend: overdue > 0 ? 'down' : undefined },
        { id: 'atRisk', label: '취약 학생', valueLabel: `정답률 ${weakAccuracyThreshold}% 미만`, value: `${weak}명`, support: weak > 0 ? '맞춤 학습 대상' : '해당 학생 없음' },
    ];
}
