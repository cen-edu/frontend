import { getAssessmentResults } from './assessmentResult';
import { getClassRoster } from './classes';
import { teacherProgressStatusLabels, worksheetTypeLabels } from './labels';

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

export { worksheetTypeLabels };
export const resultStatusLabels = teacherProgressStatusLabels;
export const studentStatusLabels = { overdue: '미제출 지연', weak: '보완 필요', steady: '양호', noData: '자료 부족' };
export const weakAccuracyThreshold = 60;

// 오늘 기준 날짜. 기한 초과 판정에 사용한다.
const today = '2026.08.04';

const classOneRoster = getClassRoster('middle-1-1');
const classTwoRoster = getClassRoster('middle-1-2');

const done = (accuracy, completedAt) => ({ status: 'submitted', accuracy, completedAt });
const scored = (score, completedAt) => ({ status: 'submitted', accuracy: score, score, grading: 'done', completedAt });
const awaiting = (completedAt) => ({ status: 'submitted', accuracy: null, score: null, grading: 'pending', completedAt });
const solving = { status: 'in-progress', accuracy: null };
const idle = { status: 'not-started', accuracy: null };

// 학기 구분은 학생앱(studentAssignments)의 term 값을 기준으로 맞춘다.
// 2026.07.18 이후 배정한 학습지는 2학기로 본다.
const classOneFirstTerm = {
    updatedAt: '오늘 오전 10:30 기준',
    roster: classOneRoster,
    worksheets: [
        {
            id: 'equation-practice', title: '3단원 일차방정식 연습', type: 'practice', origin: 'manual', sourceWorksheetId: null,
            analysisId: 'factor-practice', resultId: null,
            assignedAt: '2026.04.14', dueAt: '2026.04.21', status: 'completed',
            results: {
                1: done(52, '04.20'), 4: done(80, '04.19'), 7: done(85, '04.20'), 11: done(45, '04.21'),
                12: done(56, '04.18'), 13: done(50, '04.21'), 14: done(68, '04.19'), 15: idle,
            },
        },
        {
            id: 'unit-2-practice', title: '2단원 연습', type: 'practice', origin: 'manual', sourceWorksheetId: null,
            analysisId: 'factor-practice', resultId: 'unit-2-practice',
            assignedAt: '2026.06.24', dueAt: '2026.06.27', status: 'completed',
            results: {
                1: done(54, '06.27'), 4: done(80, '06.25'), 7: done(85, '06.25'), 11: done(45, '06.26'),
                12: done(56, '06.27'), 13: done(50, '06.26'), 14: done(68, '06.25'), 15: done(61, '06.27'),
            },
        },
        {
            id: 'factor-practice-review', title: '소인수분해 개념 복습', type: 'practice', origin: 'manual', sourceWorksheetId: null,
            analysisId: 'factor-practice', resultId: 'factor-practice-review',
            assignedAt: '2026.07.06', dueAt: '2026.07.09', status: 'completed',
            results: {
                1: idle, 4: done(85, '07.07'), 7: done(90, '07.07'), 11: done(50, '07.09'),
                12: done(62, '07.08'), 13: done(47, '07.09'), 14: done(74, '07.07'), 15: done(66, '07.08'),
            },
        },
        {
            id: 'gcd-lcm-assessment', title: '최대공약수와 최소공배수 평가', type: 'assessment', origin: 'manual', sourceWorksheetId: null,
            analysisId: 'factor-assessment', resultId: 'gcd-lcm-assessment', maxScore: 100,
            assignedAt: '2026.07.13', dueAt: '2026.07.16', status: 'completed',
            results: {
                1: scored(58, '07.16'), 4: scored(82, '07.14'), 7: scored(88, '07.14'), 11: scored(44, '07.16'),
                12: scored(55, '07.15'), 13: scored(52, '07.16'), 14: scored(70, '07.15'), 15: scored(60, '07.16'),
            },
        },
    ],
};

