export const assessmentResultFilterOptions = {
    grades: [
        { value: 'all', label: '전체 학년' },
        { value: 'middle-1', label: '중학교 1학년' },
    ],
    classes: [
        { value: 'all', label: '전체 반' },
        { value: 'middle-1-1', label: '1반' },
        { value: 'middle-1-2', label: '2반' },
    ],
};

const students = [
    {
        id: 101, number: 1, name: '김민서', grade: 'B',
        answers: [
            { no: 1, input: '3', score: 5, autoScore: 5, gradedBy: 'auto' },
            { no: 2, input: '12', score: 5, autoScore: 5, gradedBy: 'auto' },
            { no: 3, input: '2*3', score: null, autoScore: 0, gradedBy: null },
            { no: 4, input: '2', score: 5, autoScore: 5, gradedBy: 'auto' },
            { no: 5, input: '12=2²×3, 18=2×3²이므로 공통인 2와 3을 곱하면 6이다.', score: null, autoScore: null, gradedBy: null },
        ],
    },
    {
        id: 102, number: 2, name: '박준호', grade: 'C',
        answers: [
            { no: 1, input: '3', score: 5, autoScore: 5, gradedBy: 'auto' },
            { no: 2, input: '10', score: 0, autoScore: 0, gradedBy: 'auto' },
            { no: 3, input: '6', score: null, autoScore: 0, gradedBy: null },
            { no: 4, input: '2', score: 5, autoScore: 5, gradedBy: 'auto' },
            { no: 5, input: '2와 3을 곱해서 6', score: 2, autoScore: null, gradedBy: 'teacher' },
        ],
    },
    {
        id: 103, number: 3, name: '이서윤', grade: '-',
        answers: [
            { no: 1, input: '3', score: 5, autoScore: 5, gradedBy: 'auto' },
            { no: 2, input: '12', score: 5, autoScore: 5, gradedBy: 'auto' },
            { no: 3, input: '2 × 3', score: null, autoScore: 0, gradedBy: null },
            { no: 4, input: '1', score: 0, autoScore: 0, gradedBy: 'auto' },
            { no: 5, input: '두 수를 소인수분해하고 공통 소인수를 곱한다.', score: null, autoScore: null, gradedBy: null },
        ],
    },
    {
        id: 104, number: 4, name: '최지우', grade: 'B',
        answers: [
            { no: 1, input: '3', score: 5, autoScore: 5, gradedBy: 'auto' },
            { no: 2, input: '12', score: 5, autoScore: 5, gradedBy: 'auto' },
            { no: 3, input: '2×3', score: 3, autoScore: 3, gradedBy: 'auto' },
            { no: 4, input: '2', score: 5, autoScore: 5, gradedBy: 'auto' },
            { no: 5, input: '2와 3을 곱해서 6', score: 2, autoScore: null, gradedBy: 'teacher' },
        ],
    },
];

export const initialAssessmentResults = [
    {
        id: 'semester-assessment-1', type: 'assessment', title: '1학기 종합평가',
        gradeId: 'middle-1', classId: 'middle-1-1', className: '중학교 1학년 1반', assignedAt: '2026.07.29', status: 'grading', modified: false,
        questions: [
            { no: 1, format: 'choice', maxScore: 5, answer: '3', rubric: [], gradingStatus: 'auto' },
            { no: 2, format: 'choice', maxScore: 5, answer: '12', rubric: [], gradingStatus: 'auto' },
            { no: 3, format: 'short', maxScore: 3, answer: '2×3', rubric: [{ label: '정답과 동치인 표현', score: 3 }], gradingStatus: 'pending' },
            { no: 4, format: 'choice', maxScore: 5, answer: '2', rubric: [], gradingStatus: 'auto' },
            { no: 5, format: 'essay', maxScore: 5, answer: '두 수를 각각 소인수분해한 뒤 공통 소인수를 곱한다.', rubric: [{ label: '소인수분해 서술', score: 2 }, { label: '공통 소인수 언급', score: 2 }, { label: '최종 답 정확', score: 1 }], gradingStatus: 'pending' },
        ],
        students,
    },
    {
        id: 'unit-2-practice', type: 'practice', title: '2단원 연습',
        gradeId: 'middle-1', classId: 'middle-1-1', className: '중학교 1학년 1반', assignedAt: '2026.07.21', status: 'confirmed', modified: false,
        questions: [
            { no: 1, format: 'short', maxScore: 5, answer: '8', rubric: [], gradingStatus: 'auto' },
            { no: 2, format: 'short', maxScore: 5, answer: '15', rubric: [], gradingStatus: 'auto' },
            { no: 3, format: 'choice', maxScore: 5, answer: '2', rubric: [], gradingStatus: 'auto' },
            { no: 4, format: 'short', maxScore: 5, answer: '24', rubric: [], gradingStatus: 'auto' },
        ],
        students: students.map((student, index) => ({
            id: student.id, number: student.number, name: student.name, grade: index < 2 ? 'A' : 'B',
            answers: [5, 5 - (index % 2) * 2, 5, 3 + (index % 2) * 2].map((score, answerIndex) => ({ no: answerIndex + 1, input: String(score), score, autoScore: score, gradedBy: 'auto' })),
        })),
    },
];

export const getAssessmentResults = () => {
    try {
        const saved = window.localStorage.getItem('assessment-results');
        if (!saved) return initialAssessmentResults;
        return JSON.parse(saved).map((result) => {
            const initialResult = initialAssessmentResults.find((item) => item.id === result.id);
            return {
                ...result,
                gradeId: result.gradeId ?? initialResult?.gradeId,
                className: initialResult?.className ?? result.className,
                assignedAt: result.assignedAt ?? initialResult?.assignedAt,
            };
        });
    } catch {
        return initialAssessmentResults;
    }
};

export const saveAssessmentResults = (results) => {
    try {
        window.localStorage.setItem('assessment-results', JSON.stringify(results));
    } catch {
        // 저장소가 제한된 환경에서도 현재 화면의 채점 상태는 계속 유지한다.
    }
};

export const getWorksheetMetrics = (worksheet) => {
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
