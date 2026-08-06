import { fallbackConcept } from './curriculum';
import { defaultScores, difficultyLabels, formatLabels, questionFormats } from './labels';

export { defaultScores, formatLabels, questionFormats };

const choice = (prompt, choices, answer) => ({ prompt, choices, answer });
const short = (prompt, answer) => ({ prompt, answer });
const essay = (prompt, modelAnswer, rubric) => ({ prompt, modelAnswer, rubric });

export const assessmentProblemTemplates = {
    'm1s1-prime-number': {
        choice: {
            low: [choice('다음 중 소수인 것은?', ['1', '9', '13', '21', '27'], '3')],
            mid: [choice('20보다 크고 30보다 작은 소수의 개수는?', ['1개', '2개', '3개', '4개', '5개'], '2')],
            high: [choice('두 소수의 합이 홀수일 때 반드시 포함되는 소수는?', ['2', '3', '5', '7', '11'], '1')],
        },
        short: {
            low: [short('10보다 작은 소수를 모두 쓰시오.', '2, 3, 5, 7')],
            mid: [short('30과 40 사이의 소수를 모두 쓰시오.', '31, 37')],
            high: [short('두 소수의 합이 19이고 차가 15일 때 두 소수의 곱을 구하시오.', '34')],
        },
        essay: {
            low: [essay('1이 소수가 아닌 이유를 약수의 개수를 이용하여 설명하시오.', '소수는 약수가 2개여야 하지만 1의 약수는 1 하나뿐이므로 소수가 아니다.', [{ label: '소수의 정의 제시', score: 2 }, { label: '1의 약수 개수 설명', score: 2 }, { label: '결론', score: 1 }])],
            mid: [essay('91이 합성수임을 설명하시오.', '91은 7×13으로 나타낼 수 있어 1과 자기 자신 이외의 약수를 가지므로 합성수이다.', [{ label: '인수분해', score: 2 }, { label: '합성수의 정의 연결', score: 2 }, { label: '결론', score: 1 }])],
            high: [essay('2를 제외한 모든 소수가 홀수인 이유를 설명하시오.', '2보다 큰 짝수는 모두 2를 약수로 가지므로 소수가 될 수 없다. 따라서 2를 제외한 소수는 홀수이다.', [{ label: '짝수의 약수 성질', score: 2 }, { label: '소수의 정의 적용', score: 2 }, { label: '결론', score: 1 }])],
        },
    },
    'm1s1-prime-factor': {
        choice: {
            low: [choice('18을 소인수분해한 것은?', ['2×9', '3×6', '2×3²', '2²×3', '3³'], '3')],
            mid: [choice('180의 소인수분해로 옳은 것은?', ['2²×3²×5', '2×3²×5', '2²×3×5', '2³×3²', '3²×5²'], '1')],
            high: [choice('360에 가장 작은 자연수를 곱하여 완전제곱수가 되게 할 때, 그 자연수는?', ['2', '3', '5', '10', '15'], '4')],
        },
        short: {
            low: [short('24를 소인수분해하시오.', '2³×3')],
            mid: [short('2³×3²의 약수의 개수를 구하시오.', '12')],
            high: [short('72를 가장 작은 자연수로 나누어 완전제곱수가 되게 할 때, 나누는 수를 구하시오.', '2')],
        },
        essay: {
            low: [essay('36을 소인수분해하는 과정을 설명하시오.', '36을 소수로 차례로 나누면 36=2×2×3×3=2²×3²이다.', [{ label: '소수로 분해', score: 2 }, { label: '지수 표현', score: 2 }, { label: '최종 답', score: 1 }])],
            mid: [essay('소인수분해를 이용해 60의 약수의 개수를 구하는 과정을 설명하시오.', '60=2²×3×5이므로 약수의 개수는 (2+1)(1+1)(1+1)=12개이다.', [{ label: '소인수분해', score: 2 }, { label: '약수 개수 공식 적용', score: 2 }, { label: '최종 답', score: 1 }])],
            high: [essay('180에 자연수를 곱하여 완전제곱수를 만드는 가장 작은 수를 구하고 이유를 설명하시오.', '180=2²×3²×5이므로 지수가 홀수인 5를 한 번 더 곱해야 한다. 따라서 가장 작은 수는 5이다.', [{ label: '소인수분해', score: 2 }, { label: '지수 조건 설명', score: 2 }, { label: '최종 답', score: 1 }])],
        },
    },
    'm1s1-linear-equation': {
        choice: {
            low: [choice('방정식 x+5=12의 해는?', ['5', '6', '7', '8', '9'], '3')],
            mid: [choice('방정식 3x-4=11의 해는?', ['3', '4', '5', '6', '7'], '3')],
            high: [choice('방정식 2(x-3)=3x-10의 해는?', ['2', '3', '4', '5', '6'], '3')],
        },
        short: {
            low: [short('방정식 2x=14를 푸시오.', 'x=7')],
            mid: [short('방정식 5x+3=2x+18을 푸시오.', 'x=5')],
            high: [short('방정식 (x-2)/3=(x+2)/5를 푸시오.', 'x=8')],
        },
        essay: {
            low: [essay('방정식 x+7=15의 풀이 과정을 등식의 성질을 이용하여 설명하시오.', '양변에서 7을 빼면 x=8이다.', [{ label: '등식의 성질 적용', score: 2 }, { label: '계산 과정', score: 2 }, { label: '최종 답', score: 1 }])],
            mid: [essay('방정식 4x-5=2x+9의 풀이 과정을 설명하시오.', 'x항은 왼쪽, 상수항은 오른쪽으로 이항하면 2x=14이므로 x=7이다.', [{ label: '항의 이항', score: 2 }, { label: '계산 과정', score: 2 }, { label: '최종 답', score: 1 }])],
            high: [essay('어떤 수의 3배에서 4를 뺀 값이 그 수의 2배에 7을 더한 값과 같을 때, 어떤 수를 구하는 식과 풀이를 쓰시오.', '어떤 수를 x라 하면 3x-4=2x+7이다. 이 식을 풀면 x=11이다.', [{ label: '미지수 설정과 식', score: 2 }, { label: '방정식 풀이', score: 2 }, { label: '최종 답', score: 1 }])],
        },
    },
};

