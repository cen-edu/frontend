import { getClassName, getClassRoster } from './classes';
import { getStudentPracticeProblems } from './studentWorksheetSolving';

// 학생이 필기로 제출한 원본 답안 이미지. 실제 서비스에서는 서버가 저장한 이미지 URL이 내려온다.
const essayAnswerScan = '/answer-scans/essay-answer.png';
const shortAnswerScan = '/answer-scans/short-answer.png';

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
    { no: 1, unitId: 'm1s1-prime-factor', difficulty: 'low', prompt: '다음 중 소수인 수를 고르세요.', format: 'choice', choices: ['1', '4', '7', '9', '15'], maxScore: 10, answer: '3', rubric: [], gradingStatus: 'auto' },
    { no: 2, unitId: 'm1s1-prime-factor', difficulty: 'low', prompt: '12의 약수의 개수를 고르세요.', format: 'choice', choices: ['2', '3', '4', '5', '6'], maxScore: 10, answer: '4', rubric: [], gradingStatus: 'auto' },
    { no: 3, unitId: 'm1s1-gcd-lcm', difficulty: 'mid', prompt: '12와 18의 공통 소인수의 곱을 구하세요.', format: 'short', maxScore: 10, answer: '2×3', rubric: [{ label: '정답과 동치인 표현', score: 10 }], gradingStatus: 'pending' },
    { no: 4, unitId: 'm1s1-prime-factor', difficulty: 'mid', prompt: '60의 소인수 개수를 고르세요.', format: 'choice', choices: ['2개', '3개', '4개', '5개', '6개'], maxScore: 10, answer: '2', rubric: [], gradingStatus: 'auto' },
    {
        no: 5,
        unitId: 'm1s1-gcd-lcm',
        difficulty: 'high',
        prompt: '최대공약수를 구하는 과정을 설명하세요.',
        format: 'essay',
        maxScore: 10,
        answer: '두 수를 각각 소인수분해한 뒤 공통 소인수를 골라 곱한다.',
        rubric: [
            { label: '두 수를 각각 소인수분해한 수식이 포함되어 있음', score: 4 },
            { label: '공통 소인수를 골라 곱하는 절차가 포함되어 있음', score: 6 },
        ],
        gradingStatus: 'auto',
    },
];

// 종합 평가는 학생 풀이 화면(studentWorksheetSolving)과 같은 10문항으로 맞춘다.
const additionalAssessmentQuestions = Array.from({ length: 5 }, (_, index) => {
    const no = index + 6;
    return {
        no,
        unitId: no % 2 ? 'm1s1-prime-factor' : 'm1s1-gcd-lcm',
        difficulty: no < 11 ? 'low' : no < 16 ? 'mid' : 'high',
        prompt: `${no}번 소인수분해 개념 확인 문제의 정답을 고르세요.`,
        format: 'choice',
        choices: ['정답 보기', '보기 2', '보기 3', '보기 4', '보기 5'],
        maxScore: 10,
        answer: '1',
        rubric: [],
        gradingStatus: 'auto',
    };
});

const assessmentQuestions = [...baseAssessmentQuestions, ...additionalAssessmentQuestions];

