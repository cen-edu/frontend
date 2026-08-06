import { customStageLabels } from './labels';

// 종합 평가 문항별 배점은 100점 기준으로 균등 배분한다(10문항 × 10점).
const assessmentQuestionScore = 10;

// 종합 평가 문항은 교사용 문제 생성·채점과 같은 구조(format, difficulty, maxScore)를 사용하고,
// 채점 결과 화면에서 학생에게 보여 줄 해설(explanation)을 문항마다 함께 저장한다.
const factorProblems = [
    {
        no: 1,
        unitId: 'm1s1-prime-factor',
        difficulty: 'low',
        prompt: '다음 중 소수인 것을 고르시오.',
        format: 'choice',
        choices: ['1', '4', '9', '17', '21'],
        answer: '17',
        maxScore: assessmentQuestionScore,
        explanation: '소수는 1과 자기 자신만을 약수로 갖는 1보다 큰 자연수입니다. 1은 소수도 합성수도 아니고 4 = 2², 9 = 3², 21 = 3 × 7이라 합성수입니다. 17은 1과 17 말고는 약수가 없으므로 소수입니다.',
    },
    {
        no: 2,
        unitId: 'm1s1-prime-factor',
        difficulty: 'low',
        prompt: '36을 소인수분해하시오.',
        format: 'short',
        answer: '2² × 3²',
        guide: '거듭제곱을 사용해 답을 입력하세요.',
        maxScore: assessmentQuestionScore,
        explanation: '작은 소수부터 차례로 나누면 36 = 2 × 18 = 2 × 2 × 9 = 2 × 2 × 3 × 3입니다. 같은 소인수를 거듭제곱으로 묶으면 2² × 3²이 됩니다.',
    },
    {
        no: 3,
        unitId: 'm1s1-prime-factor',
        difficulty: 'mid',
        prompt: '72의 소인수를 모두 구하시오.',
        format: 'short',
        answer: '2, 3',
        guide: '답이 여러 개라면 쉼표로 구분하세요.',
        maxScore: assessmentQuestionScore,
        explanation: '72 = 2³ × 3²이므로 소인수분해에 나타나는 소수는 2와 3입니다. 소인수를 물으면 지수는 빼고 소수만 답합니다.',
    },
    {
        no: 4,
        unitId: 'm1s1-gcd-lcm',
        difficulty: 'mid',
        prompt: '두 수 24, 60의 최대공약수를 구하시오.',
        format: 'short',
        answer: '12',
        maxScore: assessmentQuestionScore,
        explanation: '24 = 2³ × 3, 60 = 2² × 3 × 5입니다. 공통 소인수 2와 3의 작은 지수를 골라 곱하면 2² × 3 = 12입니다.',
    },
    {
        no: 5,
        unitId: 'm1s1-gcd-lcm',
        difficulty: 'mid',
        prompt: '두 수 18, 30의 최소공배수를 구하시오.',
        format: 'short',
        answer: '90',
        maxScore: assessmentQuestionScore,
        explanation: '18 = 2 × 3², 30 = 2 × 3 × 5입니다. 두 수에 나온 소인수를 모두 모아 큰 지수를 골라 곱하면 2 × 3² × 5 = 90입니다.',
    },
    {
        no: 6,
        unitId: 'm1s1-prime-factor',
        difficulty: 'mid',
        prompt: '어떤 자연수를 소인수분해했더니 2³ × 3²이 되었습니다. 이 자연수를 구하시오.',
        format: 'short',
        answer: '72',
        maxScore: assessmentQuestionScore,
        explanation: '소인수분해 결과를 다시 곱하면 원래 수가 됩니다. 2³ = 8, 3² = 9이므로 8 × 9 = 72입니다.',
    },
    {
        no: 7,
        unitId: 'm1s1-gcd-lcm',
        difficulty: 'high',
        prompt: '가로가 84cm, 세로가 60cm인 직사각형 모양의 종이를 남김없이 가장 큰 정사각형으로 나누려고 합니다.',
        subPrompt: '정사각형 한 변의 길이와 만들어지는 정사각형의 개수를 구하는 과정을 서술하시오.',
        format: 'essay',
        answer: '84와 60의 최대공약수는 12이므로 한 변의 길이는 12cm이고, (84÷12)×(60÷12)=35개가 만들어진다.',
        rubric: [
            { label: '최대공약수를 구하는 과정 제시', score: 4 },
            { label: '한 변의 길이와 개수 계산', score: 6 },
        ],
        maxScore: assessmentQuestionScore,
        explanation: '가로와 세로를 모두 남김없이 나누는 가장 큰 길이는 두 수의 최대공약수입니다. 84 = 2² × 3 × 7, 60 = 2² × 3 × 5이므로 최대공약수는 2² × 3 = 12이고, 정사각형은 가로로 84 ÷ 12 = 7개, 세로로 60 ÷ 12 = 5개씩 놓여 7 × 5 = 35개가 됩니다.',
    },
    {
        no: 8,
        unitId: 'm1s1-gcd-lcm',
        difficulty: 'high',
        prompt: '두 자연수의 최대공약수가 8이고 최소공배수가 120일 때, 두 자연수의 곱을 구하시오.',
        format: 'short',
        answer: '960',
        maxScore: assessmentQuestionScore,
        explanation: '두 자연수의 곱은 (최대공약수) × (최소공배수)와 같습니다. 따라서 8 × 120 = 960입니다.',
    },
    {
        no: 9,
        unitId: 'm1s1-gcd-lcm',
        difficulty: 'high',
        prompt: '서로 맞물려 돌아가는 두 톱니바퀴 A, B의 톱니 수는 각각 18개, 24개입니다. 두 톱니바퀴가 처음과 같은 위치에서 다시 만날 때까지 A는 몇 바퀴 도는지 구하시오.',
        format: 'short',
        answer: '4',
        maxScore: assessmentQuestionScore,
        explanation: '처음 위치에서 다시 만나려면 맞물린 톱니 수가 18과 24의 공배수여야 하고, 가장 빨리 만나는 때는 최소공배수인 72개입니다. A는 72 ÷ 18 = 4바퀴를 돕니다.',
    },
    {
        no: 10,
        unitId: 'm1s1-prime-factor',
        difficulty: 'high',
        prompt: '2² × 3 × 5²에 가장 작은 자연수를 곱하여 어떤 자연수의 제곱이 되게 하려고 합니다. 곱해야 할 수를 구하시오.',
        format: 'short',
        answer: '3',
        maxScore: assessmentQuestionScore,
        explanation: '어떤 자연수의 제곱이 되려면 모든 소인수의 지수가 짝수여야 합니다. 2와 5의 지수는 이미 2로 짝수이고 3만 지수가 1로 홀수이므로 3을 한 번 더 곱하면 (2 × 3 × 5)²이 됩니다.',
    },
];

const fallbackProblems = factorProblems.map((problem) => ({ ...problem }));

export const getStudentWorksheetProblems = () => fallbackProblems;

const practiceProblems = [
    {
        id: 'prime-factor-36',
        title: '소인수분해하기',
        difficulty: 'low',
        prompt: '36을 소인수분해하시오.',
        explanation: '소인수분해는 더 이상 나눌 수 없을 때까지 작은 소수로 나누는 과정입니다. 몫이 소수가 되면 나누기를 멈추고, 같은 소인수끼리 거듭제곱으로 묶어 정리합니다.',
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
        explanation: '두 수를 각각 소인수분해한 뒤 양쪽에 모두 들어 있는 소인수만 고릅니다. 이때 지수는 두 수 중 작은 쪽을 골라야 두 수를 모두 나눌 수 있습니다.',
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
        explanation: '가로와 세로를 모두 남김없이 나눌 수 있는 길이는 두 수의 공약수이고, 그중 가장 큰 값이 최대공약수입니다. 그래서 84와 60을 각각 소인수분해한 뒤 공통 소인수를 곱해 한 변의 길이를 구합니다.',
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
