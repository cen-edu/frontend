import { normalizeAuthoringPreview } from './problemGenerationAdapter.js';
import { normalizeEditedAssessmentProblem } from './assessmentGenerationAdapter.js';

const targetTypes = {
    problem: 'WHOLE_QUESTION',
    'question-body': 'QUESTION_BODY',
    step: 'STEP',
    concept: 'LEARNING_GUIDE',
    explanation: 'EXPLANATION',
    choice: 'CHOICE',
    'answer-unit': 'ANSWER_UNIT',
    'rubric-item': 'RUBRIC_ITEM',
};

const keyedTargetTypes = new Set(['step', 'choice', 'answer-unit', 'rubric-item']);

export const buildProblemEditTarget = (target) => {
    const targetType = targetTypes[target?.type];

    if (!targetType) return null;
    if (keyedTargetTypes.has(target.type) && target.targetKey == null) return null;

    return {
        targetType,
        targetKey: keyedTargetTypes.has(target.type) ? String(target.targetKey) : null,
    };
};

export const normalizeEditedProblem = ({ preview, currentProblem }) => {
    if (currentProblem.format) {
        return normalizeEditedAssessmentProblem({ preview, currentProblem });
    }

    return normalizeAuthoringPreview({ preview, existingProblem: currentProblem });
};