// 앞 네 명에게는 채점 화면 검토용 답안(주관식 스캔·서술형 루브릭 근거)을 직접 지정한다.
const handwrittenAnswerSets = [
    {
        answers: [
            { no: 1, input: '3', score: 10, autoScore: 10, gradedBy: 'auto' },
            { no: 2, input: '4', score: 10, autoScore: 10, gradedBy: 'auto' },
            { no: 3, input: '2*3', answerImage: shortAnswerScan, score: null, autoScore: 10, gradedBy: null },
            { no: 4, input: '2', score: 10, autoScore: 10, gradedBy: 'auto' },
            { no: 5, input: '12=2²×3, 18=2×3²이므로 공통인 2와 3을 곱하면 6이다.', answerImage: essayAnswerScan, score: 10, autoScore: 10, gradedBy: 'auto', rubricResults: [{ satisfied: true, evidence: '12=2²×3, 18=2×3²' }, { satisfied: true, evidence: '공통인 2와 3을 곱하면 6이다' }] },
        ],
    },
    {
        answers: [
            { no: 1, input: '3', score: 10, autoScore: 10, gradedBy: 'auto' },
            { no: 2, input: '3', score: 0, autoScore: 0, gradedBy: 'auto' },
            { no: 3, input: '6', answerImage: shortAnswerScan, score: null, autoScore: 0, gradedBy: null },
            { no: 4, input: '2', score: 10, autoScore: 10, gradedBy: 'auto' },
            { no: 5, input: '2와 3을 곱해서 6', answerImage: essayAnswerScan, score: 6, autoScore: 6, gradedBy: 'auto', rubricResults: [{ satisfied: false, evidence: '' }, { satisfied: true, evidence: '2와 3을 곱해서 6' }] },
        ],
    },
    {
        answers: [
            { no: 1, input: '3', score: 10, autoScore: 10, gradedBy: 'auto' },
            { no: 2, input: '4', score: 10, autoScore: 10, gradedBy: 'auto' },
            { no: 3, input: '2 × 3', answerImage: shortAnswerScan, score: null, autoScore: 10, gradedBy: null },
            { no: 4, input: '1', score: 0, autoScore: 0, gradedBy: 'auto' },
            { no: 5, input: '두 수를 소인수분해하고 공통 소인수를 곱한다.', answerImage: essayAnswerScan, score: 6, autoScore: 6, gradedBy: 'auto', rubricResults: [{ satisfied: false, evidence: '' }, { satisfied: true, evidence: '공통 소인수를 곱한다' }] },
        ],
    },
    {
        answers: [
            { no: 1, input: '3', score: 10, autoScore: 10, gradedBy: 'auto' },
            { no: 2, input: '4', score: 10, autoScore: 10, gradedBy: 'auto' },
            { no: 3, input: '2×3', answerImage: shortAnswerScan, score: 10, autoScore: 10, gradedBy: 'auto' },
            { no: 4, input: '2', score: 10, autoScore: 10, gradedBy: 'auto' },
            { no: 5, input: '2와 3을 곱해서 6', answerImage: essayAnswerScan, score: 6, autoScore: 6, gradedBy: 'auto', rubricResults: [{ satisfied: false, evidence: '' }, { satisfied: true, evidence: '2와 3을 곱해서 6' }] },
        ],
    },
];

const generatedBaseAnswers = (studentIndex) => [
    { no: 1, input: studentIndex % 4 === 0 ? '2' : '3', score: studentIndex % 4 === 0 ? 0 : 10, autoScore: studentIndex % 4 === 0 ? 0 : 10, gradedBy: 'auto' },
    { no: 2, input: studentIndex % 3 === 0 ? '3' : '4', score: studentIndex % 3 === 0 ? 0 : 10, autoScore: studentIndex % 3 === 0 ? 0 : 10, gradedBy: 'auto' },
    { no: 3, input: studentIndex % 2 === 0 ? '2×3' : '6', answerImage: shortAnswerScan, score: 10, autoScore: 10, gradedBy: 'auto' },
    { no: 4, input: studentIndex % 5 === 0 ? '1' : '2', score: studentIndex % 5 === 0 ? 0 : 10, autoScore: studentIndex % 5 === 0 ? 0 : 10, gradedBy: 'auto' },
    {
        no: 5,
        input: studentIndex % 2 === 0 ? '두 수를 소인수분해하고 공통 소인수를 곱한다.' : '공통인 2와 3을 곱하면 6이다.',
        answerImage: essayAnswerScan,
        score: 6,
        autoScore: 6,
        gradedBy: 'auto',
        rubricResults: [
            { satisfied: false, evidence: '' },
            { satisfied: true, evidence: studentIndex % 2 === 0 ? '공통 소인수를 곱한다' : '2와 3을 곱하면 6이다' },
        ],
    },
];

// 채점 대상 학생은 반 명단(classes.js)에서 가져오고, 미제출 학생은 결과 표에 넣지 않는다.
// 미제출·채점 대기 학생은 학습 현황(learningStatus)의 같은 학습지 상태와 일치해야 한다.
const gradingRoster = (classId, unsubmittedIds = []) => getClassRoster(classId)
    .filter((student) => !unsubmittedIds.includes(student.id));

