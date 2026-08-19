import httpClient from '../httpClient.js';

export const ANALYSIS_API_BASE_PATH = '/teacher/analysis';

/**
 * @typedef {object} AnalysisAssignment
 * @property {number} assignmentId
 * @property {string} worksheetTitle
 * @property {'GENERAL_LEARNING' | 'COMPREHENSIVE_ASSESSMENT'} worksheetType
 * @property {boolean} analysisAvailable
 */

export const analysisApi = {
    get: (path, { params, signal } = {}) => httpClient.get(
        `${ANALYSIS_API_BASE_PATH}${path}`,
        { params, signal },
    ),
    post: (path, { data, signal } = {}) => httpClient.post(
        `${ANALYSIS_API_BASE_PATH}${path}`,
        data,
        { signal },
    ),
};

/**
 * @param {object} params
 * @param {number|string} params.classId
 * @param {1|2|'1'|'2'} params.semester
 * @param {'GENERAL_LEARNING'|'COMPREHENSIVE_ASSESSMENT'} [params.worksheetType]
 * @param {AbortSignal} [params.signal]
 * @returns {Promise<{ assignments: AnalysisAssignment[] }>}
 */
export const getAnalysisAssignments = ({
    classId,
    semester,
    worksheetType,
    signal,
}) => analysisApi.get('/assignments', {
    params: {
        classId: Number(classId),
        semester: Number(semester),
        worksheetType: worksheetType || undefined,
    },
    signal,
});

export const getAnalysisOverview = ({ assignmentId, signal }) => analysisApi.get(
    `/assignments/${Number(assignmentId)}/overview`,
    { signal },
);

export const getAnalysisStudents = ({ assignmentId, signal }) => analysisApi.get(
    `/assignments/${Number(assignmentId)}/students`,
    { signal },
);

export const getLearningAssessmentInsights = ({ assignmentId, signal }) => analysisApi.get(
    `/assignments/${Number(assignmentId)}/learning-assessment-insights`,
    { signal },
);

export const getLearningAssessmentAchievement = ({ assignmentId, signal }) => analysisApi.get(
    `/assignments/${Number(assignmentId)}/learning-assessment-achievement`,
    { signal },
);

export const getComprehensiveAssessmentInsights = ({ assignmentId, signal }) => analysisApi.get(
    `/assignments/${Number(assignmentId)}/comprehensive-assessment-insights`,
    { signal },
);

export const getItemAchievement = ({ assignmentId, signal }) => analysisApi.get(
    `/assignments/${Number(assignmentId)}/item-achievement`,
    { signal },
);

export const getScoreTimeDistribution = ({ assignmentId, signal }) => analysisApi.get(
    `/assignments/${Number(assignmentId)}/score-time-distribution`,
    { signal },
);

export const getStudentAnalysisSummary = ({ assignmentId, studentId, signal }) => analysisApi.get(
    `/assignments/${Number(assignmentId)}/students/${Number(studentId)}/summary`,
    { signal },
);

export const getStudentItemResults = ({ assignmentId, studentId, signal }) => analysisApi.get(
    `/assignments/${Number(assignmentId)}/students/${Number(studentId)}/items`,
    { signal },
);

export const getStudentLearningAssessmentPerformance = ({ assignmentId, studentId, signal }) => analysisApi.get(
    `/assignments/${Number(assignmentId)}/students/${Number(studentId)}/learning-assessment-performance`,
    { signal },
);

export const getStudentComprehensiveAssessmentPerformance = ({ assignmentId, studentId, signal }) => analysisApi.get(
    `/assignments/${Number(assignmentId)}/students/${Number(studentId)}/comprehensive-assessment-performance`,
    { signal },
);

export const getStudentCustomLearningSessions = ({ assignmentId, studentId, signal }) => analysisApi.get(
    `/assignments/${Number(assignmentId)}/students/${Number(studentId)}/custom-learning-sessions`,
    { signal },
);

export const requestStudentAnalysisReport = ({ assignmentId, studentId, signal }) => analysisApi.post(
    `/assignments/${Number(assignmentId)}/students/${Number(studentId)}/report`,
    { signal },
);

export const getStudentAnalysisReport = ({ assignmentId, studentId, signal }) => analysisApi.get(
    `/assignments/${Number(assignmentId)}/students/${Number(studentId)}/report`,
    { signal },
);
