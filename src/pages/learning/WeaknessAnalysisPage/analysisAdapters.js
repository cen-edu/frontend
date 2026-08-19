import {
    AnalysisStatus,
    DifficultyBand,
    EvaluationArea,
    QuestionTypeGroup,
    WorksheetType,
} from '../../../api/analysis/analysisConstants.js';

const statusMap = {
    [AnalysisStatus.INTENSIVE]: 'priority',
    [AnalysisStatus.REVIEW]: 'review',
    [AnalysisStatus.STABLE]: 'stable',
    [AnalysisStatus.INSUFFICIENT_DATA]: 'insufficient',
};

export const normalizeAnalysisWorksheetType = (worksheetType) => (
    worksheetType === WorksheetType.COMPREHENSIVE_ASSESSMENT
        ? 'assessment'
        : 'practice'
);

export const getAnalysisStatusView = (analysisStatus) => ({
    status: statusMap[analysisStatus] ?? 'insufficient',
    label: {
        priority: '집중 지도',
        review: '다시 확인',
        stable: '안정',
        insufficient: '자료 부족',
    }[statusMap[analysisStatus] ?? 'insufficient'],
});

export const adaptAnalysisStudents = (data) => (data?.students ?? []).map((student) => ({
    id: String(student.studentId),
    name: student.studentName,
    analysisStatus: student.analysisStatus,
    status: statusMap[student.analysisStatus] ?? 'insufficient',
    performanceRate: student.performanceRate ?? null,
}));

export const formatAnalysisCalculatedAt = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';

    return `${new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).format(date)} 기준`;
};

export const formatAnalysisDuration = (durationMs) => {
    if (durationMs === null || durationMs === undefined) return '-';
    const totalSeconds = Math.max(0, Math.round(Number(durationMs) / 1000));
    if (!Number.isFinite(totalSeconds)) return '-';
    if (totalSeconds < 60) return `${totalSeconds}초`;

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return seconds ? `${minutes}분 ${seconds}초` : `${minutes}분`;
};

export const evaluationAreaLabels = Object.freeze({
    [EvaluationArea.UNDERSTANDING]: '개념',
    [EvaluationArea.CALCULATION]: '계산',
    [EvaluationArea.REASONING]: '추론',
    [EvaluationArea.PROBLEM_SOLVING]: '문제해결',
});

export const difficultyBandLabels = Object.freeze({
    [DifficultyBand.LOW]: '하',
    [DifficultyBand.MID]: '중',
    [DifficultyBand.HIGH]: '상',
});

export const questionTypeGroupLabels = Object.freeze({
    [QuestionTypeGroup.MULTIPLE_CHOICE]: '객관식',
    [QuestionTypeGroup.SHORT_ANSWER]: '주관식',
    [QuestionTypeGroup.ESSAY]: '서술형',
});

export const adaptLearningAssessmentInsights = (data) => ({
    evaluationAreas: (data?.evaluationAreas ?? []).map((item) => ({
        key: item.evaluationArea,
        label: evaluationAreaLabels[item.evaluationArea] ?? item.evaluationArea,
        questionCount: item.itemCount,
        rate: item.accuracyRate,
        referenceOnly: item.referenceOnly,
    })),
    difficultyBands: (data?.difficultyBands ?? []).map((item) => ({
        key: item.difficultyBand,
        label: difficultyBandLabels[item.difficultyBand] ?? item.difficultyBand,
        questionCount: item.itemCount,
        rate: item.accuracyRate,
        referenceOnly: item.referenceOnly,
    })),
    priorityItems: (data?.priorityItems ?? []).map((item) => ({
        ...item,
        accuracyRate: item.gradedStudentCount > 0
            ? (item.correctStudentCount / item.gradedStudentCount) * 100
            : null,
    })),
});

export const getSubcategoryResult = (student, subcategoryId) => (
    student.results.find((result) => result.subcategoryId === subcategoryId) ?? null
);

