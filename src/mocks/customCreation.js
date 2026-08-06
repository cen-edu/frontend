import { curriculumUnits, fallbackConcept } from './curriculum';
import { customStageLabels, customStageStepLabels, customStages, defaultSupportModes } from './labels';

export { customStageLabels, customStageStepLabels, customStages };

export const conceptUnitMap = {
    'prime-number': 'm1s1-prime-factor',
    'divisor-factor': 'm1s1-prime-factor',
    'prime-factor': 'm1s1-prime-factor',
    prime: 'm1s1-prime-factor',
    power: 'm1s1-prime-factor',
    'common-divisor': 'm1s1-gcd-lcm',
    common: 'm1s1-gcd-lcm',
    gcd: 'm1s1-gcd-lcm',
    exponent: 'm1s1-gcd-lcm',
    lcm: 'm1s1-gcd-lcm',
};

const unitIndex = new Map(curriculumUnits.flatMap((scope) => scope.majorUnits.flatMap((major) => major.middleUnits.flatMap((middle) => middle.smallUnits.map((unit) => [unit.id, {
    ...unit,
    gradeId: scope.gradeId,
    term: scope.term,
    majorName: major.name,
    middleName: middle.name,
}])))));

export const customUnitIndex = unitIndex;

const text = (value) => ({ type: 'text', value });
const blank = (id, answer) => ({ type: 'blank', id, answer });
const step = (id, segments) => ({ id, segments });

const templates = {
    prime: {
        retrace: { difficulty: 'low', prompt: '30을 소인수분해하시오.', steps: [step('s1', [text('30 = 2 × '), blank('b1', '15'), text('이다.')]), step('s2', [text('따라서 30 = '), blank('b2', '2 × 3 × 5'), text('이다.')])] },
        basic: { difficulty: 'mid', prompt: '84를 소인수분해하시오.', steps: [step('s1', [text('84를 소수의 곱으로 나타내면 '), blank('b1', '2² × 3 × 7'), text('이다.')])] },
        independent: { difficulty: 'mid', prompt: '126을 소인수분해하시오.', steps: [step('s1', [text('최종 답: '), blank('b1', '2 × 3² × 7')])] },
    },
    common: {
        retrace: { difficulty: 'low', prompt: '18과 24의 최대공약수를 구하시오.', steps: [step('s1', [text('18 = '), blank('b1', '2 × 3²'), text(', 24 = '), blank('b2', '2³ × 3'), text('이다.')]), step('s2', [text('공통 소인수의 작은 지수를 고르면 '), blank('b3', '2 × 3'), text('이다.')]), step('s3', [text('따라서 최대공약수는 '), blank('b4', '6'), text('이다.')])] },
        basic: { difficulty: 'mid', prompt: '30과 45의 최대공약수를 구하시오.', steps: [step('s1', [text('공통 소인수의 곱은 '), blank('b1', '3 × 5'), text('이다.')]), step('s2', [text('따라서 최대공약수는 '), blank('b2', '15'), text('이다.')])] },
        independent: { difficulty: 'mid', prompt: '42와 70의 최대공약수를 구하시오.', steps: [step('s1', [text('최종 답: '), blank('b1', '14')])] },
    },
    exponent: {
        retrace: { difficulty: 'low', prompt: '12와 20의 최소공배수를 구하시오.', steps: [step('s1', [text('12 = '), blank('b1', '2² × 3'), text(', 20 = '), blank('b2', '2² × 5'), text('이다.')]), step('s2', [text('각 소인수의 큰 지수를 고르면 '), blank('b3', '2² × 3 × 5'), text('이다.')]), step('s3', [text('따라서 최소공배수는 '), blank('b4', '60'), text('이다.')])] },
        basic: { difficulty: 'mid', prompt: '18과 30의 최소공배수를 구하시오.', steps: [step('s1', [text('각 소인수의 큰 지수를 적용하면 '), blank('b1', '2 × 3² × 5'), text('이다.')]), step('s2', [text('따라서 최소공배수는 '), blank('b2', '90'), text('이다.')])] },
        independent: { difficulty: 'high', prompt: '24와 90의 최소공배수를 구하시오.', steps: [step('s1', [text('최종 답: '), blank('b1', '360')])] },
    },
};

const fallbackTemplate = (label, stage) => ({
    difficulty: stage === 'retrace' ? 'low' : stage === 'independent' ? 'high' : 'mid',
    prompt: `${label} 개념을 적용해 답을 구하시오.`,
    steps: [step('s1', [text(stage === 'independent' ? '최종 답: ' : '핵심 값을 구하면 '), blank('b1', '정답')])],
});

