import { DiagnosticStage, EvaluationArea } from '../../../api/analysis/analysisConstants.js';

export const evaluationAreaLabels = Object.freeze({
    [EvaluationArea.UNDERSTANDING]: '개념',
    [EvaluationArea.CALCULATION]: '계산',
    [EvaluationArea.REASONING]: '추론',
    [EvaluationArea.PROBLEM_SOLVING]: '문제해결',
});

export const diagnosticStageLabels = Object.freeze({
    [DiagnosticStage.INTERPRET]: '문제 해석',
    [DiagnosticStage.MODEL]: '식 세우기',
    [DiagnosticStage.EXECUTE]: '계산 실행',
    [DiagnosticStage.ANSWER]: '답 작성',
});

const difficultyLabels = {
    low: '하',
    mid: '중',
    high: '상',
};

const hasProposedQuestions = (subcategory) => [
    subcategory.review,
    subcategory.similar,
    subcategory.advanced,
].some((stage) => (stage?.proposedCount ?? 0) > 0);

export const adaptReissueProposal = (data) => {
    const proposedSubcategories = (data?.subcategories ?? []).filter(hasProposedQuestions);

    return {
        configs: proposedSubcategories.map((subcategory) => ({
        conceptId: String(subcategory.subUnitId),
        unitId: String(subcategory.subUnitId),
        conceptLabel: subcategory.subUnitName,
        guidance: subcategory.guidance ?? {},
        adaptive: {
            ...subcategory.adaptive,
            difficultyLabel: difficultyLabels[subcategory.adaptive?.currentDifficulty]
                ?? subcategory.adaptive?.currentDifficulty
                ?? '-',
        },
        review: subcategory.review ?? {},
        similar: subcategory.similar ?? {},
        advanced: subcategory.advanced ?? {},
        counts: {
            retrace: subcategory.review?.proposedCount ?? 0,
            basic: subcategory.similar?.proposedCount ?? 0,
            independent: subcategory.advanced?.proposedCount ?? 0,
        },
        maxCounts: {
            retrace: subcategory.review?.maxCount ?? 0,
            basic: subcategory.similar?.maxCount ?? 0,
            independent: subcategory.advanced?.maxCount ?? 0,
        },
        })),
        reason: proposedSubcategories.length ? '' : '제안할 취약 소분류가 없습니다.',
    };
};

export const getProposalErrorMessage = (error) => {
    const messages = {
        ANALYSIS_REISSUE_NOT_GRADED: '채점이 완료된 뒤 맞춤 문제 제안을 확인할 수 있습니다.',
        ANALYSIS_STUDENT_NOT_ASSIGNED: '선택한 학생은 이 학습지의 배정 대상이 아닙니다.',
        ANALYSIS_ASSIGNMENT_ACCESS_DENIED: '이 학습지의 맞춤 문제 제안에 접근할 수 없습니다.',
        ANALYSIS_ASSIGNMENT_NOT_FOUND: '선택한 학습지를 찾을 수 없습니다.',
    };

    return messages[error?.code] ?? error?.message ?? '맞춤 문제 제안을 불러오지 못했습니다.';
};
