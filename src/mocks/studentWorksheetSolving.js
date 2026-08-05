import { customStageLabels, defaultScores } from './labels';

// 종합 평가 문항은 교사용 문제 생성·채점과 같은 구조(format, difficulty, maxScore)를 사용한다.
const factorProblems = [
    { no: 1, difficulty: 'low', prompt: '다음 중 소수인 것을 고르시오.', format: 'choice', choices: ['1', '2', '9', '17', '21'], answer: '2', maxScore: defaultScores.choice },
    { no: 2, difficulty: 'low', prompt: '36을 소인수분해하시오.', format: 'short', answer: '2² × 3²', guide: '거듭제곱을 사용해 답을 입력하세요.', maxScore: defaultScores.short },
    { no: 3, difficulty: 'mid', prompt: '72의 소인수를 모두 구하시오.', format: 'short', answer: '2, 3', guide: '답이 여러 개라면 쉼표로 구분하세요.', maxScore: defaultScores.short },
    { no: 4, difficulty: 'mid', prompt: '두 수 24, 60의 최대공약수를 구하시오.', format: 'short', answer: '12', maxScore: defaultScores.short },
    { no: 5, difficulty: 'mid', prompt: '두 수 18, 30의 최소공배수를 구하시오.', format: 'short', answer: '90', maxScore: defaultScores.short },
    { no: 6, difficulty: 'mid', prompt: '어떤 자연수를 소인수분해했더니 2³ × 3²이 되었습니다. 이 자연수를 구하시오.', format: 'short', answer: '72', maxScore: defaultScores.short },
    {
        no: 7,
        difficulty: 'high',
        prompt: '가로가 84cm, 세로가 60cm인 직사각형 모양의 종이를 남김없이 가장 큰 정사각형으로 나누려고 합니다.',
        subPrompt: '정사각형 한 변의 길이와 만들어지는 정사각형의 개수를 구하는 과정을 서술하시오.',
        format: 'essay',
        answer: '84와 60의 최대공약수는 12이므로 한 변의 길이는 12cm이고, (84÷12)×(60÷12)=35개가 만들어진다.',
        rubric: [
            { label: '최대공약수를 구하는 과정 제시', score: 2 },
            { label: '한 변의 길이와 개수 계산', score: 3 },
        ],
        maxScore: defaultScores.essay,
    },
    { no: 8, difficulty: 'high', prompt: '두 자연수의 최대공약수가 8이고 최소공배수가 120일 때, 두 자연수의 곱을 구하시오.', format: 'short', answer: '960', maxScore: defaultScores.short },
    { no: 9, difficulty: 'high', prompt: '서로 맞물려 돌아가는 두 톱니바퀴 A, B의 톱니 수는 각각 18개, 24개입니다. 두 톱니바퀴가 처음과 같은 위치에서 다시 만날 때까지 A는 몇 바퀴 도는지 구하시오.', format: 'short', answer: '4', maxScore: defaultScores.short },
    { no: 10, difficulty: 'high', prompt: '2² × 3 × 5²에 가장 작은 자연수를 곱하여 어떤 자연수의 제곱이 되게 하려고 합니다. 곱해야 할 수를 구하시오.', format: 'short', answer: '3', maxScore: defaultScores.short },
];

const fallbackProblems = factorProblems.map((problem) => ({ ...problem }));

export const getStudentWorksheetProblems = () => fallbackProblems;