const buildAssessmentStudents = (roster, pendingIds = []) => roster.map((student, studentIndex) => {
    const answers = [
        ...(handwrittenAnswerSets[studentIndex]?.answers ?? generatedBaseAnswers(studentIndex)),
        ...additionalAssessmentQuestions.map((question) => {
            const isCorrect = (question.no + studentIndex) % 6 !== 0;
            return { no: question.no, input: isCorrect ? '1' : '2', score: isCorrect ? 10 : 0, autoScore: isCorrect ? 10 : 0, gradedBy: 'auto' };
        }),
    ];
    // 주관식은 교사 확인이 필요한 학생만 채점 대기로 남기고 나머지는 자동 채점 점수를 반영한다.
    return {
        id: student.id,
        number: student.number,
        name: student.name,
        answers: pendingIds.includes(student.id)
            ? answers.map((answer) => (answer.no === 3 ? { ...answer, score: null, gradedBy: null } : answer))
            : answers.map((answer) => (answer.score === null ? { ...answer, score: answer.autoScore, gradedBy: 'auto' } : answer)),
    };
});

const classOneRoster = getClassRoster('middle-1-1');

// 2단원 종합 평가: 송현우 미제출, 최도윤·박지수 주관식 채점 대기
const assessmentStudents = buildAssessmentStudents(gradingRoster('middle-1-1', [1]), [7, 12]);
// 1단원 종합 평가: 이서윤 미제출, 채점 완료
const completedAssessmentStudents = buildAssessmentStudents(gradingRoster('middle-1-1', [15]));
const gcdAssessmentStudents = buildAssessmentStudents(classOneRoster);
const classTwoAssessmentStudents = buildAssessmentStudents(gradingRoster('middle-1-2', [20]));

// 일반 학습은 배점이 없고, 학생 풀이 화면과 같은 steps[].segments[] 구조에서
// 필기 입력 칸(blank) 하나하나를 정답/오답으로만 판정한다.
const practiceQuestions = getStudentPracticeProblems().map((problem, index) => ({
    no: index + 1,
    id: problem.id,
    title: problem.title,
    prompt: problem.prompt,
    difficulty: problem.difficulty,
    concept: problem.concept,
    steps: problem.steps.map((step) => ({
        id: step.id,
        label: step.label,
        instruction: step.instruction,
        conceptId: step.conceptId,
        segments: step.segments,
        blanks: step.segments
            .filter((segment) => segment.type === 'blank')
            .map((segment) => ({ id: segment.id, answer: segment.answer })),
    })),
}));

// 자동 채점이 오답으로 본 칸에 채워 넣을 학생 입력. 실제 연동에서는 필기 인식 결과가 내려온다.
// 학생앱 채점 결과(studentWorksheetReview)도 같은 입력을 사용한다.
export const practiceWrongInputs = {
    'divide-answer': '16',
    'factor-answer': '6',
    answer: '2 × 3²',
    'first-number-answer': '2² × 3',
    'second-number-answer': '2 × 3²',
    'common-factor-answer': '6',
    'factor-84-answer': '2 × 3 × 7',
    'factor-60-answer': '2 × 3 × 5',
    'gcd-answer': '6',
    'conclusion-answer': '6cm',
};

const buildPracticeStudents = (roster, ungradedIds = []) => roster.map((student, studentIndex) => {
    let blankIndex = 0;
    return {
        id: student.id,
        number: student.number,
        name: student.name,
        // 교사가 확인을 마쳤는지 여부. 일반 학습은 점수가 없어 이 값으로 채점 완료를 판단한다.
        graded: !ungradedIds.includes(student.id),
        answers: practiceQuestions.map((question) => ({
            no: question.no,
            blanks: question.steps.flatMap((step) => step.blanks.map((blank) => {
                blankIndex += 1;
                const autoCorrect = (studentIndex + blankIndex) % 4 !== 0;
                return {
                    stepId: step.id,
                    blankId: blank.id,
                    input: autoCorrect ? blank.answer : practiceWrongInputs[blank.id] ?? '풀이 미완성',
                    // 학생이 필기로 제출한 원본 획을 이미지로 만든 결과.
                    answerImage: shortAnswerScan,
                    autoCorrect,
                    correct: autoCorrect,
                    gradedBy: 'auto',
                };
            })),
        })),
    };
});

