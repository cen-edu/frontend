import { customStageLabels } from '../../mocks/labels.js';

const getTextBlocks = (blocks = []) => blocks
    .filter((block) => block.blockKind?.toUpperCase() === 'TEXT')
    .sort((left, right) => left.displayOrder - right.displayOrder)
    .map((block) => block.text)
    .filter(Boolean);

export const adaptContentBlocks = (blocks = []) => blocks.map((block) => ({
    ...block,
    blockKind: block.blockKind?.toLowerCase(),
    asset: block.imageUrl ? { url: block.imageUrl, altText: block.text || '문항 참고 자료' } : undefined,
}));

export const adaptWorksheetItem = (item) => {
    const textBlocks = getTextBlocks(item.contentBlocks);
    const savedByUnitId = Object.fromEntries(
        item.answerUnits.map((unit) => [unit.answerUnitId, unit.saved]),
    );

    return {
        ...item,
        id: item.worksheetItemId,
        no: item.displayOrder,
        title: item.customStage ? `${customStageLabels[item.customStage]} 학습` : '풀이 문제',
        prompt: textBlocks[0] || '문제의 발문을 확인하세요.',
        subPrompt: textBlocks.slice(1).join('\n'),
        contentBlocks: adaptContentBlocks(item.contentBlocks),
        choices: item.choices?.map((choice) => ({
            id: choice.choiceId,
            text: choice.text,
            displayOrder: choice.displayOrder,
        })) ?? null,
        steps: item.steps?.map((step) => ({
            ...step,
            id: step.stepId,
            segments: step.segments.map((segment, index) => ({
                ...segment,
                id: segment.answerUnitId ?? `${step.stepId}-text-${index}`,
                answerUnitId: segment.answerUnitId,
                value: segment.type === 'answerRef'
                    ? savedByUnitId[segment.answerUnitId]?.rawLatex
                    : segment.value,
            })),
        })) ?? [],
        stageLabel: item.customStage ? customStageLabels[item.customStage] : null,
    };
};

export const getSavedAnswers = (items = []) => Object.fromEntries(items.map((item) => [
    item.worksheetItemId,
    Object.fromEntries(item.answerUnits.map((unit) => [unit.answerUnitId, {
        answerUnitId: unit.answerUnitId,
        selectedChoiceId: unit.saved.selectedChoiceId,
        rawLatex: unit.saved.rawLatex,
        hasHandwriting: unit.saved.hasHandwriting,
    }])),
]));

const fillResultSteps = (detailItem, resultItem) => {
    const resultByUnitId = Object.fromEntries(
        resultItem.answerUnits.map((unit) => [unit.answerUnitId, unit]),
    );

    return (detailItem.steps ?? []).map((step) => ({
        ...step,
        id: step.stepId,
        segments: step.segments.map((segment, index) => {
            const resultUnit = resultByUnitId[segment.answerUnitId];
            return {
                ...segment,
                id: segment.answerUnitId ?? `${step.stepId}-text-${index}`,
                input: resultUnit?.myAnswer,
                answer: resultUnit?.correctAnswer,
                correct: resultUnit?.result === 'correct',
            };
        }),
    }));
};

export const adaptStudentReview = (result, detail) => {
    const detailByItemId = Object.fromEntries(
        detail.items.map((item) => [item.worksheetItemId, item]),
    );

    const questions = result.items.map((item) => {
        const detailItem = detailByItemId[item.worksheetItemId];
        const adaptedDetail = adaptWorksheetItem(detailItem);
        const firstAnswer = item.answerUnits[0];
        const selectedChoiceId = detailItem.answerUnits[0]?.saved.selectedChoiceId;
        const choices = adaptedDetail.choices ?? [];

        return {
            ...adaptedDetail,
            result: item.result,
            score: item.score,
            maxScore: item.maxScore,
            input: item.format === 'choice'
                ? choices.find((choice) => choice.id === selectedChoiceId)?.text
                : firstAnswer?.myAnswer,
            answer: firstAnswer?.correctAnswer ?? item.explanation?.answerText,
            choices: choices.map((choice) => choice.text),
            steps: fillResultSteps(detailItem, item),
            explanation: item.explanation ? {
                ...item.explanation,
                steps: item.explanation.steps?.map((step, index) => ({
                    id: `${item.worksheetItemId}-explanation-${index}`,
                    instruction: step.label,
                    formula: step.formula,
                })),
            } : { answerText: firstAnswer?.correctAnswer ?? '' },
            chatContext: item.chatContext ? [{
                subUnitId: item.chatContext.subUnitId,
                conceptLabel: item.chatContext.conceptLabel,
            }] : [],
            rubricResults: item.rubric?.map((rubric) => ({
                label: rubric.description,
                score: rubric.weight,
                satisfied: rubric.satisfied,
            })) ?? [],
        };
    });

    const pendingCount = result.items.filter((item) => item.result === 'pending').length;

    return {
        ...result,
        summary: { ...result.summary, type: result.type, pendingCount },
        questions,
    };
};
