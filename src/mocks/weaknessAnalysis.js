import { getClassName, getClassRoster } from './classes';
import { customStages, difficultyLabels } from './labels';

export { difficultyLabels };

const analysisClassId = 'middle-1-1';
const analysisClassName = getClassName({ grade: '1', name: '1반' });

export const weaknessFilterOptions = {
    years: [{ value: '2026', label: '2026학년도' }, { value: '2025', label: '2025학년도' }],
    grades: [{ value: 'middle-1', label: '1학년' }],
    terms: [{ value: 'first', label: '1학기' }, { value: 'second', label: '2학기' }],
    classes: [{ value: 'middle-1-1', label: '1반' }, { value: 'middle-1-2', label: '2반' }],
    worksheets: [
        { value: 'factor-practice', label: '2단원 소인수분해 연습' },
        { value: 'factor-assessment', label: '2단원 소인수분해 종합 평가' },
    ],
};

const concepts = [
    { id: 'prime-factor', label: '소인수' },
    { id: 'prime', label: '소인수분해' },
    { id: 'power', label: '거듭제곱' },
    { id: 'common', label: '공통소인수' },
    { id: 'gcd', label: '최대공약수' },
    { id: 'exponent', label: '지수 비교' },
    { id: 'lcm', label: '최소공배수' },
];

export const areaLabels = {
    concept: '개념',
    calculation: '계산',
    reasoning: '추론',
    problemSolving: '문제해결',
};

const text = (value) => ({ type: 'text', value });
const blank = (id, answer) => ({ type: 'blank', id, answer });
const practiceStep = (questionNo, order, conceptId, label, answer) => ({
    id: `practice-${questionNo}-step-${order}`,
    order,
    conceptId,
    label,
    segments: [text(`${label} 결과는 `), blank(`practice-${questionNo}-blank-${order}`, answer), text('입니다.')],
});

const practiceQuestions = [
    { id: 'factor-practice-1', no: 1, unitId: 'm1s1-prime-factor', difficulty: 'low', area: 'concept', prompt: '24를 소인수분해하세요.', correctAnswer: '2³×3', maxScore: 2, steps: [practiceStep(1, 1, 'prime-number', '소수와 합성수 구분', '합성수'), practiceStep(1, 2, 'divisor-factor', '약수와 인수', '2×12'), practiceStep(1, 3, 'prime-factor', '소인수 찾기', '2, 3'), practiceStep(1, 4, 'prime', '소인수분해', '2³×3'), practiceStep(1, 5, 'power', '거듭제곱 표현', '2³')] },
    { id: 'factor-practice-2', no: 2, unitId: 'm1s1-gcd-lcm', difficulty: 'mid', area: 'calculation', prompt: '12와 18의 최대공약수를 구하세요.', correctAnswer: '6', maxScore: 3, steps: [practiceStep(2, 1, 'prime', '소인수분해', '2²×3, 2×3²'), practiceStep(2, 2, 'common-divisor', '공약수 찾기', '1, 2, 3, 6'), practiceStep(2, 3, 'common', '공통 소인수', '2×3'), practiceStep(2, 4, 'gcd', '최대공약수', '6')] },
    { id: 'factor-practice-3', no: 3, unitId: 'm1s1-gcd-lcm', difficulty: 'low', area: 'reasoning', prompt: '공통인 소인수를 모두 고르세요.', correctAnswer: '2×5', maxScore: 2, steps: [practiceStep(3, 1, 'prime-factor', '소인수 찾기', '2, 5'), practiceStep(3, 2, 'common', '공통 소인수 선택', '2×5'), practiceStep(3, 3, 'common-divisor', '공약수 확인', '10')] },
    { id: 'factor-practice-4', no: 4, unitId: 'm1s1-gcd-lcm', difficulty: 'high', area: 'problemSolving', prompt: '지수를 비교해 최소공배수를 구하세요.', correctAnswer: '2³×3²', maxScore: 3, steps: [practiceStep(4, 1, 'power', '거듭제곱 확인', '2³, 3²'), practiceStep(4, 2, 'exponent', '지수 비교', '2³×3²'), practiceStep(4, 3, 'lcm', '최소공배수', '72')] },
];

