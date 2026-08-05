const factorProblems = [
    { no: 1, difficulty: '하', prompt: '다음 중 소수인 것을 모두 고르시오.', type: 'choice', choices: ['1', '2', '9', '17', '21'], answer: ['2', '17'] },
    { no: 2, difficulty: '하', prompt: '36을 소인수분해하시오.', type: 'text', guide: '거듭제곱을 사용해 답을 입력하세요.' },
    { no: 3, difficulty: '중', prompt: '72의 소인수를 모두 구하시오.', type: 'text', guide: '답이 여러 개라면 쉼표로 구분하세요.' },
    { no: 4, difficulty: '중', prompt: '두 수 24, 60의 최대공약수를 구하시오.', type: 'text' },
    { no: 5, difficulty: '중', prompt: '두 수 18, 30의 최소공배수를 구하시오.', type: 'text' },
    { no: 6, difficulty: '중', prompt: '어떤 자연수를 소인수분해했더니 2³ × 3²이 되었습니다. 이 자연수를 구하시오.', type: 'text' },
    {
        no: 7,
        difficulty: '상',
        prompt: '가로가 84cm, 세로가 60cm인 직사각형 모양의 종이를 남김없이 가장 큰 정사각형으로 나누려고 합니다.',
        subPrompt: '정사각형 한 변의 길이와 만들어지는 정사각형의 개수를 각각 구하시오.',
        type: 'multi',
        fields: [
            { id: 'length', label: '한 변의 길이', suffix: 'cm' },
            { id: 'count', label: '정사각형의 개수', suffix: '개' },
        ],
    },
    { no: 8, difficulty: '상', prompt: '두 자연수의 최대공약수가 8이고 최소공배수가 120일 때, 두 자연수의 곱을 구하시오.', type: 'text' },
    { no: 9, difficulty: '상', prompt: '서로 맞물려 돌아가는 두 톱니바퀴 A, B의 톱니 수는 각각 18개, 24개입니다. 두 톱니바퀴가 처음과 같은 위치에서 다시 만날 때까지 A는 몇 바퀴 도는지 구하시오.', type: 'text' },
    { no: 10, difficulty: '상', prompt: '2² × 3 × 5²에 가장 작은 자연수를 곱하여 어떤 자연수의 제곱이 되게 하려고 합니다. 곱해야 할 수를 구하시오.', type: 'text' },
];

const fallbackProblems = factorProblems.map((problem) => ({ ...problem }));

export const getStudentWorksheetProblems = () => fallbackProblems;