const practiceProblems = [
    {
        id: 'prime-factor-36',
        title: '소인수분해하기',
        difficulty: 'low',
        prompt: '36을 소인수분해하시오.',
        concept: {
            title: '소인수분해',
            summary: '자연수를 소수인 인수들의 곱으로 나타내는 것을 소인수분해라고 합니다.',
            points: ['작은 소수부터 차례대로 나눕니다.', '같은 소인수는 거듭제곱으로 나타냅니다.'],
            example: '12 = 2² × 3',
        },
        steps: [
            { id: 'divide', label: '풀이 과정 1', conceptId: 'm1s1-prime-factor', instruction: '36을 가장 작은 소수 2로 차례대로 나눕니다.', segments: [{ type: 'text', value: '36 = 2 ×' }, { type: 'blank', id: 'divide-answer', answer: '18' }] },
            { id: 'factor', label: '풀이 과정 2', conceptId: 'm1s1-prime-factor', instruction: '남은 수를 다시 소수의 곱으로 나타냅니다.', segments: [{ type: 'text', value: '18 = 2 ×' }, { type: 'blank', id: 'factor-answer', answer: '9' }] },
            { id: 'answer', label: '풀이 과정 3', conceptId: 'm1s1-prime-factor', instruction: '같은 소인수를 거듭제곱으로 정리합니다.', segments: [{ type: 'text', value: '36 =' }, { type: 'blank', id: 'answer', answer: '2² × 3²' }] },
        ],
    },
    {
        id: 'gcd-24-36',
        title: '최대공약수 구하기',
        difficulty: 'mid',
        prompt: '24와 36의 최대공약수를 소인수분해를 이용하여 구하시오.',
        concept: {
            title: '최대공약수',
            summary: '공통인 소인수를 지수가 작거나 같은 쪽에 맞춰 곱하면 최대공약수를 구할 수 있습니다.',
            points: ['두 수를 각각 소인수분해합니다.', '공통 소인수의 작은 지수를 선택합니다.'],
            example: '12 = 2² × 3, 18 = 2 × 3²',
        },
        steps: [
            { id: 'first-number', label: '풀이 과정 1', conceptId: 'm1s1-gcd-lcm', instruction: '24를 소인수분해합니다.', segments: [{ type: 'text', value: '24 =' }, { type: 'blank', id: 'first-number-answer', answer: '2³ × 3' }] },
            { id: 'second-number', label: '풀이 과정 2', conceptId: 'm1s1-gcd-lcm', instruction: '36을 소인수분해합니다.', segments: [{ type: 'text', value: '36 =' }, { type: 'blank', id: 'second-number-answer', answer: '2² × 3²' }] },
            { id: 'common-factor', label: '풀이 과정 3', conceptId: 'm1s1-gcd-lcm', instruction: '공통인 소인수의 거듭제곱을 골라 곱합니다.', segments: [{ type: 'text', value: '최대공약수 =' }, { type: 'blank', id: 'common-factor-answer', answer: '12' }] },
        ],
    },
    {
        id: 'tile-rectangle',
        title: '최대공약수 활용하기',
        difficulty: 'high',
        prompt: '가로 84cm, 세로 60cm인 직사각형을 가장 큰 정사각형으로 남김없이 나누려고 합니다. 정사각형 한 변의 길이를 구하시오.',
        concept: {
            title: '최대공약수의 활용',
            summary: '두 길이를 똑같은 크기로 남김없이 나눌 때 가장 큰 단위는 두 수의 최대공약수입니다.',
            points: ['문제에서 반복되는 두 수를 찾습니다.', '가장 큰 단위를 묻는다면 최대공약수를 생각합니다.'],
            example: '가로와 세로를 모두 나눌 수 있는 가장 큰 길이',
        },
        steps: [
            { id: 'factor-84', label: '풀이 과정 1', conceptId: 'm1s1-gcd-lcm', instruction: '84를 소인수분해합니다.', segments: [{ type: 'text', value: '84 =' }, { type: 'blank', id: 'factor-84-answer', answer: '2² × 3 × 7' }] },
            { id: 'factor-60', label: '풀이 과정 2', conceptId: 'm1s1-gcd-lcm', instruction: '60을 소인수분해합니다.', segments: [{ type: 'text', value: '60 =' }, { type: 'blank', id: 'factor-60-answer', answer: '2² × 3 × 5' }] },
            { id: 'gcd', label: '풀이 과정 3', conceptId: 'm1s1-gcd-lcm', instruction: '두 수에 공통으로 들어 있는 소인수를 곱합니다.', segments: [{ type: 'text', value: '84와 60의 최대공약수 =' }, { type: 'blank', id: 'gcd-answer', answer: '12' }] },
            { id: 'conclusion', label: '답', conceptId: 'm1s1-gcd-lcm', instruction: '따라서 정사각형 한 변의 길이를 씁니다.', segments: [{ type: 'text', value: '한 변의 길이 =' }, { type: 'blank', id: 'conclusion-answer', answer: '12cm' }] },
        ],
    },
];

