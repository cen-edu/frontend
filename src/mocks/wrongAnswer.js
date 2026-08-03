const students = [
    { id: 101, name: '김민수' },
    { id: 102, name: '박지수' },
    { id: 103, name: '정도윤' },
    { id: 104, name: '조현우' },
    { id: 105, name: '이서윤' },
    { id: 106, name: '한예린' },
    { id: 107, name: '윤하준' },
    { id: 108, name: '오서아' },
];

export const wrongAnswerFilterOptions = {
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

export const wrongAnswerWorksheets = [
    {
        id: 'factor-assessment', gradeId: 'middle-1', classId: 'middle-1-1', term: 'first', assignedAt: '2026.07.29', type: 'assessment', title: '2단원 소인수분해 종합평가', className: '중학교 1학년 1반', assignStatus: 'none',
        wrongItems: [
            { id: 'q9', no: 9, conceptId: 'multiple', conceptLabel: '최소공배수', prompt: '18과 24의 최소공배수를 구하세요.', answer: '72', explanation: '18=2×3², 24=2³×3이므로 각 소인수의 큰 지수를 곱해 2³×3²=72입니다.', explanationReady: true, wrongStudentIds: [101, 102, 103, 105, 107, 108], commonWrongInputs: [{ input: '36', count: 4 }, { input: '42', count: 2 }] },
            { id: 'q4', no: 4, conceptId: 'common', conceptLabel: '공통 소인수 선택', prompt: '12와 18의 최대공약수를 구하세요.', answer: '6', explanation: '12=2²×3, 18=2×3²으로 소인수분해합니다. 두 수에 공통인 소인수의 작은 지수를 곱하면 2×3=6입니다.', explanationReady: true, wrongStudentIds: [101, 103, 105, 108], commonWrongInputs: [{ input: '2×6', count: 3 }, { input: '36', count: 1 }] },
            { id: 'q7', no: 7, conceptId: 'divisor', conceptLabel: '약수의 개수', prompt: '72의 약수의 개수를 구하세요.', answer: '12개', explanation: '', explanationReady: false, wrongStudentIds: [102, 103, 106, 107], commonWrongInputs: [{ input: '10개', count: 2 }] },
            { id: 'q3', no: 3, conceptId: 'prime', conceptLabel: '소인수분해', prompt: '60을 소인수분해하세요.', answer: '2²×3×5', explanation: '60을 소수로 차례로 나누면 60=2×2×3×5이므로 2²×3×5입니다.', explanationReady: true, wrongStudentIds: [103, 107, 108], commonWrongInputs: [{ input: '2×30', count: 2 }] },
        ],
        assignments: [],
    },
    {
        id: 'factor-practice', gradeId: 'middle-1', classId: 'middle-1-1', term: 'first', assignedAt: '2026.07.31', type: 'practice', title: '2단원 소인수분해 연습', className: '중학교 1학년 1반', assignStatus: 'reviewing',
        wrongItems: [
            { id: 'c-common', conceptId: 'common', conceptLabel: '공통 소인수 선택', prompt: '두 수의 공통인 소인수를 고르는 학습입니다.', answer: '두 수 모두의 인수인 소수', explanation: '각 수를 소인수분해한 뒤 두 식에 공통으로 들어 있는 소인수를 찾습니다.', explanationReady: true, wrongStudentIds: [101, 103, 105, 108], commonWrongInputs: [{ input: '2×6', count: 3 }] },
            { id: 'c-prime', conceptId: 'prime', conceptLabel: '소인수분해', prompt: '합성수를 소수의 곱으로 나타내는 학습입니다.', answer: '소수만 남을 때까지 나누기', explanation: '가장 작은 소수부터 차례로 나누고 같은 소수는 지수로 정리합니다.', explanationReady: true, wrongStudentIds: [103, 107, 108], commonWrongInputs: [{ input: '2×30', count: 2 }] },
            { id: 'c-exponent', conceptId: 'exponent', conceptLabel: '지수 비교', prompt: '최대공약수와 최소공배수를 구할 때 지수를 비교합니다.', answer: '최대공약수는 작은 지수, 최소공배수는 큰 지수', explanation: '', explanationReady: false, wrongStudentIds: [102, 105, 107], commonWrongInputs: [{ input: '항상 큰 지수', count: 2 }] },
        ],
        assignments: [
            { studentId: 105, name: '이서윤', itemNos: ['c-common', 'c-prime', 'c-exponent'], mode: 'explanation-retry', viewed: 3, retried: 2, dueAt: '2026-08-05 18:00', status: 'reviewing' },
            { studentId: 103, name: '정도윤', itemNos: ['c-common', 'c-prime'], mode: 'explanation-retry', viewed: 0, retried: 0, dueAt: '2026-08-05 18:00', status: 'not-started' },
            { studentId: 101, name: '김민수', itemNos: ['c-common', 'c-prime'], mode: 'explanation-retry', viewed: 2, retried: 2, dueAt: '2026-08-03 18:00', status: 'done' },
        ],
    },
    {
        id: 'factor-custom', gradeId: 'middle-1', classId: 'middle-1-1', term: 'first', assignedAt: '2026.07.21', type: 'practice', title: '공통소인수 맞춤 학습', className: '중학교 1학년 1반', assignStatus: 'done',
        wrongItems: [
            { id: 'custom-common', conceptId: 'common', conceptLabel: '공통 소인수 적용', prompt: '서로 다른 구조에서 공통 소인수를 찾는 학습입니다.', answer: '공통인 소수와 지수 확인', explanation: '수의 크기보다 소인수분해한 식에서 공통 요소를 먼저 확인합니다.', explanationReady: true, wrongStudentIds: [102, 103, 108], commonWrongInputs: [{ input: '공배수 선택', count: 2 }] },
        ],
        assignments: [
            { studentId: 102, name: '박지수', itemNos: ['custom-common'], mode: 'explanation', viewed: 1, retried: 0, dueAt: '2026-07-31 18:00', status: 'done' },
            { studentId: 103, name: '정도윤', itemNos: ['custom-common'], mode: 'explanation', viewed: 1, retried: 0, dueAt: '2026-07-31 18:00', status: 'done' },
            { studentId: 108, name: '오서아', itemNos: ['custom-common'], mode: 'explanation', viewed: 1, retried: 0, dueAt: '2026-07-31 18:00', status: 'done' },
        ],
    },
];

export const wrongAnswerStudents = students;

export const wrongAnswerStatusLabels = { none: '미배정', reviewing: '복습 중', done: '완료' };
export const reviewStatusLabels = { 'not-started': '미시작', reviewing: '진행 중', done: '완료' };

export const getWorksheetWrongCount = (worksheet) => worksheet.wrongItems.reduce((sum, item) => sum + item.wrongStudentIds.length, 0);
