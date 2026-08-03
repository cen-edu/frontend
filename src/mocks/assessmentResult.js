export const assessmentResultFilterOptions = {
    grades: [
        { value: 'all', label: '전체 학년' },
        { value: 'middle-1', label: '1학년' },
    ],
    classes: [
        { value: 'all', label: '전체 반' },
        { value: 'middle-1-1', label: '1반' },
        { value: 'middle-1-2', label: '2반' },
    ],
    terms: [
        { value: 'all', label: '전체 학기' },
        { value: 'first', label: '1학기' },
        { value: 'second', label: '2학기' },
    ],
};

const baseAssessmentQuestions = [
    { no: 1, unitId: 'm1s1-prime-factor', difficulty: 'low', prompt: '다음 중 소수인 수를 고르세요.', format: 'choice', choices: ['1', '4', '7', '9', '15'], maxScore: 5, answer: '3', rubric: [], gradingStatus: 'auto' },
    { no: 2, unitId: 'm1s1-prime-factor', difficulty: 'low', prompt: '12의 약수의 개수를 고르세요.', format: 'choice', choices: ['2', '3', '4', '5', '6'], maxScore: 5, answer: '4', rubric: [], gradingStatus: 'auto' },
    { no: 3, unitId: 'm1s1-gcd-lcm', difficulty: 'mid', prompt: '12와 18의 공통 소인수의 곱을 구하세요.', format: 'short', maxScore: 3, answer: '2×3', rubric: [{ label: '정답과 동치인 표현', score: 3 }], gradingStatus: 'pending' },
    { no: 4, unitId: 'm1s1-prime-factor', difficulty: 'mid', prompt: '60의 소인수 개수를 고르세요.', format: 'choice', choices: ['2개', '3개', '4개', '5개', '6개'], maxScore: 5, answer: '2', rubric: [], gradingStatus: 'auto' },
    {
        no: 5,
        unitId: 'm1s1-gcd-lcm',
        difficulty: 'high',
        prompt: '최대공약수를 구하는 과정을 설명하세요.',
        format: 'essay',
        maxScore: 5,
        answer: '두 수를 각각 소인수분해한 뒤 공통 소인수를 골라 곱한다.',
        rubric: [
            { label: '두 수를 각각 소인수분해한 수식이 포함되어 있음', score: 2 },
            { label: '공통 소인수를 골라 곱하는 절차가 포함되어 있음', score: 3 },
        ],
        gradingStatus: 'auto',
    },
];

const additionalAssessmentQuestions = Array.from({ length: 15 }, (_, index) => {
    const no = index + 6;
    return {
        no,
        unitId: no % 2 ? 'm1s1-prime-factor' : 'm1s1-gcd-lcm',
        difficulty: no < 11 ? 'low' : no < 16 ? 'mid' : 'high',
        prompt: `${no}번 소인수분해 개념 확인 문제의 정답을 고르세요.`,
        format: 'choice',
        choices: ['정답 보기', '보기 2', '보기 3', '보기 4', '보기 5'],
        maxScore: 5,
        answer: '1',
        rubric: [],
        gradingStatus: 'auto',
    };
});

const assessmentQuestions = [...baseAssessmentQuestions, ...additionalAssessmentQuestions];

const baseStudents = [
    {
        id: 101, number: 1, name: '김민서',
        answers: [
            { no: 1, input: '3', score: 5, autoScore: 5, gradedBy: 'auto' },
            { no: 2, input: '4', score: 5, autoScore: 5, gradedBy: 'auto' },
            { no: 3, input: '2*3', score: null, autoScore: 0, gradedBy: null },
            { no: 4, input: '2', score: 5, autoScore: 5, gradedBy: 'auto' },
            { no: 5, input: '12=2²×3, 18=2×3²이므로 공통인 2와 3을 곱하면 6이다.', score: 5, autoScore: 5, gradedBy: 'auto', rubricResults: [{ satisfied: true, evidence: '12=2²×3, 18=2×3²' }, { satisfied: true, evidence: '공통인 2와 3을 곱하면 6이다' }] },
        ],
    },
    {
        id: 102, number: 2, name: '박준호',
        answers: [
            { no: 1, input: '3', score: 5, autoScore: 5, gradedBy: 'auto' },
            { no: 2, input: '3', score: 0, autoScore: 0, gradedBy: 'auto' },
            { no: 3, input: '6', score: null, autoScore: 0, gradedBy: null },
            { no: 4, input: '2', score: 5, autoScore: 5, gradedBy: 'auto' },
            { no: 5, input: '2와 3을 곱해서 6', score: 3, autoScore: 3, gradedBy: 'auto', rubricResults: [{ satisfied: false, evidence: '' }, { satisfied: true, evidence: '2와 3을 곱해서 6' }] },
        ],
    },
    {
        id: 103, number: 3, name: '이서윤',
        answers: [
            { no: 1, input: '3', score: 5, autoScore: 5, gradedBy: 'auto' },
            { no: 2, input: '4', score: 5, autoScore: 5, gradedBy: 'auto' },
            { no: 3, input: '2 × 3', score: null, autoScore: 0, gradedBy: null },
            { no: 4, input: '1', score: 0, autoScore: 0, gradedBy: 'auto' },
            { no: 5, input: '두 수를 소인수분해하고 공통 소인수를 곱한다.', score: 3, autoScore: 3, gradedBy: 'auto', rubricResults: [{ satisfied: false, evidence: '' }, { satisfied: true, evidence: '공통 소인수를 곱한다' }] },
        ],
    },
    {
        id: 104, number: 4, name: '최지우',
        answers: [
            { no: 1, input: '3', score: 5, autoScore: 5, gradedBy: 'auto' },
            { no: 2, input: '4', score: 5, autoScore: 5, gradedBy: 'auto' },
            { no: 3, input: '2×3', score: 3, autoScore: 3, gradedBy: 'auto' },
            { no: 4, input: '2', score: 5, autoScore: 5, gradedBy: 'auto' },
            { no: 5, input: '2와 3을 곱해서 6', score: 3, autoScore: 3, gradedBy: 'auto', rubricResults: [{ satisfied: false, evidence: '' }, { satisfied: true, evidence: '2와 3을 곱해서 6' }] },
        ],
    },
];