export const getStudentPracticeProblems = () => practiceProblems.map((problem) => ({
    ...problem,
    concept: { ...problem.concept, points: [...problem.concept.points] },
    steps: problem.steps.map((step) => ({ ...step })),
}));

const retraceProblem = practiceProblems[2];

const customProblems = [
    {
        ...retraceProblem,
        id: 'custom-retrace-tile',
        stage: 'retrace',
        title: '최대공약수 활용하기',
    },
    {
        ...retraceProblem,
        id: 'custom-similar-tile',
        stage: 'basic',
        difficulty: 'mid',
        title: '쌍둥이 문제',
        prompt: '가로 72cm, 세로 48cm인 직사각형을 가장 큰 정사각형으로 남김없이 나누려고 합니다. 정사각형 한 변의 길이를 구하시오.',
        steps: [
            { id: 'factor-72', label: '풀이 과정 1', conceptId: 'm1s1-gcd-lcm', instruction: '72를 소인수분해합니다.', segments: [{ type: 'text', value: '72 =' }, { type: 'blank', id: 'factor-72-answer', answer: '2³ × 3²' }] },
            { id: 'factor-48', label: '풀이 과정 2', conceptId: 'm1s1-gcd-lcm', instruction: '48을 소인수분해합니다.', segments: [{ type: 'text', value: '48 =' }, { type: 'blank', id: 'factor-48-answer', answer: '2⁴ × 3' }] },
            { id: 'gcd', label: '풀이 과정 3', conceptId: 'm1s1-gcd-lcm', instruction: '두 수에 공통으로 들어 있는 소인수를 곱합니다.', segments: [{ type: 'text', value: '72와 48의 최대공약수 =' }, { type: 'blank', id: 'gcd-answer', answer: '24' }] },
            { id: 'conclusion', label: '답', conceptId: 'm1s1-gcd-lcm', instruction: '따라서 정사각형 한 변의 길이를 씁니다.', segments: [{ type: 'text', value: '한 변의 길이 =' }, { type: 'blank', id: 'conclusion-answer', answer: '24cm' }] },
        ],
    },
    {
        ...retraceProblem,
        id: 'custom-independent-ribbon',
        stage: 'independent',
        difficulty: 'high',
        title: '응용 문제',
        prompt: '길이가 84cm인 빨간 리본과 60cm인 파란 리본을 남김없이 똑같은 길이로 가장 길게 자르려고 합니다. 자른 리본 조각의 전체 개수를 구하시오.',
        steps: [
            { id: 'common-length', label: '풀이 과정 1', conceptId: 'm1s1-gcd-lcm', instruction: '두 리본을 똑같이 나눌 수 있는 가장 긴 길이를 구합니다.', segments: [{ type: 'text', value: '84와 60의 최대공약수 =' }, { type: 'blank', id: 'common-length-answer', answer: '12' }] },
            { id: 'red-count', label: '풀이 과정 2', conceptId: 'm1s1-gcd-lcm', instruction: '빨간 리본에서 나오는 조각 수를 구합니다.', segments: [{ type: 'text', value: '84 ÷ 12 =' }, { type: 'blank', id: 'red-count-answer', answer: '7' }] },
            { id: 'blue-count', label: '풀이 과정 3', conceptId: 'm1s1-gcd-lcm', instruction: '파란 리본에서 나오는 조각 수를 구합니다.', segments: [{ type: 'text', value: '60 ÷ 12 =' }, { type: 'blank', id: 'blue-count-answer', answer: '5' }] },
            { id: 'total-count', label: '답', conceptId: 'm1s1-gcd-lcm', instruction: '두 리본의 조각 수를 더합니다.', segments: [{ type: 'text', value: '전체 조각 수 =' }, { type: 'blank', id: 'total-count-answer', answer: '12개' }] },
        ],
    },
];

export const getStudentCustomProblems = () => customProblems.map((problem) => ({
    ...problem,
    stageLabel: customStageLabels[problem.stage],
    concept: { ...problem.concept, points: [...problem.concept.points] },
    steps: problem.steps.map((step) => ({
        ...step,
        segments: step.segments.map((segment) => ({ ...segment })),
    })),
}));
