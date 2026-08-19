import { useState } from 'react';
import { adaptComprehensiveAssessmentInsights, adaptLearningAssessmentInsights } from '../analysisAdapters.js';
import DiagnosisSummaryCards from './DiagnosisSummaryCards';
import GradingNotice from './GradingNotice';
import LearningAssessmentAchievement from './LearningAssessmentAchievement.jsx';
import PriorityQuestionsTable from './PriorityQuestionsTable.jsx';
import QuestionMatrix from './QuestionMatrix.jsx';
import ResultBreakdown from './ResultBreakdown.jsx';
import StudentTimeScoreScatter from './StudentTimeScoreScatter.jsx';

function QuerySectionState({ query, pendingMessage, errorMessage, children }) {
    if (query.isPending) return <div className="weakness-page__request-state weakness-page__request-state--section">{pendingMessage}</div>;
    if (query.isError) return <div className="weakness-page__request-state weakness-page__request-state--section" role="alert">{query.error?.message || errorMessage}</div>;
    return children;
}

function ClassAnalysisView({
    worksheet,
    overview,
    insightsQuery,
    achievementQuery,
    comprehensiveInsightsQuery,
    itemAchievementQuery,
    scoreTimeDistributionQuery,
    onSelectStudent,
}) {
    const [matrixView, setMatrixView] = useState('score');
    const { summary } = overview;
    const insights = adaptLearningAssessmentInsights(insightsQuery.data);
    const comprehensiveInsights = adaptComprehensiveAssessmentInsights(comprehensiveInsightsQuery.data);

    return <div className="class-analysis-view">
        <GradingNotice count={summary.gradingPendingStudentCount} excludedCount={summary.gradingPendingAnswerCount} />
        <DiagnosisSummaryCards worksheetType={worksheet.type} summary={summary} />
        <p className="analysis-disclaimer">학급 성취율은 채점된 결과를 기준으로 하며, 자료가 없으면 지표를 표시하지 않습니다.</p>
        {worksheet.type === 'practice' && <>
            <QuerySectionState query={insightsQuery} pendingMessage="학습평가 분석 지표를 불러오는 중입니다." errorMessage="학습평가 분석 지표를 불러오지 못했습니다.">
                <div className="learning-assessment-insights">
                    <div className="class-analysis-view__breakdowns">
                        <ResultBreakdown title="평가 영역별 결과" description="평가 영역 기준" items={insights.evaluationAreas} />
                        <ResultBreakdown title="난이도별 결과" description="문항 난이도 기준" items={insights.difficultyBands} />
                    </div>
                    <PriorityQuestionsTable items={insights.priorityItems} />
                </div>
            </QuerySectionState>
            <QuerySectionState query={achievementQuery} pendingMessage="소분류별 성취를 불러오는 중입니다." errorMessage="소분류별 성취를 불러오지 못했습니다.">
                <LearningAssessmentAchievement achievement={achievementQuery.data} />
            </QuerySectionState>
        </>}
        {worksheet.type === 'assessment' && <>
            <QuerySectionState query={comprehensiveInsightsQuery} pendingMessage="종합평가 분석 지표를 불러오는 중입니다." errorMessage="종합평가 분석 지표를 불러오지 못했습니다.">
                <div className="comprehensive-assessment-insights">
                    <div className="class-analysis-view__breakdowns">
                        <ResultBreakdown title="문항 유형별 결과" description="문항 유형 기준" items={comprehensiveInsights.questionTypeGroups} />
                        <ResultBreakdown title="난이도별 결과" description="문항 난이도 기준" items={comprehensiveInsights.difficultyBands} />
                    </div>
                    <PriorityQuestionsTable items={comprehensiveInsights.priorityItems} showEvaluationArea={false} />
                </div>
            </QuerySectionState>
            <QuerySectionState query={itemAchievementQuery} pendingMessage="학생별 문항 성취를 불러오는 중입니다." errorMessage="학생별 문항 성취를 불러오지 못했습니다.">
                <QuestionMatrix achievement={itemAchievementQuery.data} view={matrixView} onViewChange={setMatrixView} />
            </QuerySectionState>
            <QuerySectionState query={scoreTimeDistributionQuery} pendingMessage="득점률·풀이 시간 분포를 불러오는 중입니다." errorMessage="득점률·풀이 시간 분포를 불러오지 못했습니다.">
                <StudentTimeScoreScatter distribution={scoreTimeDistributionQuery.data} onSelectStudent={onSelectStudent} />
            </QuerySectionState>
        </>}
    </div>;
}

export default ClassAnalysisView;
