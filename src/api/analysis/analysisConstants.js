/**
 * @typedef {'GENERAL_LEARNING' | 'COMPREHENSIVE_ASSESSMENT'} WorksheetType
 */
export const WorksheetType = Object.freeze({
    GENERAL_LEARNING: 'GENERAL_LEARNING',
    COMPREHENSIVE_ASSESSMENT: 'COMPREHENSIVE_ASSESSMENT',
});

/**
 * @typedef {'INTENSIVE' | 'REVIEW' | 'STABLE' | 'INSUFFICIENT_DATA'} AnalysisStatus
 */
export const AnalysisStatus = Object.freeze({
    INTENSIVE: 'INTENSIVE',
    REVIEW: 'REVIEW',
    STABLE: 'STABLE',
    INSUFFICIENT_DATA: 'INSUFFICIENT_DATA',
});

export const EvaluationArea = Object.freeze({
    UNDERSTANDING: 'UNDERSTANDING',
    CALCULATION: 'CALCULATION',
    REASONING: 'REASONING',
    PROBLEM_SOLVING: 'PROBLEM_SOLVING',
});

export const DifficultyBand = Object.freeze({
    LOW: 'LOW',
    MID: 'MID',
    HIGH: 'HIGH',
});

export const QuestionTypeGroup = Object.freeze({
    MULTIPLE_CHOICE: 'MULTIPLE_CHOICE',
    SHORT_ANSWER: 'SHORT_ANSWER',
    ESSAY: 'ESSAY',
});

export const GradingStatus = Object.freeze({
    NOT_GRADED: 'NOT_GRADED',
    GRADED: 'GRADED',
    FAILED: 'FAILED',
});

export const StudentItemResultType = Object.freeze({
    NOT_GRADED: 'NOT_GRADED',
    CORRECT: 'CORRECT',
    PARTIAL_CORRECT: 'PARTIAL_CORRECT',
    INCORRECT: 'INCORRECT',
});

export const DiagnosticStage = Object.freeze({
    INTERPRET: 'INTERPRET',
    MODEL: 'MODEL',
    EXECUTE: 'EXECUTE',
    ANSWER: 'ANSWER',
});

export const CustomResolutionStatus = Object.freeze({
    IN_PROGRESS: 'IN_PROGRESS',
    RESOLVED: 'RESOLVED',
    UNRESOLVED: 'UNRESOLVED',
});

export const CustomStage = Object.freeze({
    REVIEW: 'REVIEW',
    SIMILAR: 'SIMILAR',
    ADVANCED: 'ADVANCED',
});

export const ReportGenerationStatus = Object.freeze({
    PENDING: 'PENDING',
    GENERATING: 'GENERATING',
    READY: 'READY',
    FAILED: 'FAILED',
});
