import { customStageLabels } from '../../../mocks/labels.js';
import { normalizeAuthoringPreview } from '../problemGenerationAdapter.js';

const requestStageFields = {
    retrace: 'reviewCount',
    basic: 'similarCount',
    independent: 'advancedCount',
};

const responseStageKeys = {
    review: 'retrace',
    similar: 'basic',
    advanced: 'independent',
};

export const CUSTOM_PROBLEM_MAX_COUNT = 20;

export const getCustomProblemTotalCount = (configs = []) => configs.reduce(
    (total, config) => total + Object.keys(requestStageFields).reduce(
        (stageTotal, stage) => stageTotal + Number(config.counts?.[stage] ?? 0),
        0,
    ),
    0,
);

export const buildCustomProblemGenerationItems = (configs = []) => configs.flatMap((config) => {
    const counts = Object.fromEntries(Object.entries(requestStageFields).map(([stage, field]) => [
        field,
        Number(config.counts?.[stage] ?? 0),
    ]));
    const selectedCount = Object.values(counts).reduce((sum, count) => sum + count, 0);

    if (selectedCount === 0) return [];

    return [{
        subUnitId: Number(config.unitId),
        ...counts,
    }];
});

export const normalizeCustomGenerationSlots = (slots = [], configs = []) => {
    const configsBySubUnitId = new Map(configs.map((config) => [
        Number(config.unitId),
        config,
    ]));

    return [...slots]
        .filter((slot) => slot.status === 'READY' && slot.preview)
        .sort((left, right) => left.slotIndex - right.slotIndex)
        .map((slot) => {
            const subUnitId = Number(slot.preview.snapshot?.metadata?.subUnitId);
            const config = configsBySubUnitId.get(subUnitId);
            const stage = responseStageKeys[slot.customStage] ?? slot.customStage;
            const conceptLabel = config?.conceptLabel ?? '맞춤 문제';
            const existingProblem = {
                id: `session-${slot.sessionId}`,
                sessionId: slot.sessionId,
                no: slot.slotIndex,
                unitId: subUnitId,
                unitName: conceptLabel,
                unitPath: conceptLabel,
            };

            return {
                ...normalizeAuthoringPreview({
                    preview: slot.preview,
                    existingProblem,
                    slotIndex: slot.slotIndex,
                }),
                stage,
                customStage: slot.customStage,
                sourceQuestionId: slot.sourceQuestionId,
                originQuestionId: slot.originQuestionId,
                title: `${customStageLabels[stage] ?? '맞춤'} 문제 · ${conceptLabel}`,
            };
        });
};

export const getCustomGenerationErrorMessage = (error) => {
    const messages = {
        CUSTOM_PROBLEM_EMPTY_SELECTION: '한 문항 이상 선택해 주세요.',
        CUSTOM_PROBLEM_TOTAL_LIMIT_EXCEEDED: '맞춤 문제는 한 번에 최대 20문항까지 생성할 수 있습니다.',
        CUSTOM_PROBLEM_SUB_UNIT_DUPLICATED: '같은 소분류를 중복해서 요청할 수 없습니다.',
        CUSTOM_PROBLEM_SUB_UNIT_NOT_PROPOSED: '최신 재출제 제안에 없는 소분류가 포함되어 있습니다.',
        CUSTOM_PROBLEM_COUNT_EXCEEDS_PROPOSAL: '재출제 제안의 최대 문항 수를 초과했습니다.',
        CUSTOM_PROBLEM_SIMILAR_REFERENCE_MISSING: '유사 문제를 만들 기준 오답 문항이 없습니다.',
        CUSTOM_PROBLEM_ADVANCED_NOT_ALLOWED: '응용 문제를 생성할 수 없는 소분류입니다.',
        ANALYSIS_REISSUE_NOT_GRADED: '채점이 완료된 뒤 맞춤 문제를 생성할 수 있습니다.',
        ANALYSIS_STUDENT_NOT_ASSIGNED: '선택한 학생은 이 학습지의 배정 대상이 아닙니다.',
        ANALYSIS_ASSIGNMENT_ACCESS_DENIED: '이 학습지의 맞춤 문제를 생성할 권한이 없습니다.',
        ANALYSIS_ASSIGNMENT_NOT_FOUND: '선택한 학습지를 찾을 수 없습니다.',
        PROBLEM_GENERATION_JOB_NOT_FOUND: '생성 작업을 찾을 수 없습니다. 문항 구성을 다시 확인해 주세요.',
    };

    return messages[error?.code] ?? error?.message ?? '맞춤 문제를 생성하지 못했습니다.';
};