export function getAvailableCustomUnits(worksheet) {
    const scope = curriculumUnits.find((item) => item.gradeId === worksheet.gradeId && item.term === (worksheet.term ?? 'first'));
    return scope?.majorUnits.flatMap((major) => major.middleUnits.flatMap((middle) => middle.smallUnits.map((unit) => ({ ...unit, majorName: major.name, middleName: middle.name })))) ?? [];
}

export function buildProposal(worksheet, student) {
    if (student.status === 'stable') return { configs: [], reason: '취약 개념 없음' };
    if (student.status === 'insufficient') return { configs: [], reason: '응답 부족으로 제안 불가' };

    const grouped = new Map();
    student.responses.forEach((response) => {
        const question = worksheet.questions.find((item) => item.no === response.no);
        response.steps?.forEach((responseStep) => {
            if (responseStep.correct) return;
            const sourceStep = question?.steps?.find((item) => item.order === responseStep.order);
            if (!sourceStep?.conceptId) return;
            const current = grouped.get(sourceStep.conceptId) ?? { conceptId: sourceStep.conceptId, sourceQuestionNos: [], incorrectSteps: [] };
            if (!current.sourceQuestionNos.includes(response.no)) current.sourceQuestionNos.push(response.no);
            current.incorrectSteps.push({ questionNo: response.no, stepOrder: responseStep.order, label: sourceStep.label, input: responseStep.input ?? '' });
            grouped.set(sourceStep.conceptId, current);
        });
    });

    const configs = [...grouped.values()].map((item) => {
        const unitId = conceptUnitMap[item.conceptId];
        const unit = unitIndex.get(unitId);
        return {
            ...item,
            unitId,
            conceptLabel: worksheet.concepts.find((concept) => concept.id === item.conceptId)?.label ?? unit?.name ?? item.conceptId,
            sourceQuestionNo: item.sourceQuestionNos[0],
            counts: { retrace: 1, basic: 1, independent: 1 },
            manual: false,
        };
    });
    return { configs, reason: configs.length ? '' : '취약 개념을 찾지 못했습니다.' };
}

export function createManualConfig(unit) {
    return {
        conceptId: `manual-${unit.id}`,
        unitId: unit.id,
        conceptLabel: unit.name,
        sourceQuestionNo: null,
        sourceQuestionNos: [],
        incorrectSteps: [],
        counts: { retrace: 0, basic: 1, independent: 1 },
        manual: true,
    };
}

export function generateCustomProblems(student, configs) {
    let no = 0;
    return customStages.flatMap((stage) => configs.flatMap((config) => {
        const unit = unitIndex.get(config.unitId);
        const selected = templates[config.conceptId]?.[stage] ?? fallbackTemplate(config.conceptLabel, stage);
        return Array.from({ length: config.counts[stage] }, (_, index) => {
            no += 1;
            const unique = `${student.id}-${config.conceptId}-${config.unitId}-${stage}-${index + 1}`;
            return {
                id: unique,
                no,
                studentId: student.id,
                unitId: config.unitId,
                unitName: unit?.name ?? config.conceptLabel,
                unitPath: unit ? `${unit.majorName} > ${unit.middleName} > ${unit.name}` : config.conceptLabel,
                difficulty: selected.difficulty,
                concept: unit?.concept ?? fallbackConcept(config.conceptLabel),
                stage,
                sourceQuestionNo: stage === 'retrace' ? config.sourceQuestionNo : null,
                prompt: selected.prompt,
                steps: selected.steps.map((item, stepIndex) => ({
                    ...item,
                    id: `${unique}-s${stepIndex + 1}`,
                    conceptId: config.conceptId,
                    segments: item.segments.map((segment) => segment.type === 'blank' ? { ...segment, id: `${unique}-${segment.id}` } : segment),
                })),
            };
        });
    }));
}

export function createCustomAssignment(student, dueAt, problems, supports = {}) {
    const totalUnits = problems.reduce((sum, problem) => sum + problem.steps.reduce((stepSum, currentStep) => stepSum + currentStep.segments.filter((segment) => segment.type === 'blank').length, 0), 0);
    return { studentId: student.id, mode: 'custom', dueAt, status: 'assigned', type: 'practice', origin: 'custom', totalUnits, supports: Object.fromEntries(problems.map((problem) => [problem.id, supports[problem.id] ?? defaultSupportModes.custom])) };
}
