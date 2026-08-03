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
    { id: 'prime', label: '소인수분해' },
    { id: 'common', label: '공통소인수' },
    { id: 'exponent', label: '지수 비교' },
];

export const areaLabels = {
    concept: '개념',
    calculation: '계산',
    reasoning: '추론',
    problemSolving: '문제해결',
};

export const difficultyLabels = { low: '하', mid: '중', high: '상' };

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
    { id: 'factor-practice-1', no: 1, unitId: 'm1s1-prime-factor', difficulty: 'low', area: 'concept', prompt: '24를 소인수분해하세요.', correctAnswer: '2³×3', maxScore: 2, steps: [practiceStep(1, 1, 'prime', '소인수분해', '2³×3')] },
    { id: 'factor-practice-2', no: 2, unitId: 'm1s1-gcd-lcm', difficulty: 'mid', area: 'calculation', prompt: '12와 18의 최대공약수를 구하세요.', correctAnswer: '6', maxScore: 3, steps: [practiceStep(2, 1, 'prime', '소인수분해', '2²×3, 2×3²'), practiceStep(2, 2, 'common', '공통 소인수', '2×3'), practiceStep(2, 3, 'exponent', '지수 비교', '6')] },
    { id: 'factor-practice-3', no: 3, unitId: 'm1s1-gcd-lcm', difficulty: 'low', area: 'reasoning', prompt: '공통인 소인수를 모두 고르세요.', correctAnswer: '2×5', maxScore: 2, steps: [practiceStep(3, 1, 'common', '공통 소인수 선택', '2×5')] },
    { id: 'factor-practice-4', no: 4, unitId: 'm1s1-gcd-lcm', difficulty: 'high', area: 'problemSolving', prompt: '지수를 비교해 최소공배수를 구하세요.', correctAnswer: '2³×3²', maxScore: 3, steps: [practiceStep(4, 1, 'exponent', '지수 비교', '2³×3²')] },
];

const customProblem = (no, stage, difficulty, correct) => ({ no, stage, difficulty, correct });
const customSession = (id, conceptId, assignedAt, completedAt, problems) => ({ id, sourceWorksheetId: 'factor-practice', conceptId, assignedAt, completedAt, problems });

const customSessions = {
    '101': [
        customSession('cs-101-1', 'common', '07.24', '07.25', [customProblem(1, 'retrace', 'low', true), customProblem(2, 'basic', 'mid', true), customProblem(3, 'independent', 'mid', false), customProblem(4, 'independent', 'high', false)]),
        customSession('cs-101-2', 'common', '07.28', '07.30', [customProblem(1, 'retrace', 'low', true), customProblem(2, 'basic', 'mid', true), customProblem(3, 'independent', 'mid', true), customProblem(4, 'independent', 'high', true)]),
    ],
    '102': [customSession('cs-102-1', 'common', '07.24', '07.26', [customProblem(1, 'retrace', 'low', true), customProblem(2, 'basic', 'mid', true), customProblem(3, 'independent', 'mid', true)])],
    '103': [customSession('cs-103-1', 'prime', '07.24', '07.26', [customProblem(1, 'retrace', 'low', true), customProblem(2, 'basic', 'mid', false), customProblem(3, 'independent', 'mid', false)])],
    '105': [customSession('cs-105-1', 'exponent', '07.29', null, [customProblem(1, 'retrace', 'low', true), customProblem(2, 'basic', 'mid', null), customProblem(3, 'independent', 'high', null)])],
    '108': [customSession('cs-108-1', 'common', '07.25', '07.28', [customProblem(1, 'retrace', 'low', true), customProblem(2, 'basic', 'mid', true), customProblem(3, 'independent', 'mid', false)])],
};

