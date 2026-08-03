export const difficultyLevels = ['low', 'mid', 'high'];
export const difficultyLabels = { low: '하', mid: '중', high: '상' };
export const defaultUnitCounts = { low: 0, mid: 0, high: 0 };

const step = (id, segments) => ({ id, segments });
const text = (value) => ({ type: 'text', value });
const blank = (id, answer) => ({ type: 'blank', id, answer });
const template = (prompt, ...steps) => ({ prompt, steps });

export const problemTemplates = {
    'm1s1-prime-number': {
        low: [template('다음 중 소수를 고르시오. ① 1  ② 2  ③ 9  ④ 15', step('s1', [text('약수가 1과 자기 자신뿐인 수는 '), blank('b1', '2'), text('이다.')]))],
        mid: [template('20보다 크고 30보다 작은 소수를 모두 구하시오.', step('s1', [text('조건을 만족하는 소수는 '), blank('b1', '23, 29'), text('이다.')]))],
        high: [template('두 소수의 합이 19일 때, 두 소수의 곱을 구하시오.', step('s1', [text('두 소수는 2와 '), blank('b1', '17'), text('이다.')]), step('s2', [text('따라서 두 수의 곱은 '), blank('b2', '34'), text('이다.')]))],
    },
    'm1s1-prime-factor': {
        low: [template('18을 소인수분해하시오.', step('s1', [text('18 = 2 × '), blank('b1', '9'), text('이다.')]), step('s2', [text('따라서 18 = '), blank('b2', '2 × 3²'), text('이다.')]))],
        mid: [template('180을 소인수분해하시오.', step('s1', [text('180 = 2 × '), blank('b1', '90'), text('이다.')]), step('s2', [text('따라서 180 = '), blank('b2', '2² × 3² × 5'), text('이다.')]))],
        high: [template('360에 가장 작은 자연수를 곱하여 어떤 자연수의 제곱이 되게 하려고 한다. 곱해야 할 수를 구하시오.', step('s1', [text('360 = '), blank('b1', '2³ × 3² × 5'), text('이다.')]), step('s2', [text('지수를 모두 짝수로 만들기 위해 곱할 수는 '), blank('b2', '10'), text('이다.')]))],
    },
    'm1s1-gcd-lcm': {
        low: [template('12와 18의 최대공약수를 구하시오.', step('s1', [text('12와 18의 공통인 소인수의 곱은 '), blank('b1', '6'), text('이다.')]))],
        mid: [template('24와 36의 최소공배수를 구하시오.', step('s1', [text('24 = 2³ × 3, 36 = 2² × 3²이므로 최소공배수는 '), blank('b1', '72'), text('이다.')]))],
        high: [template('두 자연수의 최대공약수가 6이고 최소공배수가 72일 때, 두 수의 곱을 구하시오.', step('s1', [text('두 수의 곱은 최대공약수와 최소공배수의 곱이므로 '), blank('b1', '432'), text('이다.')]))],
    },
    'm1s1-integer-add-subtract': {
        low: [template('(-3)+7을 계산하시오.', step('s1', [text('부호가 다른 두 수의 절댓값의 차는 '), blank('b1', '4'), text('이다.')]))],
        mid: [template('5-(-8)+(-3)을 계산하시오.', step('s1', [text('5+8-3 = '), blank('b1', '10'), text('이다.')]))],
        high: [template('수직선에서 -4보다 7만큼 큰 수와 3보다 5만큼 작은 수의 합을 구하시오.', step('s1', [text('두 수는 각각 3과 '), blank('b1', '-2'), text('이다.')]), step('s2', [text('따라서 합은 '), blank('b2', '1'), text('이다.')]))],
    },
    'm1s1-linear-equation': {
        low: [template('방정식 x+5=12를 푸시오.', step('s1', [text('x = 12-5 = '), blank('b1', '7'), text('이다.')]))],
        mid: [template('방정식 3x-4=11을 푸시오.', step('s1', [text('3x = '), blank('b1', '15'), text('이다.')]), step('s2', [text('따라서 x = '), blank('b2', '5'), text('이다.')]))],
        high: [template('방정식 2(x-3)=3x-10을 푸시오.', step('s1', [text('2x-6 = 3x-10이므로 x = '), blank('b1', '4'), text('이다.')]))],
    },
};

const fallbackConcept = (unitName) => ({
    title: unitName,
    summary: `${unitName}의 정의와 기본 원리를 적용해 풀이 과정을 완성합니다.`,
    points: ['문제의 조건을 식이나 도형으로 정리합니다.', '계산 결과가 조건에 맞는지 확인합니다.'],
});

const fallbackTemplate = (unit, difficulty, index) => template(
    `${unit.name}의 핵심 원리를 적용하는 ${difficultyLabels[difficulty]} 난이도 문제 ${index + 1}입니다.`,
    step('s1', [text('주어진 조건을 정리하면 핵심 값은 '), blank('b1', '정답'), text('이다.')]),
);

export function generateProblems(configs) {
    let no = 0;
    return configs.flatMap(({ unit, counts }) => difficultyLevels.flatMap((difficulty) => {
        const templates = problemTemplates[unit.id]?.[difficulty] ?? [];
        return Array.from({ length: counts[difficulty] }, (_, index) => {
            const selectedTemplate = templates[index % templates.length] ?? fallbackTemplate(unit, difficulty, index);
            no += 1;
            return {
                id: `${unit.id}-${difficulty}-${index + 1}`,
                no,
                unitId: unit.id,
                unitName: unit.name,
                unitPath: `${unit.majorName} > ${unit.middleName} > ${unit.name}`,
                difficulty,
                concept: unit.concept ?? fallbackConcept(unit.name),
                prompt: selectedTemplate.prompt,
                steps: selectedTemplate.steps.map((item, stepIndex) => ({
                    ...item,
                    id: `${unit.id}-${difficulty}-${index + 1}-s${stepIndex + 1}`,
                    conceptId: unit.id,
                    segments: item.segments.map((segment) => segment.type === 'blank' ? { ...segment, id: `${unit.id}-${difficulty}-${index + 1}-${segment.id}` } : segment),
                })),
            };
        });
    }));
}