const customProblem = (no, stage, difficulty, correct) => ({ no, stage, difficulty, correct });
const customSession = (id, conceptId, assignedAt, completedAt, problems) => ({ id, sourceWorksheetId: 'factor-practice', conceptId, assignedAt, completedAt, problems });

const customSessions = {
    11: [
        customSession('cs-11-1', 'common', '07.24', '07.25', [customProblem(1, 'retrace', 'low', true), customProblem(2, 'basic', 'mid', true), customProblem(3, 'independent', 'mid', false), customProblem(4, 'independent', 'high', false)]),
        customSession('cs-11-2', 'common', '07.28', '07.30', [customProblem(1, 'retrace', 'low', true), customProblem(2, 'basic', 'mid', true), customProblem(3, 'independent', 'mid', true), customProblem(4, 'independent', 'high', true)]),
    ],
    12: [customSession('cs-12-1', 'common', '07.24', '07.26', [customProblem(1, 'retrace', 'low', true), customProblem(2, 'basic', 'mid', true), customProblem(3, 'independent', 'mid', true)])],
    13: [customSession('cs-13-1', 'prime', '07.24', '07.26', [customProblem(1, 'retrace', 'low', true), customProblem(2, 'basic', 'mid', false), customProblem(3, 'independent', 'mid', false)])],
    15: [customSession('cs-15-1', 'exponent', '07.29', null, [customProblem(1, 'retrace', 'low', true), customProblem(2, 'basic', 'mid', null), customProblem(3, 'independent', 'high', null)])],
    7: [customSession('cs-7-1', 'common', '07.25', '07.28', [customProblem(1, 'retrace', 'low', true), customProblem(2, 'basic', 'mid', true), customProblem(3, 'independent', 'mid', false)])],
};

// 분석 대상은 반 명단(classes.js)을 그대로 쓰고 학생별 응답 패턴만 여기에서 정의한다.
const profileData = {
    1: { status: 'insufficient', nextAction: '추가 응답 확인', pattern: [1, null, null, null], inputs: ['2³×3', '', '', ''] },
    4: { status: 'stable', nextAction: '심화 문제', pattern: [1, 1, 1, 1], inputs: ['2³×3', '2×3', '2×5', '2³×3²'] },
    7: { status: 'priority', nextAction: '공통소인수 재학습', pattern: [1, 0, 0, 1], inputs: ['2³×3', '2×6', '2×6', '2³×3²'] },
    11: { status: 'priority', nextAction: '공통소인수 2문항', pattern: [1, 0, 0, 1], inputs: ['2³×3', '2×6', '2×6', '2³×3²'] },
    12: { status: 'review', nextAction: '다른 구조 2문항', pattern: [1, 1, 1, 0], inputs: ['2³×3', '2×3', '2×5', '2²×3²'] },
    13: { status: 'priority', nextAction: '기초 개념 복습', pattern: [0, 0, 0, 1], inputs: ['2²×6', '2×6', '2×3', '2³×3²'] },
    14: { status: 'stable', nextAction: '다음 단원', pattern: [1, 1, 1, 1], inputs: ['2³×3', '2×3', '2×5', '2³×3²'] },
    15: { status: 'review', nextAction: '지수 비교 2문항', pattern: [1, 1, 0, 0], inputs: ['2³×3', '2×3', '2×5', '2×3²'] },
};

// 라우트 파라미터와 비교하므로 id는 문자열로 맞춘다.
const profiles = getClassRoster(analysisClassId).map((student) => ({
    id: String(student.id),
    name: student.name,
    ...profileData[student.id],
    customSessions: customSessions[student.id] ?? [],
}));

const makePracticeResponses = (profile) => practiceQuestions.map((question, index) => {
    const correct = profile.pattern[index];
    return {
        no: question.no,
        score: correct === null ? 0 : correct ? question.maxScore : 0,
        maxScore: question.maxScore,
        hintUsed: false,
        steps: question.steps.map((step) => ({ order: step.order, correct: Boolean(correct), input: profile.inputs[index] })),
    };
});