const profiles = [
    { id: '101', name: '김민수', status: 'priority', nextAction: '공통소인수 2문항', pattern: [1, 0, 0, 1], inputs: ['2³×3', '2×6', '2×6', '2³×3²'] },
    { id: '102', name: '박지수', status: 'review', nextAction: '다른 구조 2문항', pattern: [1, 1, 1, 0], inputs: ['2³×3', '2×3', '2×5', '2²×3²'] },
    { id: '103', name: '정도윤', status: 'priority', nextAction: '기초 개념 복습', pattern: [0, 0, 0, 1], inputs: ['2²×6', '2×6', '2×3', '2³×3²'] },
    { id: '104', name: '조현우', status: 'stable', nextAction: '다음 단원', pattern: [1, 1, 1, 1], inputs: ['2³×3', '2×3', '2×5', '2³×3²'] },
    { id: '105', name: '이서윤', status: 'review', nextAction: '지수 비교 2문항', pattern: [1, 1, 0, 0], inputs: ['2³×3', '2×3', '2×5', '2×3²'] },
    { id: '106', name: '한예린', status: 'stable', nextAction: '심화 문제', pattern: [1, 1, 1, 1], inputs: ['2³×3', '2×3', '2×5', '2³×3²'] },
    { id: '107', name: '윤하준', status: 'insufficient', nextAction: '추가 응답 확인', pattern: [1, null, null, null], inputs: ['2³×3', '', '', ''] },
    { id: '108', name: '오서아', status: 'priority', nextAction: '공통소인수 재학습', pattern: [1, 0, 0, 1], inputs: ['2³×3', '2×6', '2×6', '2³×3²'] },
].map((profile) => ({ ...profile, customSessions: customSessions[profile.id] ?? [] }));

const makePracticeResponses = (profile) => practiceQuestions.map((question, index) => {
    const correct = profile.pattern[index];
    return {
        no: question.no,
        score: correct === null ? 0 : correct ? question.maxScore : 0,
        maxScore: question.maxScore,
        hintUsed: Boolean(correct && ((Number(profile.id) + index) % 4 === 0)),
        steps: question.steps.map((step) => ({ order: step.order, correct: Boolean(correct), input: profile.inputs[index] })),
    };
});

const practiceStudents = profiles.map((profile, index) => ({
    ...profile,
    responses: makePracticeResponses(profile),
    chatLogs: index < 3 ? [{ conceptId: 'common', question: index === 0 ? '왜 2×6이 아니라 2×3인가요?' : '공통인 수는 어떻게 찾나요?', count: index + 1 }] : [],
}));

const assessmentQuestions = Array.from({ length: 8 }, (_, index) => ({
    no: index + 1,
    prompt: `${index + 1}번 소인수분해 응용 문항`,
    maxScore: index % 3 === 2 ? 3 : 2,
    format: index % 3 === 0 ? 'choice' : index % 3 === 1 ? 'short' : 'essay',
    unitId: index < 3 ? 'm1s1-prime-factor' : 'm1s1-gcd-lcm',
    difficulty: index % 3 === 0 ? 'low' : index % 3 === 1 ? 'mid' : 'high',
    area: ['concept', 'calculation', 'reasoning', 'problemSolving'][index % 4],
    correctAnswer: `${index + 1}번 문항 정답`,
    grading: index === 6 ? 'pending' : 'complete',
}));

const assessmentStudents = profiles.map((profile, studentIndex) => ({
    ...profile,
    responses: assessmentQuestions.map((question, questionIndex) => {
        const factor = (studentIndex * 2 + questionIndex) % 7;
        const pending = question.grading === 'pending' && studentIndex < 4;
        return {
            no: question.no,
            score: pending ? 0 : factor < 2 ? 0 : factor < 4 ? question.maxScore - 1 : question.maxScore,
            maxScore: question.maxScore,
            hintUsed: factor === 4,
            seconds: 45 + ((studentIndex * 37 + questionIndex * 41) % 220),
            gradedBy: pending ? null : 'teacher',
        };
    }),
    chatLogs: [],
}));

export const weaknessWorksheets = {
    'factor-practice': { id: 'factor-practice', gradeId: 'middle-1', classId: 'middle-1-1', term: 'first', type: 'practice', origin: 'manual', title: '2단원 소인수분해 연습', className: '중학교 1학년 1반', date: '오늘 11:30', concepts, questions: practiceQuestions, students: practiceStudents },
    'factor-assessment': { id: 'factor-assessment', gradeId: 'middle-1', classId: 'middle-1-1', term: 'first', type: 'assessment', origin: 'manual', title: '2단원 소인수분해 종합 평가', className: '중학교 1학년 1반', date: '오늘 11:30', concepts: [], questions: assessmentQuestions, students: assessmentStudents },
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
    return { responseCount: worksheet.students.length, reliableCount: reliableStudents.length, average, averageSeconds: Math.round(studentMetrics.reduce((sum, item) => sum + item.seconds, 0) / Math.max(studentMetrics.length, 1)), hintStudents: worksheet.students.filter((student) => student.responses.some((response) => response.hintUsed)).length, hintCount: worksheet.students.flatMap((student) => student.responses).filter((response) => response.hintUsed).length, priorityCount: reliableStudents.filter((student) => getStudentMetrics(student).scoreRate < 60).length, pending, pendingResponses };
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
    const stages = ['retrace', 'basic', 'independent'].map((stage) => {
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