export const getAchievementRate = (result) => (
    result?.gradedCount > 0
        ? (result.correctCount / result.gradedCount) * 100
        : null
);

const adaptPriorityItems = (items) => (items ?? []).map((item) => ({
    ...item,
    accuracyRate: item.gradedStudentCount > 0
        ? (item.correctStudentCount / item.gradedStudentCount) * 100
        : null,
}));

export const adaptComprehensiveAssessmentInsights = (data) => ({
    questionTypeGroups: (data?.questionTypeGroups ?? []).map((item) => ({
        key: item.questionTypeGroup,
        label: questionTypeGroupLabels[item.questionTypeGroup] ?? item.questionTypeGroup,
        questionCount: item.itemCount,
        rate: item.accuracyRate,
        referenceOnly: item.referenceOnly,
    })),
    difficultyBands: (data?.difficultyBands ?? []).map((item) => ({
        key: item.difficultyBand,
        label: difficultyBandLabels[item.difficultyBand] ?? item.difficultyBand,
        questionCount: item.itemCount,
        rate: item.accuracyRate,
        referenceOnly: item.referenceOnly,
    })),
    priorityItems: adaptPriorityItems(data?.priorityItems),
});

export const getItemAchievementResult = (student, worksheetItemId) => (
    student.results.find((result) => result.worksheetItemId === worksheetItemId) ?? null
);

export const adaptScoreTimeDistribution = (data) => {
    const students = (data?.studentDistribution ?? []).map((student) => ({
        id: String(student.studentId),
        name: student.studentName,
        analysisStatus: student.analysisStatus,
        status: statusMap[student.analysisStatus] ?? 'insufficient',
        scoreRate: student.scoreRate,
        totalSolvingDurationMs: student.totalSolvingDurationMs,
    }));

    return {
        points: students.filter((student) => (
            student.scoreRate != null && student.totalSolvingDurationMs != null
        )),
        insufficientStudents: students.filter((student) => (
            student.scoreRate == null || student.totalSolvingDurationMs == null
        )),
        medianScoreRate: data?.medianScoreRate ?? null,
        medianSolvingDurationMs: data?.medianSolvingDurationMs ?? null,
    };
};

const adaptStudentComparisonItems = (items, keyField, labels) => ({
    studentItems: (items ?? []).map((item) => ({
        key: item[keyField],
        label: labels[item[keyField]] ?? item[keyField],
        questionCount: item.itemCount,
        rate: item.studentAccuracyRate ?? null,
        referenceOnly: item.referenceOnly,
    })),
    classItems: (items ?? []).map((item) => ({
        key: item[keyField],
        label: labels[item[keyField]] ?? item[keyField],
        questionCount: item.itemCount,
        rate: item.classAccuracyRate ?? null,
        referenceOnly: item.referenceOnly,
    })),
});

export const adaptStudentLearningAssessmentPerformance = (data) => ({
    evaluationAreas: adaptStudentComparisonItems(
        data?.evaluationAreas,
        'evaluationArea',
        evaluationAreaLabels,
    ),
    difficultyBands: adaptStudentComparisonItems(
        data?.difficultyBands,
        'difficultyBand',
        difficultyBandLabels,
    ),
    subcategoryResults: (data?.subcategoryResults ?? []).map((item) => ({
        ...item,
        accuracyRate: item.gradedCount > 0
            ? (item.correctCount / item.gradedCount) * 100
            : null,
    })),
});

export const adaptStudentComprehensiveAssessmentPerformance = (data) => ({
    questionTypeGroups: adaptStudentComparisonItems(
        data?.questionTypeGroups,
        'questionTypeGroup',
        questionTypeGroupLabels,
    ),
    difficultyBands: adaptStudentComparisonItems(
        data?.difficultyBands,
        'difficultyBand',
        difficultyBandLabels,
    ),
});
