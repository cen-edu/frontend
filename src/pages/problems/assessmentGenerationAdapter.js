import { defaultScores } from '../../mocks/labels.js';

const questionTypeValues = {
    choice: 'MULTIPLE_CHOICE',
    short: 'SHORT_INPUT',
    essay: 'ESSAY',
};

const formatValues = {
    MULTIPLE_CHOICE: 'choice',
    SHORT_INPUT: 'short',
    ESSAY: 'essay',
};

const difficultyValues = {
    low: 1,
    mid: 2,
    high: 3,
};

const difficultyKeys = {
    1: 'low',
    2: 'mid',
    3: 'high',
};

const byDisplayOrder = (left, right) => (
    (left.displayOrder ?? 0) - (right.displayOrder ?? 0)
);

export const buildAssessmentGenerationItems = (groups) => groups.flatMap(({ unit, rows }) => (
    rows.map((row) => ({
        subUnitId: Number(unit.id),
        questionType: questionTypeValues[row.format],
        difficulty: difficultyValues[row.difficulty],
        count: Number(row.count),
    }))
));

const normalizeAssessmentProblem = (problem, index) => {
    const curriculum = problem.curriculum ?? {};
    const format = formatValues[problem.questionType];
    const answerUnits = [...(problem.answerUnits ?? [])].sort(byDisplayOrder);
    const mainAnswer = answerUnits[0]?.answer ?? '';
    const assets = [...(problem.assets ?? [])].sort(byDisplayOrder);
    const assetIndex = new Map(assets.map((asset) => [asset.assetKey, asset]));
    const contentBlocks = [...(problem.contentBlocks ?? [])]
        .sort(byDisplayOrder)
        .map((block) => ({
            ...block,
            blockKind: block.blockKind?.toLowerCase() ?? '',
            asset: block.assetRef ? assetIndex.get(block.assetRef) ?? null : null,
        }));
    const prompt = contentBlocks
        .filter((block) => block.blockKind === 'text')
        .map((block) => block.text)
        .filter(Boolean)
        .join('\n');

    return {
        id: problem.id,
        no: index + 1,
        unitId: curriculum.subUnitId,
        unitName: curriculum.subUnitName,
        unitPath: [curriculum.majorUnitName, curriculum.middleUnitName, curriculum.subUnitName]
            .filter(Boolean)
            .join(' > '),
        format,
        difficulty: difficultyKeys[problem.difficulty],
        maxScore: defaultScores[format],
        prompt,
        choices: [...(problem.choices ?? [])].sort(byDisplayOrder),
        answer: mainAnswer,
        modelAnswer: format === 'essay' ? mainAnswer : '',
        rubric: [],
        concept: problem.learningGuide ? {
            title: problem.learningGuide.conceptTitle,
            summary: problem.learningGuide.summary,
            points: problem.learningGuide.keyPoints ?? [],
        } : null,
        questionType: problem.questionType,
        presentation: problem.presentation,
        contentBlocks,
        assets,
        answerUnits,
        explanation: problem.explanation,
        hintText: problem.hintText,
    };
};

export const normalizeGeneratedAssessmentProblems = (problems = []) => (
    problems.map(normalizeAssessmentProblem)
);