const practiceStudents = profiles.map((profile) => ({
    ...profile,
    responses: makePracticeResponses(profile),
}));

// 종합 평가 문항 수는 학생 풀이 화면(studentWorksheetSolving)의 10문항과 같게 유지한다.
const assessmentQuestions = Array.from({ length: 10 }, (_, index) => ({
    no: index + 1,
    prompt: `${index + 1}번 소인수분해 응용 문항`,
    maxScore: index % 3 === 2 ? 3 : 2,
    format: index % 3 === 0 ? 'choice' : index % 3 === 1 ? 'short' : 'essay',
    unitId: index < 4 ? 'm1s1-prime-factor' : 'm1s1-gcd-lcm',
    difficulty: index % 3 === 0 ? 'low' : index % 3 === 1 ? 'mid' : 'high',
    area: ['concept', 'calculation', 'reasoning', 'problemSolving'][index % 4],
    correctAnswer: `${index + 1}번 문항 정답`,
    grading: index === 6 ? 'pending' : 'complete',
}));

const assessmentStudents = profiles.map((profile, studentIndex) => ({
    ...profile,
    responses: assessmentQuestions.map((question, questionIndex) => {
        const factor = (studentIndex * 2 + questionIndex) % 7;
        // 자료 부족 학생은 아직 제출하지 않아 채점된 응답이 없다.
        const pending = profile.status === 'insufficient' || (question.grading === 'pending' && studentIndex < 4);
        return {
            no: question.no,
            score: pending ? 0 : factor < 2 ? 0 : factor < 4 ? question.maxScore - 1 : question.maxScore,
            maxScore: question.maxScore,
            hintUsed: factor === 4,
            seconds: 45 + ((studentIndex * 37 + questionIndex * 41) % 220),
            gradedBy: pending ? null : 'teacher',
        };
    }),
}));

export const weaknessWorksheets = {
    'factor-practice': { id: 'factor-practice', gradeId: 'middle-1', classId: analysisClassId, term: 'second', type: 'practice', origin: 'manual', title: '2단원 소인수분해 연습', className: analysisClassName, date: '오늘 11:30', concepts, questions: practiceQuestions, students: practiceStudents },
    'factor-assessment': { id: 'factor-assessment', gradeId: 'middle-1', classId: analysisClassId, term: 'second', type: 'assessment', origin: 'manual', title: '2단원 소인수분해 종합 평가', className: analysisClassName, date: '오늘 11:30', concepts: [], questions: assessmentQuestions, students: assessmentStudents },
};

export const statusLabels = { priority: '집중 지도', review: '다시 확인', stable: '안정', insufficient: '자료 부족' };
export const prescriptionLabels = { resolved: '해결', unresolved: '미해결', pending: '대기' };

export function getStudentMetrics(student) {
    const graded = student.responses.filter((response) => response.gradedBy !== null);
    const correctCount = graded.filter((response) => response.score === response.maxScore).length;
    return {
        scoreRate: graded.length ? Math.round((correctCount / graded.length) * 100) : 0,
        solvedCount: graded.length,
        correctCount,
        independentCorrectCount: graded.filter((response) => response.score === response.maxScore && !response.hintUsed).length,
        independentRate: graded.length ? Math.round(graded.filter((response) => response.score === response.maxScore && !response.hintUsed).length / graded.length * 100) : 0,
        seconds: graded.reduce((sum, response) => sum + (response.seconds ?? 0), 0),
        hints: graded.filter((response) => response.hintUsed).length,
    };
}

