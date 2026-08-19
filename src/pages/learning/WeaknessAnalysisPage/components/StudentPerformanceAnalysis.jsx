import { useMemo } from 'react';
import { WorksheetType } from '../../../../api/analysis/analysisConstants.js';
import {
    adaptStudentComprehensiveAssessmentPerformance,
    adaptStudentLearningAssessmentPerformance,
} from '../analysisAdapters.js';
import DifficultyRadar from './DifficultyRadar.jsx';
import ResultBreakdown from './ResultBreakdown.jsx';

const formatRate = (value) => value == null ? '-' : `${Math.round(value * 10) / 10}%`;

function StudentPerformanceAnalysis({ worksheetType, query }) {
    const isAssessment = worksheetType === WorksheetType.COMPREHENSIVE_ASSESSMENT;
    const performance = useMemo(() => (
        isAssessment
            ? adaptStudentComprehensiveAssessmentPerformance(query.data)
            : adaptStudentLearningAssessmentPerformance(query.data)
    ), [isAssessment, query.data]);

    if (query.isPending) return <div className="student-analysis-view__section-state">유형별 성취 결과를 불러오는 중입니다.</div>;
    if (query.isError) return <div className="student-analysis-view__section-state" role="alert">{query.error?.message || '유형별 성취 결과를 불러오지 못했습니다.'}</div>;

    const primary = isAssessment ? performance.questionTypeGroups : performance.evaluationAreas;
    const primaryTitle = isAssessment ? '문항 유형별 학생 vs 학급' : '영역별 학생 vs 학급';
    const primaryDescription = isAssessment ? '문항 유형 기준' : '평가 영역 기준';
    const hasPerformance = primary.studentItems.length || performance.difficultyBands.studentItems.length;

    return <>
        {hasPerformance
            ? <div className="student-analysis-view__breakdowns">
                <ResultBreakdown
                    title={primaryTitle}
                    description={primaryDescription}
                    items={primary.studentItems}
                    comparisonItems={primary.classItems}
                />
                <DifficultyRadar
                    items={performance.difficultyBands.studentItems}
                    comparisonItems={performance.difficultyBands.classItems}
                />
            </div>
            : <section className="diagnosis-card"><div className="diagnosis-card__heading"><div><span>학생 성취</span><h2>유형별 성취 결과</h2></div></div><p className="student-analysis-view__empty">표시할 성취 데이터가 없습니다.</p></section>}

        {!isAssessment && <section className="diagnosis-card student-subcategories">
            <div className="diagnosis-card__heading"><div><span>채점 완료 응답 기준</span><h2>소분류별 성취</h2></div></div>
            {performance.subcategoryResults.length
                ? <ul>{performance.subcategoryResults.map((item) => <li key={item.subcategoryId}>
                    <strong>{item.subcategoryName}</strong>
                    <span>{item.gradedCount > 0 ? `${item.correctCount}/${item.gradedCount} 정답` : '미채점'}</span>
                    <b>{formatRate(item.accuracyRate)}</b>
                </li>)}</ul>
                : <p className="student-analysis-view__empty">소분류별 성취 데이터가 없습니다.</p>}
        </section>}
    </>;
}

export default StudentPerformanceAnalysis;