const classOneSecondTerm = {
    updatedAt: '오늘 오전 10:30 기준',
    roster: classOneRoster,
    worksheets: [
        {
            id: 'integer-assessment', title: '1단원 정수와 유리수 종합 평가', type: 'assessment', origin: 'manual', sourceWorksheetId: null,
            analysisId: 'factor-assessment', resultId: 'integer-assessment', maxScore: 100,
            assignedAt: '2026.07.18', dueAt: '2026.07.25', status: 'completed',
            results: {
                1: scored(91, '07.25'), 4: scored(84, '07.25'), 7: scored(88, '07.24'), 11: scored(76, '07.25'),
                12: scored(82, '07.25'), 13: scored(69, '07.25'), 14: scored(89, '07.24'), 15: idle,
            },
        },
        {
            id: 'integer-practice', title: '1단원 정수와 유리수 연습', type: 'practice', origin: 'manual', sourceWorksheetId: null,
            analysisId: 'factor-practice', resultId: null,
            assignedAt: '2026.07.24', dueAt: '2026.07.31', status: 'completed',
            results: {
                1: done(75, '07.30'), 4: done(88, '07.29'), 7: done(84, '07.31'), 11: done(58, '07.30'),
                12: done(67, '07.28'), 13: done(44, '07.31'), 14: done(79, '07.29'), 15: done(62, '07.30'),
            },
        },
        {
            id: 'factor-assessment', title: '2단원 소인수분해 종합 평가', type: 'assessment', origin: 'manual', sourceWorksheetId: null,
            analysisId: 'factor-assessment', resultId: 'factor-assessment', maxScore: 100,
            assignedAt: '2026.08.04', dueAt: '2026.08.08', status: 'ongoing',
            results: {
                1: idle, 4: scored(84, '07.30'), 7: awaiting('07.30'), 11: scored(92, '08.01'),
                12: awaiting('08.01'), 13: scored(52, '08.01'), 14: scored(86, '07.31'), 15: scored(66, '08.02'),
            },
        },
        {
            id: 'factor-practice', title: '2단원 소인수분해 연습', type: 'practice', origin: 'manual', sourceWorksheetId: null,
            analysisId: 'factor-practice', resultId: 'factor-practice',
            assignedAt: '2026.08.01', dueAt: '2026.08.07', status: 'ongoing',
            results: {
                1: solving, 4: done(86, '08.02'), 7: done(91, '08.02'), 11: done(52, '08.02'),
                12: done(63, '08.03'), 13: done(46, '08.02'), 14: done(72, '08.02'), 15: done(58, '08.03'),
            },
        },
        {
            // 원본 학습지의 취약점 분석에서 파생된 맞춤 학습. sourceWorksheetId 로 원본 아래에 묶인다.
            id: 'factor-custom', title: '공통소인수 맞춤 학습', type: 'practice', origin: 'custom', sourceWorksheetId: 'factor-practice',
            analysisId: 'factor-practice', resultId: null,
            assignedAt: '2026.08.03', dueAt: '2026.08.07', status: 'ongoing',
            results: {
                1: idle, 11: done(58, '08.04'), 13: done(55, '08.04'), 15: done(70, '08.04'),
            },
        },
        {
            id: 'linear-equation-practice', title: '일차방정식 개념 확인', type: 'practice', origin: 'manual', sourceWorksheetId: null,
            analysisId: 'factor-practice', resultId: null,
            assignedAt: '2026.08.03', dueAt: '2026.08.10', status: 'ongoing',
            results: {
                1: idle, 4: done(81, '08.04'), 7: solving, 11: idle,
                12: solving, 13: idle, 14: done(69, '08.04'), 15: idle,
            },
        },
    ],
};

const classTwoFirstTerm = {
    updatedAt: '어제 오후 5:00 기준',
    roster: classTwoRoster,
    worksheets: [
        {
            id: 'integer-practice-class2', title: '1단원 정수와 유리수 연습', type: 'practice', origin: 'manual', sourceWorksheetId: null,
            analysisId: 'factor-practice', resultId: null,
            assignedAt: '2026.07.06', dueAt: '2026.07.10', status: 'completed',
            results: {
                16: done(91, '07.09'), 17: done(84, '07.10'), 18: done(62, '07.10'), 19: done(89, '07.08'), 20: idle,
            },
        },
    ],
};

