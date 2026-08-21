import { normalizeAuthoringPreview } from './problemGenerationAdapter.js';

const targetTypes = {
    problem: 'WHOLE_QUESTION',
    step: 'STEP',
    concept: 'LEARNING_GUIDE',
};

export const buildProblemEditTarget = (target) => {
    const targetType = targetTypes[target?.type];

    if (!targetType) return null;

    return {
        targetType,
        targetKey: target.type === 'step' ? String(target.id) : null,
    };
};

export const normalizeEditedProblem = ({ preview, currentProblem }) => (
    normalizeAuthoringPreview({ preview, existingProblem: currentProblem })
);