const assessmentStudents = baseStudents.map((student, studentIndex) => ({
    ...student,
    answers: [
        ...student.answers,
        ...additionalAssessmentQuestions.map((question) => {
            const isCorrect = (question.no + studentIndex) % 6 !== 0;
            return { no: question.no, input: isCorrect ? '1' : '2', score: isCorrect ? 5 : 0, autoScore: isCorrect ? 5 : 0, gradedBy: 'auto' };
        }),
    ],
}));

const practiceQuestions = Array.from({ length: 20 }, (_, index) => ({
    no: index + 1,
    format: index % 4 === 0 ? 'choice' : 'short',
    prompt: `${index + 1}번 일반 학습 문제`,
    answer: String(index + 2),
    rubric: [],
    gradingStatus: 'auto',
}));

const practiceStudents = baseStudents.map((student, studentIndex) => ({
    id: student.id,
    number: student.number,
    name: student.name,
    answers: practiceQuestions.map((question) => {
        const isCorrect = (question.no + studentIndex) % 5 !== 0;
        return { no: question.no, input: isCorrect ? question.answer : '오답', isCorrect, gradedBy: 'auto' };
    }),
}));

export const initialAssessmentResults = [
    {
        id: 'factor-assessment', type: 'assessment', title: '2단원 소인수분해 종합 평가',
        gradeId: 'middle-1', classId: 'middle-1-1', className: '중학교 1학년 1반', term: 'first', assignedAt: '2026.07.29', status: 'grading', modified: false,
        questions: assessmentQuestions,
        students: assessmentStudents,
    },
    {
        id: 'unit-2-practice', type: 'practice', title: '2단원 연습',
        gradeId: 'middle-1', classId: 'middle-1-1', className: '중학교 1학년 1반', term: 'first', assignedAt: '2026.07.21', status: 'confirmed', modified: false,
        questions: practiceQuestions,
        students: practiceStudents,
    },
];

const STORAGE_KEY = 'assessment-results-v3';

export const getAssessmentResults = () => {
    try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : initialAssessmentResults;
    } catch {
        return initialAssessmentResults;
    }
};

export const saveAssessmentResults = (results) => {
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
    } catch {
        // 저장소가 제한된 환경에서도 현재 화면의 채점 상태는 계속 유지한다.
    }
};

export const getWorksheetMetrics = (worksheet) => {
    if (worksheet.type === 'practice') {
        const totals = worksheet.students.map((student) => worksheet.questions.reduce((sum, question) => {
            const answer = student.answers.find((candidate) => candidate.no === question.no);
            return sum + (answer?.isCorrect ? 1 : 0);
        }, 0));
        const percentages = totals.map((total) => Math.round((total / worksheet.questions.length) * 100));
        return {
            totals,
            maxTotal: worksheet.questions.length,
            average: percentages.length ? Math.round(percentages.reduce((sum, value) => sum + value, 0) / percentages.length) : 0,
            highest: percentages.length ? Math.max(...percentages) : 0,
            lowest: percentages.length ? Math.min(...percentages) : 0,
            pendingCount: 0,
        };
    }

    const totals = worksheet.students.map((student) => student.answers.reduce((sum, answer) => sum + (answer.score ?? 0), 0));
    const maxTotal = worksheet.questions.reduce((sum, question) => sum + question.maxScore, 0);
    const completedTotals = worksheet.students.filter((student) => student.answers.every((answer) => answer.score !== null)).map((student) => student.answers.reduce((sum, answer) => sum + answer.score, 0));
    const percentages = completedTotals.map((total) => Math.round((total / maxTotal) * 100));
    return {
        totals,
        maxTotal,
        average: percentages.length ? Math.round(percentages.reduce((sum, value) => sum + value, 0) / percentages.length) : 0,
        highest: percentages.length ? Math.max(...percentages) : 0,
        lowest: percentages.length ? Math.min(...percentages) : 0,
        pendingCount: worksheet.students.filter((student) => student.answers.some((answer) => answer.score === null)).length,
    };
};