// 소인수분해 개념 복습은 송현우가 제출하지 않아 결과 표에서 제외한다.
const practiceStudents = buildPracticeStudents(classOneRoster);
const reviewPracticeStudents = buildPracticeStudents(gradingRoster('middle-1-1', [1]));
// 진행 중인 학습지라 아직 교사가 확인하지 않은 학생이 남아 있다.
const factorPracticeStudents = buildPracticeStudents(gradingRoster('middle-1-1', [1]), [7, 12, 13, 15]);

const classOne = { gradeId: 'middle-1', classId: 'middle-1-1', className: getClassName({ grade: '1', name: '1반' }) };
const classTwo = { gradeId: 'middle-1', classId: 'middle-1-2', className: getClassName({ grade: '1', name: '2반' }) };

export const initialAssessmentResults = [
    {
        id: 'factor-assessment', type: 'assessment', title: '2단원 소인수분해 종합 평가',
        ...classOne, term: 'second', assignedAt: '2026.08.04', status: 'grading', modified: false,
        questions: assessmentQuestions,
        students: assessmentStudents,
    },
    {
        id: 'integer-assessment', type: 'assessment', title: '1단원 정수와 유리수 종합 평가',
        ...classOne, term: 'second', assignedAt: '2026.07.18', status: 'confirmed', modified: false,
        questions: assessmentQuestions,
        students: completedAssessmentStudents,
    },
    {
        id: 'factor-practice', type: 'practice', title: '2단원 소인수분해 연습',
        ...classOne, term: 'second', assignedAt: '2026.08.01', status: 'grading', modified: false,
        questions: practiceQuestions,
        students: factorPracticeStudents,
    },
    {
        id: 'unit-2-practice', type: 'practice', title: '2단원 연습',
        ...classOne, term: 'first', assignedAt: '2026.06.24', status: 'confirmed', modified: false,
        questions: practiceQuestions,
        students: practiceStudents,
    },
    {
        id: 'factor-practice-review', type: 'practice', title: '소인수분해 개념 복습',
        ...classOne, term: 'first', assignedAt: '2026.07.06', status: 'confirmed', modified: false,
        questions: practiceQuestions,
        students: reviewPracticeStudents,
    },
    {
        id: 'gcd-lcm-assessment', type: 'assessment', title: '최대공약수와 최소공배수 평가',
        ...classOne, term: 'first', assignedAt: '2026.07.13', status: 'confirmed', modified: false,
        questions: assessmentQuestions,
        students: gcdAssessmentStudents,
    },
    {
        id: 'first-term-final-assessment', type: 'assessment', title: '1학기 학기말 종합 평가',
        ...classTwo, term: 'first', assignedAt: '2026.07.04', status: 'confirmed', modified: true,
        questions: assessmentQuestions,
        students: classTwoAssessmentStudents,
    },
];

const STORAGE_KEY = 'assessment-results-v9';

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

// 일반 학습 문항 결과는 저장하지 않고 칸 판정에서 파생한다.
// 모두 정답이면 O, 일부만 정답이면 △, 정답이 없으면 X 이다.
export const getPracticeQuestionResult = (answer) => {
    const blanks = answer?.blanks ?? [];
    if (!blanks.length || blanks.every((blank) => !blank.input)) return 'empty';
    const correctCount = blanks.filter((blank) => blank.correct).length;
    if (correctCount === blanks.length) return 'correct';
    return correctCount > 0 ? 'partial' : 'wrong';
};

// 부분 정답은 정답 수에 포함하지 않는다.
export const getPracticeCorrectCount = (student) => student.answers
    .filter((answer) => getPracticeQuestionResult(answer) === 'correct').length;

export const isPracticeStudentGraded = (student) => student.graded === true;

export const getWorksheetMetrics = (worksheet) => {
    if (worksheet.type === 'practice') {
        const totals = worksheet.students.map(getPracticeCorrectCount);
        const average = totals.length ? Math.round((totals.reduce((sum, value) => sum + value, 0) / totals.length) * 10) / 10 : 0;
        return {
            totals,
            maxTotal: worksheet.questions.length,
            average,
            highest: totals.length ? Math.max(...totals) : 0,
            lowest: totals.length ? Math.min(...totals) : 0,
            pendingCount: worksheet.students.filter((student) => !isPracticeStudentGraded(student)).length,
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
