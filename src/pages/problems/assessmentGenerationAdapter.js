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

const getAnswerValue = (answerUnit) => (
    answerUnit?.answerRaw ?? answerUnit?.answer ?? ''
);

const normalizeRubricItem = (item, index) => ({
    ...item,
    rubricKey: item.rubricKey ?? item.key,
    label: item.label ?? item.criteria ?? item.description ?? item.content ?? `채점 기준 ${index + 1}`,
    score: item.score ?? item.points ?? item.maxScore ?? 0,
});

const normalizeAssessmentProblem = (problem, index, existingProblem = null) => {
    const curriculum = problem.curriculum ?? {};
    const format = formatValues[problem.questionType];
    const answerUnits = [...(problem.answerUnits ?? [])].sort(byDisplayOrder);
    const mainAnswer = getAnswerValue(answerUnits[0]);
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
        .map((block) => block.text || block.markup)
        .filter(Boolean)
        .join('\n');

    return {
        id: existingProblem?.id ?? problem.id ?? `session-${problem.sessionId}`,
        no: existingProblem?.no ?? index + 1,
        sessionId: problem.sessionId ?? existingProblem?.sessionId,
        versionId: problem.versionId ?? existingProblem?.versionId,
        finalizedQuestionId: problem.finalizedQuestionId ?? existingProblem?.finalizedQuestionId,
        sourceQuestionId: problem.sourceQuestionId ?? existingProblem?.sourceQuestionId,
        unitId: curriculum.subUnitId ?? existingProblem?.unitId,
        unitName: curriculum.subUnitName ?? existingProblem?.unitName,
        unitPath: [curriculum.majorUnitName, curriculum.middleUnitName, curriculum.subUnitName]
            .filter(Boolean)
            .join(' > ') || existingProblem?.unitPath,
        format,
        difficulty: difficultyKeys[problem.difficulty],
        maxScore: existingProblem?.maxScore ?? defaultScores[format],
        prompt,
        choices: [...(problem.choices ?? [])].sort(byDisplayOrder),
        answer: mainAnswer,
        modelAnswer: format === 'essay' ? mainAnswer : '',
        rubric: [...(problem.rubricItems ?? problem.rubrics ?? problem.rubric ?? [])]
            .sort(byDisplayOrder)
            .map(normalizeRubricItem),
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
    problems.map((problem, index) => normalizeAssessmentProblem(problem, index))
);

export const normalizeAssessmentAuthoringPreview = ({
    preview,
    existingProblem = null,
    slotIndex,
    unit,
    sessionId,
    sourceQuestionId,
}) => {
    const snapshot = preview?.snapshot ?? {};
    const metadata = snapshot.metadata ?? {};
    const resolvedSessionId = preview?.sessionId ?? sessionId ?? existingProblem?.sessionId;
    const problem = {
        id: existingProblem?.id ?? `session-${resolvedSessionId}`,
        sessionId: resolvedSessionId,
        versionId: preview?.versionId,
        finalizedQuestionId: preview?.finalizedQuestionId,
        sourceQuestionId,
        curriculum: {
            subUnitId: metadata.subUnitId ?? unit?.id,
            subUnitName: existingProblem?.unitName ?? unit?.name,
            majorUnitName: unit?.majorName,
            middleUnitName: unit?.middleName,
        },
        difficulty: metadata.difficulty,
        questionType: metadata.questionType,
        presentation: metadata.presentation,
        contentBlocks: snapshot.contentBlocks ?? [],
        assets: snapshot.assets ?? [],
        choices: snapshot.choices ?? [],
        answerUnits: (snapshot.answerUnits ?? []).map((answerUnit) => ({
            ...answerUnit,
            answer: getAnswerValue(answerUnit),
        })),
        rubricItems: snapshot.rubricItems ?? snapshot.rubrics ?? snapshot.rubric ?? [],
        explanation: snapshot.explanation,
        learningGuide: snapshot.learningGuide,
        hintText: snapshot.hintText,
    };

    return normalizeAssessmentProblem(
        problem,
        (slotIndex ?? existingProblem?.no ?? 1) - 1,
        existingProblem,
    );
};

export const normalizeAssessmentGenerationSlots = (slots = [], groups = []) => {
    const unitsById = new Map(groups.map(({ unit }) => [Number(unit.id), unit]));

    return [...slots]
        .filter((slot) => slot.status === 'READY' && slot.preview)
        .sort((left, right) => left.slotIndex - right.slotIndex)
        .map((slot) => {
            const subUnitId = slot.preview.snapshot?.metadata?.subUnitId;

            return normalizeAssessmentAuthoringPreview({
                preview: slot.preview,
                slotIndex: slot.slotIndex,
                unit: unitsById.get(Number(subUnitId)),
                sessionId: slot.sessionId,
                sourceQuestionId: slot.sourceQuestionId,
            });
        });
};

export const normalizeEditedAssessmentProblem = ({ preview, currentProblem }) => (
    normalizeAssessmentAuthoringPreview({ preview, existingProblem: currentProblem })
);
