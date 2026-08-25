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

const getDifficultyKey = (difficulty) => (
    difficultyKeys[difficulty] ?? difficulty
);

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
    const unitKey = segment.unitKey ?? segment.blankId;
    const answerUnit = answerUnitIndex.get(unitKey);
    const segmentId = `${problemId}-${stepId}-${unitKey ?? segmentIndex}`;

    if (type === 'BLANK') {
        return {
            type: 'blank',
            id: segmentId,
            blankId: unitKey,
            unitKey,
            answer: answerUnit?.answer ?? '',
            answerUnit,
        };
    }

    if (type === 'ANSWER_REF') {
        return {
            type: 'answerRef',
            id: segmentId,
            value: segment.value ?? '',
            blankId: unitKey,
            unitKey,
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
    const assets = [...(problem.assets ?? [])].sort(byDisplayOrder);
    const assetIndex = new Map(assets.map((asset) => [asset.assetKey, asset]));
    const contentBlocks = [...(problem.contentBlocks ?? [])]
        .sort(byDisplayOrder)
        .map((block) => ({
            ...normalizeContentBlock(block),
            asset: block.assetRef ? assetIndex.get(block.assetRef) ?? null : null,
        }));
    const prompt = contentBlocks
        .filter((block) => block.blockKind === 'text')
        .map((block) => block.text || block.markup)
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
        difficulty: getDifficultyKey(problem.difficulty),
        prompt,
        concept: problem.learningGuide ? {
            title: problem.learningGuide.conceptTitle,
            summary: problem.learningGuide.summary,
            points: problem.learningGuide.keyPoints ?? [],
        } : null,
        steps: [...(problem.steps ?? [])].sort(byDisplayOrder).map((step, stepIndex) => ({
            id: step.id,
            stepKey: step.stepKey ?? step.id,
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
        assets,
        choices: problem.choices ?? [],
        answerUnits,
        explanation: problem.explanation,
        hintText: problem.hintText,
    };
};

export const normalizeGeneratedProblems = (problems = []) => problems.map(normalizeProblem);

export const normalizeAuthoringPreview = ({ preview, existingProblem, slotIndex }) => {
    const snapshot = preview?.snapshot ?? {};
    const metadata = snapshot.metadata ?? {};
    const sessionId = preview?.sessionId ?? existingProblem?.sessionId;
    const baseProblem = {
        id: existingProblem?.id ?? `session-${sessionId}`,
        sessionId,
        versionId: preview?.versionId,
        finalizedQuestionId: preview?.finalizedQuestionId,
        sourceQuestionId: preview?.sourceQuestionId ?? existingProblem?.sourceQuestionId,
        curriculum: {
            subUnitId: metadata.subUnitId,
            subUnitName: existingProblem?.unitName ?? '',
        },
        difficulty: metadata.difficulty,
        questionType: metadata.questionType,
        presentation: metadata.presentation,
        contentBlocks: snapshot.contentBlocks ?? [],
        assets: snapshot.assets ?? [],
        choices: snapshot.choices ?? [],
        steps: (snapshot.steps ?? []).map((step) => ({
            ...step,
            id: step.stepKey,
            segments: (step.segments ?? []).map((segment) => ({
                ...segment,
                value: segment.text,
                blankId: segment.unitKey,
            })),
        })),
        answerUnits: (snapshot.answerUnits ?? []).map((unit) => ({
            ...unit,
            answer: unit.answerRaw,
        })),
        explanation: snapshot.explanation,
        learningGuide: snapshot.learningGuide,
    };
    const normalized = normalizeProblem(baseProblem, (slotIndex ?? existingProblem?.no ?? 1) - 1);

    return {
        ...normalized,
        id: baseProblem.id,
        no: existingProblem?.no ?? normalized.no,
        sessionId,
        versionId: preview?.versionId,
        finalizedQuestionId: preview?.finalizedQuestionId,
        sourceQuestionId: preview?.sourceQuestionId ?? existingProblem?.sourceQuestionId,
        unitId: metadata.subUnitId ?? existingProblem?.unitId,
        unitName: existingProblem?.unitName ?? normalized.unitName,
        unitPath: existingProblem?.unitPath ?? normalized.unitPath,
    };
};

export const normalizeAuthoringGenerationSlots = (slots = [], configs = []) => {
    const unitsById = new Map(configs.map(({ unit }) => [Number(unit.id), unit]));

    return [...slots]
        .filter((slot) => slot.status === 'READY' && slot.preview)
        .sort((left, right) => left.slotIndex - right.slotIndex)
        .map((slot) => {
            const unit = unitsById.get(Number(slot.preview.snapshot?.metadata?.subUnitId));
            const existingProblem = unit ? {
                id: `session-${slot.sessionId}`,
                sessionId: slot.sessionId,
                sourceQuestionId: slot.sourceQuestionId,
                no: slot.slotIndex,
                unitId: unit.id,
                unitName: unit.name,
                unitPath: [unit.majorName, unit.middleName, unit.name].filter(Boolean).join(' > '),
            } : null;

            return normalizeAuthoringPreview({
                preview: slot.preview,
                existingProblem,
                slotIndex: slot.slotIndex,
            });
        });
};
