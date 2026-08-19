import { defaultUnitCounts } from '../../mocks/problemCreation.js';

const questionTypeOrder = ['choice', 'short', 'step', 'essay'];
const difficultyOrder = ['low', 'mid', 'high'];

const compareGenSpec = (left, right) => (
    Number(left.subUnitId) - Number(right.subUnitId)
    || questionTypeOrder.indexOf(left.questionType) - questionTypeOrder.indexOf(right.questionType)
    || difficultyOrder.indexOf(left.difficulty) - difficultyOrder.indexOf(right.difficulty)
);

const normalizeGenSpec = (genSpec = []) => [...genSpec]
    .filter((item) => (
        Number.isInteger(Number(item.subUnitId))
        && questionTypeOrder.includes(item.questionType)
        && difficultyOrder.includes(item.difficulty)
        && Number.isInteger(Number(item.count))
        && Number(item.count) > 0
    ))
    .map((item) => ({
        ...item,
        subUnitId: Number(item.subUnitId),
        count: Number(item.count),
    }))
    .sort(compareGenSpec);

export const normalizeWorksheetGenSpec = (response) => ({
    ...response,
    sourceWorksheetId: Number(response.sourceWorksheetId),
    gradeId: `middle-${response.grade}`,
    term: response.semester,
    genSpec: normalizeGenSpec(response.genSpec),
});

export const buildPracticePrefillConfigs = (genSpec) => {
    const configsByUnit = new Map();

    genSpec.forEach((item) => {
        const config = configsByUnit.get(item.subUnitId) ?? {
            unitId: item.subUnitId,
            counts: { ...defaultUnitCounts },
        };

        config.counts[item.difficulty] += item.count;
        configsByUnit.set(item.subUnitId, config);
    });

    return [...configsByUnit.values()];
};

export const buildAssessmentPrefillGroups = (genSpec, createRowId) => {
    const groupsByUnit = new Map();

    genSpec
        .filter((item) => ['choice', 'short', 'essay'].includes(item.questionType))
        .forEach((item) => {
            const specsByCondition = groupsByUnit.get(item.subUnitId) ?? new Map();
            const conditionKey = `${item.questionType}:${item.difficulty}`;
            const condition = specsByCondition.get(conditionKey) ?? {
                format: item.questionType,
                difficulty: item.difficulty,
                count: 0,
            };

            condition.count += item.count;
            specsByCondition.set(conditionKey, condition);
            groupsByUnit.set(item.subUnitId, specsByCondition);
        });

    return [...groupsByUnit].map(([unitId, specsByCondition]) => ({
        unitId,
        rows: [...specsByCondition.values()].flatMap((condition) => {
            const rowCount = Math.ceil(condition.count / 10);

            return Array.from({ length: rowCount }, (_, index) => ({
                id: createRowId(),
                format: condition.format,
                difficulty: condition.difficulty,
                count: Math.min(10, condition.count - index * 10),
            }));
        }),
    }));
};