export function getWorksheetMetrics(worksheet) {
    const reliableStudents = worksheet.students.filter((student) => student.status !== 'insufficient');
    const studentMetrics = reliableStudents.map(getStudentMetrics);
    const average = Math.round(studentMetrics.reduce((sum, item) => sum + item.scoreRate, 0) / Math.max(studentMetrics.length, 1) * 10) / 10;
    const pending = worksheet.students.filter((student) => student.responses.some((response) => response.gradedBy === null)).length;
    const pendingResponses = worksheet.students.flatMap((student) => student.responses).filter((response) => response.gradedBy === null).length;
    const weakConcepts = worksheet.concepts.filter((concept) => {
        const result = getConceptClassRate(worksheet, concept.id);
        return result.count > 0 && result.rate < 60;
    });
    return { responseCount: worksheet.students.length, reliableCount: reliableStudents.length, average, weakConceptCount: weakConcepts.length, averageSeconds: Math.round(studentMetrics.reduce((sum, item) => sum + item.seconds, 0) / Math.max(studentMetrics.length, 1)), hintStudents: worksheet.students.filter((student) => student.responses.some((response) => response.hintUsed)).length, hintCount: worksheet.students.flatMap((student) => student.responses).filter((response) => response.hintUsed).length, priorityCount: reliableStudents.filter((student) => getStudentMetrics(student).scoreRate < 60).length, pending, pendingResponses };
}

export function getResultBreakdown(worksheet, dimension, student = null) {
    const labels = dimension === 'area' ? areaLabels : difficultyLabels;
    const sourceStudents = student ? [student] : worksheet.students.filter((item) => item.status !== 'insufficient');

    return Object.entries(labels).map(([key, label]) => {
        const questions = worksheet.questions.filter((question) => question[dimension] === key);
        const responses = sourceStudents.flatMap((item) => questions.map((question) => item.responses.find((response) => response.no === question.no))).filter((response) => response && response.gradedBy !== null);
        const correct = responses.filter((response) => response.score === response.maxScore).length;
        return { key, label, rate: responses.length ? Math.round(correct / responses.length * 100) : 0, questionCount: questions.length };
    });
}

export function getConceptClassRate(worksheet, conceptId) {
    const results = worksheet.students
        .filter((student) => student.status !== 'insufficient')
        .flatMap((student) => worksheet.questions.flatMap((question) => (question.steps ?? [])
            .filter((step) => step.conceptId === conceptId)
            .map((step) => student.responses.find((response) => response.no === question.no)?.steps?.find((item) => item.order === step.order))))
        .filter((item) => item?.input);
    return { rate: results.length ? Math.round(results.filter((item) => item.correct).length / results.length * 100) : 0, count: results.length };
}

export function getConceptRate(worksheet, student, conceptId) {
    const results = worksheet.questions
        .flatMap((question) => (question.steps ?? [])
            .filter((step) => step.conceptId === conceptId)
            .map((step) => student.responses.find((response) => response.no === question.no)?.steps?.find((item) => item.order === step.order)))
        .filter((item) => item?.input);
    return { rate: results.length ? Math.round(results.filter((item) => item.correct).length / results.length * 100) : 0, count: results.length };
}

export function getStudentCustomSessions(worksheet, student) {
    return (student.customSessions ?? []).filter((session) => session.sourceWorksheetId === worksheet.id);
}

export function getCustomSessionSummary(session) {
    const stages = customStages.map((stage) => {
        const problems = session.problems.filter((problem) => problem.stage === stage);
        const solved = problems.filter((problem) => problem.correct !== null);
        return { stage, total: problems.length, solved: solved.length, correct: solved.filter((problem) => problem.correct).length };
    });
    const solved = session.problems.filter((problem) => problem.correct !== null);
    const independent = stages.find((item) => item.stage === 'independent');
    return {
        stages,
        independent,
        solvedCount: solved.length,
        totalCount: session.problems.length,
        rate: solved.length ? Math.round(solved.filter((problem) => problem.correct).length / solved.length * 100) : 0,
        status: solved.length < session.problems.length ? 'pending' : independent.total && independent.correct === independent.total ? 'resolved' : 'unresolved',
    };
}

export function getQuestionAccuracy(worksheet, questionNo) {
    const responses = worksheet.students
        .filter((student) => student.status !== 'insufficient')
        .map((student) => student.responses.find((response) => response.no === questionNo))
        .filter((response) => response && response.gradedBy !== null);
    const correct = responses.filter((response) => response.score === response.maxScore).length;
    return { correct, total: responses.length, rate: responses.length ? Math.round(correct / responses.length * 100) : 0 };
}
