import httpClient from '../httpClient.js';
import ApiError from '../ApiError.js';

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

const getAnalysisPdf = async (path, { signal } = {}) => {
    const response = await httpClient.get(
        `${ANALYSIS_API_BASE_PATH}${path}`,
        {
            signal,
            responseType: 'blob',
            returnRawResponse: true,
            headers: {
                Accept: 'application/pdf',
            },
        },
    );
    const contentType = response.headers?.['content-type'] ?? '';

    if (!contentType.includes('application/pdf')) {
        let errorBody = null;

        try {
            errorBody = JSON.parse(await response.data.text());
        } catch {
            // PDF가 아닌 알 수 없는 응답은 공통 오류 문구로 처리한다.
        }

        throw new ApiError({
            status: response.status,
            code: errorBody?.error?.code ?? null,
            message: errorBody?.error?.message || '보고서 파일을 내려받지 못했습니다.',
        });
    }

    return response.data;
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

export const getStudentReissueProposal = ({ assignmentId, studentId, signal }) => analysisApi.get(
    `/assignments/${Number(assignmentId)}/students/${Number(studentId)}/reissue-proposal`,
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

export const getClassAnalysisReportPdf = ({ assignmentId, signal }) => getAnalysisPdf(
    `/assignments/${Number(assignmentId)}/report.pdf`,
    { signal },
);

export const getStudentAnalysisReportPdf = ({ assignmentId, studentId, signal }) => getAnalysisPdf(
    `/assignments/${Number(assignmentId)}/students/${Number(studentId)}/report.pdf`,
    { signal },
);
