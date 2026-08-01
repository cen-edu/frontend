export const weaknessFilterOptions = {
    years: [{ value: '2026', label: '2026학년도' }, { value: '2025', label: '2025학년도' }],
    terms: [{ value: 'first', label: '1학기' }, { value: 'second', label: '2학기' }],
    classes: [{ value: 'class-1', label: '중학교 1학년 3반' }, { value: 'class-2', label: '중학교 1학년 4반' }],
    worksheets: [
        { value: 'factor-practice', label: '2단원 소인수분해 연습' },
        { value: 'factor-assessment', label: '2단원 소인수분해 종합평가' },
        { value: 'factor-custom', label: '공통소인수 맞춤 학습' },
    ],
};

const concepts = [
    { id: 'prime', label: '소인수분해' },
    { id: 'common', label: '공통소인수' },
    { id: 'exponent', label: '지수 비교' },
];

const practiceQuestions = [
    { no: 1, prompt: '24를 소인수분해하세요.', maxScore: 2, steps: [{ order: 1, conceptId: 'prime', label: '소인수분해', answer: '2³×3' }] },
    { no: 2, prompt: '12와 18의 최대공약수를 구하세요.', maxScore: 3, steps: [{ order: 1, conceptId: 'prime', label: '소인수분해', answer: '2²×3, 2×3²' }, { order: 2, conceptId: 'common', label: '공통 소인수', answer: '2×3' }, { order: 3, conceptId: 'exponent', label: '지수 비교', answer: '6' }] },
    { no: 3, prompt: '공통인 소인수를 모두 고르세요.', maxScore: 2, steps: [{ order: 1, conceptId: 'common', label: '공통 소인수 선택', answer: '2×5' }] },
    { no: 4, prompt: '지수를 비교해 최소공배수를 구하세요.', maxScore: 3, steps: [{ order: 1, conceptId: 'exponent', label: '지수 비교', answer: '2³×3²' }] },
];

const profiles = [
    { id: '101', name: '김민수', status: 'priority', nextAction: '공통소인수 2문항', pattern: [1, 0, 0, 1], inputs: ['2³×3', '2×6', '2×6', '2³×3²'] },
    { id: '102', name: '박지수', status: 'review', nextAction: '다른 구조 2문항', pattern: [1, 1, 1, 0], inputs: ['2³×3', '2×3', '2×5', '2²×3²'] },
    { id: '103', name: '정도윤', status: 'priority', nextAction: '기초 개념 복습', pattern: [0, 0, 0, 1], inputs: ['2²×6', '2×6', '2×3', '2³×3²'] },
    { id: '104', name: '조현우', status: 'stable', nextAction: '다음 단원', pattern: [1, 1, 1, 1], inputs: ['2³×3', '2×3', '2×5', '2³×3²'] },
    { id: '105', name: '이서윤', status: 'review', nextAction: '지수 비교 2문항', pattern: [1, 1, 0, 0], inputs: ['2³×3', '2×3', '2×5', '2×3²'] },
    { id: '106', name: '한예린', status: 'stable', nextAction: '심화 문제', pattern: [1, 1, 1, 1], inputs: ['2³×3', '2×3', '2×5', '2³×3²'] },
    { id: '107', name: '윤하준', status: 'insufficient', nextAction: '추가 응답 확인', pattern: [1, null, null, null], inputs: ['2³×3', '', '', ''] },
    { id: '108', name: '오서아', status: 'priority', nextAction: '공통소인수 재학습', pattern: [1, 0, 0, 1], inputs: ['2³×3', '2×6', '2×6', '2³×3²'] },
];

const makePracticeResponses = (profile) => practiceQuestions.map((question, index) => {
    const correct = profile.pattern[index];
    return {
        no: question.no,
        score: correct === null ? 0 : correct ? question.maxScore : index === 1 ? 1 : 0,
        maxScore: question.maxScore,
        steps: question.steps.map((step) => ({ order: step.order, correct: Boolean(correct), input: profile.inputs[index] })),
    };
});

const practiceStudents = profiles.map((profile) => ({ ...profile, responses: makePracticeResponses(profile), chatLogs: [], prescription: null }));

const assessmentQuestions = Array.from({ length: 8 }, (_, index) => ({
    no: index + 1,
    prompt: `${index + 1}번 소인수분해 응용 문항`,
    maxScore: index % 3 === 2 ? 3 : 2,
    format: index % 3 === 0 ? '객관식' : index % 3 === 1 ? '주관식' : '서술형',
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
    chatLogs: [], prescription: null,
}));

const customStudents = practiceStudents.map((student, index) => ({
    ...student,
    chatLogs: index < 3 ? [{ conceptId: 'common', question: index === 0 ? '왜 2×6이 아니라 2×3인가요?' : '공통인 수는 어떻게 찾나요?', count: index + 1 }] : [],
    prescription: index < 5 ? { conceptId: index === 2 ? 'prime' : 'common', assignedAt: '07-24', recheckCorrect: index === 2 ? 0 : index === 1 ? 1 : 2, recheckTotal: 2, status: index === 2 ? 'unresolved' : index === 1 ? 'pending' : 'resolved' } : null,
}));

export const weaknessWorksheets = {
    'factor-practice': { id: 'factor-practice', type: 'practice', origin: 'standard', title: '2단원 소인수분해 연습', className: '1학년 3반', date: '오늘 11:30', concepts, questions: practiceQuestions, students: practiceStudents },
    'factor-assessment': { id: 'factor-assessment', type: 'assessment', origin: 'standard', title: '2단원 소인수분해 종합평가', className: '1학년 3반', date: '오늘 11:30', concepts: [], questions: assessmentQuestions, students: assessmentStudents },
    'factor-custom': { id: 'factor-custom', type: 'practice', origin: 'custom', title: '공통소인수 맞춤 학습', className: '1학년 3반', date: '오늘 11:30', concepts, questions: practiceQuestions, students: customStudents },
};

export const statusLabels = { priority: '우선 지도', review: '추가 확인', stable: '안정', insufficient: '자료 부족' };
export const prescriptionLabels = { resolved: '해결', unresolved: '미해결', pending: '대기' };

export function getStudentMetrics(student) {
    const graded = student.responses.filter((response) => response.gradedBy !== null);
    const earned = graded.reduce((sum, response) => sum + response.score, 0);
    const possible = graded.reduce((sum, response) => sum + response.maxScore, 0);
    return {
        scoreRate: possible ? Math.round((earned / possible) * 100) : 0,
        seconds: graded.reduce((sum, response) => sum + (response.seconds ?? 0), 0),
        hints: graded.filter((response) => response.hintUsed).length,
    };
}

export function getWorksheetMetrics(worksheet) {
    const studentMetrics = worksheet.students.map(getStudentMetrics);
    const average = Math.round(studentMetrics.reduce((sum, item) => sum + item.scoreRate, 0) / studentMetrics.length * 10) / 10;
    const pending = worksheet.students.filter((student) => student.responses.some((response) => response.gradedBy === null)).length;
    return { responseCount: worksheet.students.length, average, averageSeconds: Math.round(studentMetrics.reduce((sum, item) => sum + item.seconds, 0) / studentMetrics.length), hintStudents: worksheet.students.filter((student) => student.responses.some((response) => response.hintUsed)).length, priorityCount: worksheet.students.filter((student) => student.status === 'priority').length, pending };
}