const classTwoSecondTerm = {
    updatedAt: '어제 오후 5:00 기준',
    roster: classTwoRoster,
    worksheets: [
        {
            id: 'integer-unit-test-class2', title: '1단원 정수와 유리수 종합 평가', type: 'assessment', origin: 'manual', sourceWorksheetId: null,
            analysisId: 'factor-assessment', resultId: null, maxScore: 100,
            assignedAt: '2026.07.27', dueAt: '2026.07.31', status: 'completed',
            results: {
                16: scored(88, '07.31'), 17: scored(80, '07.31'), 18: scored(58, '07.31'), 19: scored(85, '07.31'), 20: idle,
            },
        },
        {
            id: 'factor-practice-class2', title: '2단원 소인수분해 연습', type: 'practice', origin: 'manual', sourceWorksheetId: null,
            analysisId: 'factor-practice', resultId: null,
            assignedAt: '2026.08.01', dueAt: '2026.08.07', status: 'ongoing',
            results: {
                16: done(84, '08.03'), 17: done(76, '08.03'), 18: done(55, '08.03'), 19: done(82, '08.02'), 20: idle,
            },
        },
    ],
};

export const dashboardClassTerms = {
    'middle-1-1:first': classOneFirstTerm,
    'middle-1-1:second': classOneSecondTerm,
    'middle-1-2:first': classTwoFirstTerm,
    'middle-1-2:second': classTwoSecondTerm,
};

export function getClassTerm(classId, term) {
    return dashboardClassTerms[`${classId}:${term}`] ?? { updatedAt: '', roster: [], worksheets: [] };
}

const isOverdue = (worksheet) => worksheet.dueAt < today;
const average = (values) => (values.length === 0 ? null : Math.round(values.reduce((sum, value) => sum + value, 0) / values.length));

// 원본 학습지 아래에 맞춤 학습을 묶어 표시 순서대로 펼치고 계층 번호(5, 5-1)를 매긴다.
// 학습지별 현황과 학생별 결과 스트립이 같은 순서와 번호를 쓰도록 여기에서만 계산한다.
function orderWorksheets(worksheets) {
    const sources = worksheets.filter((worksheet) => worksheet.origin !== 'custom');
    const customWorksheets = worksheets.filter((worksheet) => worksheet.origin === 'custom');
    const ordered = [];

    sources.forEach((source, index) => {
        const children = customWorksheets.filter((worksheet) => worksheet.sourceWorksheetId === source.id);
        ordered.push({ ...source, orderLabel: `${index + 1}`, depth: 0, childCount: children.length });
        children.forEach((child, childIndex) => ordered.push({ ...child, orderLabel: `${index + 1}-${childIndex + 1}`, depth: 1, childCount: 0 }));
    });

    // 원본을 찾지 못한 맞춤 학습도 누락되지 않게 최상위 번호로 뒤에 이어 붙인다.
    const sourceIds = new Set(sources.map((source) => source.id));
    customWorksheets
        .filter((worksheet) => !sourceIds.has(worksheet.sourceWorksheetId))
        .forEach((worksheet, index) => ordered.push({ ...worksheet, orderLabel: `${sources.length + index + 1}`, depth: 0, childCount: 0 }));

    return ordered;
}

// 학기에 배정된 모든 학습지를 학생 단위로 누적한다.
export function getStudentProgress(classTerm) {
    const orderedWorksheets = orderWorksheets(classTerm.worksheets);

    return classTerm.roster.map((student) => {
        const results = orderedWorksheets.map((worksheet) => {
            const result = worksheet.results[student.id];
            return {
                worksheetId: worksheet.id,
                title: worksheet.title,
                type: worksheet.type,
                origin: worksheet.origin,
                orderLabel: worksheet.orderLabel,
                depth: worksheet.depth,
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
            lastActivity,
            status: overdue.length > 0 ? 'overdue' : accuracy === null ? 'noData' : accuracy < weakAccuracyThreshold ? 'weak' : 'steady',
        };
    });
}

// 학습지 한 개의 반 전체 진행 상태. 유형에 따라 대표 지표가 달라진다.
export function getWorksheetSummary(classTerm) {
    const assessmentStatuses = new Map(getAssessmentResults().map((result) => [result.id, result.status]));

    return orderWorksheets(classTerm.worksheets).map((worksheet) => {
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
            resultStatus: worksheet.type === 'assessment' ? assessmentStatuses.get(worksheet.resultId) ?? null : null,
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