const fallbackTemplates = {
    choice: (unit, difficulty, index) => choice(
        `${unit.name}의 ${difficultyLabels[difficulty]} 난이도 개념을 바르게 설명한 것을 고르시오. (${index + 1})`,
        ['정의에 맞는 설명', '조건이 빠진 설명', '반대되는 설명', '관련 없는 설명', '항상 성립하지 않는 설명'],
        '1',
    ),
    short: (unit, difficulty, index) => short(`${unit.name}의 핵심 원리를 적용하여 답을 구하시오. (${difficultyLabels[difficulty]} ${index + 1})`, '정답'),
    essay: (unit, difficulty, index) => essay(
        `${unit.name}의 핵심 원리를 적용하는 과정을 설명하시오. (${difficultyLabels[difficulty]} ${index + 1})`,
        `${unit.name}의 정의와 조건을 확인하고 풀이 과정과 결론을 순서대로 서술한다.`,
        [{ label: '핵심 개념 적용', score: 2 }, { label: '풀이 과정', score: 2 }, { label: '결론', score: 1 }],
    ),
};

export function generateAssessmentProblems(items) {
    let no = 0;
    return items.flatMap(({ unit, format, difficulty, count }) => Array.from({ length: count }, (_, index) => {
        const templates = assessmentProblemTemplates[unit.id]?.[format]?.[difficulty] ?? [];
        const selectedTemplate = templates[index % templates.length] ?? fallbackTemplates[format](unit, difficulty, index);
        no += 1;
        const common = {
            id: `assessment-question-${no}`,
            no,
            unitId: unit.id,
            unitName: unit.name,
            unitPath: `${unit.majorName} > ${unit.middleName} > ${unit.name}`,
            format,
            difficulty,
            concept: unit.concept ?? fallbackConcept(unit.name),
            maxScore: defaultScores[format],
            prompt: selectedTemplate.prompt,
        };

        if (format === 'choice') return { ...common, choices: selectedTemplate.choices, answer: selectedTemplate.answer, rubric: [] };
        if (format === 'short') return { ...common, answer: selectedTemplate.answer, rubric: [] };
        return { ...common, modelAnswer: selectedTemplate.modelAnswer, answer: selectedTemplate.modelAnswer, rubric: selectedTemplate.rubric };
    }));
}
