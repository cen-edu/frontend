import { difficultyLevels } from '../../mocks/labels.js';

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

export const buildProblemGenerationItems = (configs) => configs.flatMap(({ unit, counts }) => (
    difficultyLevels.flatMap((difficulty) => {
        const count = Number(counts[difficulty]);

        if (!Number.isInteger(count) || count < 1) return [];

        return [{
            subUnitId: Number(unit.id),
            difficulty: difficultyValues[difficulty],
            count,
        }];
    })
));

const normalizeContentBlock = (block) => ({
    ...block,
    blockKind: block.blockKind?.toLowerCase() ?? '',
});

const normalizeSegment = ({ segment, problemId, stepId, answerUnitIndex, segmentIndex }) => {
    const type = segment.type?.toUpperCase();
    const answerUnit = answerUnitIndex.get(segment.blankId);
    const segmentId = `${problemId}-${stepId}-${segment.blankId ?? segmentIndex}`;

    if (type === 'BLANK') {
        return {
            type: 'blank',
            id: segmentId,
            blankId: segment.blankId,
            answer: answerUnit?.answer ?? '',
            answerUnit,
        };
    }

    if (type === 'ANSWER_REF') {
        return {
            type: 'answerRef',
            id: segmentId,
            value: segment.value ?? '',
            blankId: segment.blankId,
            answer: answerUnit?.answer ?? null,
        };
    }

    return {
        type: 'text',
        value: segment.value ?? '',
    };
};

const normalizeProblem = (problem, index) => {
    const curriculum = problem.curriculum ?? {};
    const answerUnits = [...(problem.answerUnits ?? [])].sort(byDisplayOrder);
    const answerUnitIndex = new Map(answerUnits.map((unit) => [unit.unitKey, unit]));
    const contentBlocks = [...(problem.contentBlocks ?? [])]
        .sort(byDisplayOrder)
        .map(normalizeContentBlock);
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
        difficulty: difficultyKeys[problem.difficulty],
        prompt,
        concept: problem.learningGuide ? {
            title: problem.learningGuide.conceptTitle,
            summary: problem.learningGuide.summary,
            points: problem.learningGuide.keyPoints ?? [],
        } : null,
        steps: [...(problem.steps ?? [])].sort(byDisplayOrder).map((step, stepIndex) => ({
            id: step.id,
            conceptId: curriculum.subUnitId,
            label: step.label || `풀이 과정 ${stepIndex + 1}`,
            instruction: '빈칸에 알맞은 답을 써서 풀이 과정을 완성합니다.',
            segments: (step.segments ?? []).map((segment, segmentIndex) => normalizeSegment({
                segment,
                problemId: problem.id,
                stepId: step.id,
                answerUnitIndex,
                segmentIndex,
            })),
        })),
        questionType: problem.questionType,
        presentation: problem.presentation,
        contentBlocks,
        assets: problem.assets ?? [],
        choices: problem.choices ?? [],
        answerUnits,
        explanation: problem.explanation,
        hintText: problem.hintText,
    };
};

export const normalizeGeneratedProblems = (problems = []) => problems.map(normalizeProblem);
