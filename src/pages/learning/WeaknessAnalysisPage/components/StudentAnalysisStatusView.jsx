import { useMemo, useState } from 'react';
import { GradingStatus, ReportGenerationStatus, StudentItemResultType, WorksheetType } from '../../../../api/analysis/analysisConstants.js';
import { formatAnalysisDuration, getAnalysisStatusView } from '../analysisAdapters.js';
import QuestionResultCard from './QuestionResultCard.jsx';
import StudentAnalysisReport from './StudentAnalysisReport.jsx';
import StudentCustomLearningSessions from './StudentCustomLearningSessions.jsx';
import StudentPerformanceAnalysis from './StudentPerformanceAnalysis.jsx';
import './StudentAnalysisStatusView.scss';

const formatRate = (value) => value === null || value === undefined ? '-' : `${value}%`;

function QueryState({ query, pendingMessage, errorMessage, children }) {
    if (query.isPending) return <div className="student-analysis-view__section-state">{pendingMessage}</div>;
    if (query.isError) return <div className="student-analysis-view__section-state" role="alert">{query.error?.message || errorMessage}</div>;
    return children;
}

function StudentAnalysisStatusView({
    worksheet,
    student,
    index,
    onMove,
    summaryQuery,
    itemsQuery,
    performanceQuery,
    customLearningQuery,
    reportState,
}) {
    const [resultFilter, setResultFilter] = useState('all');
    const summary = summaryQuery.data;
    const status = getAnalysisStatusView(summary?.analysisStatus ?? student?.analysisStatus);
    const isAssessment = summary?.worksheetType === WorksheetType.COMPREHENSIVE_ASSESSMENT;
    const items = [...(itemsQuery.data?.items ?? [])].sort((a, b) => a.itemNumber - b.itemNumber);
    const filteredItems = items.filter((item) => {
        if (resultFilter === 'wrong') return item.resultType === StudentItemResultType.INCORRECT || item.resultType === StudentItemResultType.PARTIAL_CORRECT;
        if (resultFilter === 'pending') return item.gradingStatus === GradingStatus.NOT_GRADED;
        if (resultFilter === 'failed') return item.gradingStatus === GradingStatus.FAILED;
        return true;
    });
    const studentRate = summary?.performanceRate ?? null;
    const classRate = summary?.classPerformanceRate ?? null;
    const classGap = studentRate !== null && classRate !== null ? studentRate - classRate : null;
    const classGapTone = classGap === null || classGap === 0 ? 'even' : classGap > 0 ? 'above' : 'below';
    const canMove = index >= 0;
    const reportMessagesByItemId = useMemo(() => {
        const report = reportState.reportQuery.data;
        if (report?.generationStatus !== ReportGenerationStatus.READY) return new Map();
        return new Map((report.itemMessages ?? []).map((message) => [
            String(message.worksheetItemId),
            message,
        ]));
    }, [reportState.reportQuery.data]);

    return <div className="student-analysis-view">
        <header className="student-analysis-view__header">
            <div>
                <div className="student-analysis-view__identity"><h2>{summary?.studentName ?? student?.name ?? '학생'}</h2><span className={`status-badge status-badge--${status.status}`}>{status.label}</span></div>
                <p>{summary?.worksheetTitle ?? worksheet.title} 개인 분석</p>
            </div>
            <div className="student-analysis-view__navigation">
                <button type="button" disabled={!canMove || index === 0} onClick={() => onMove(-1)}><i className="bi bi-chevron-left" aria-hidden="true" /> 이전</button>
                <button type="button" disabled={!canMove || index === worksheet.students.length - 1} onClick={() => onMove(1)}>다음 <i className="bi bi-chevron-right" aria-hidden="true" /></button>
            </div>
        </header>

        <QueryState query={summaryQuery} pendingMessage="학생 수행 요약을 불러오는 중입니다." errorMessage="학생 수행 요약을 불러오지 못했습니다.">
            <>
                <div className="student-analysis-view__metrics">
                    <div><span>채점 문항</span><strong>{summary?.gradedItemCount ?? 0}<small>/{summary?.totalItemCount ?? 0}문항</small></strong></div>
                    <div><span>정답 문항</span><strong>{summary?.correctItemCount ?? 0}<small>문항</small></strong></div>
                    <div><span>{isAssessment ? '득점률' : '정답률'}</span><strong>{formatRate(summary?.performanceRate)}</strong></div>
                    <div><span>{isAssessment ? '총 풀이 시간' : '취약 소분류'}</span><strong>{isAssessment ? formatAnalysisDuration(summary?.totalSolvingDurationMs) : `${summary?.weaknessSubcategories?.length ?? 0}개`}</strong></div>
                </div>
                {(summary?.gradedItemCount ?? 0) === 0 && <p className="student-analysis-view__pending"><i className="bi bi-exclamation-circle" aria-hidden="true" /> 채점 완료 결과가 없어 자료가 부족합니다.</p>}
                <section className="student-comparison diagnosis-card">
                    <div className="diagnosis-card__heading"><div><span>같은 학습지 기준</span><h2>학급 비교</h2></div></div>
                    <div className="student-comparison__values">
                        <div><span>학생 {isAssessment ? '득점률' : '정답률'}</span><strong className={`student-comparison__value student-comparison__value--${classGapTone}`}>{formatRate(studentRate)}</strong></div>
                        <div><span>학급 {isAssessment ? '득점률' : '정답률'}</span><strong>{formatRate(classRate)}</strong></div>
                        <div><span>학급과 차이</span><strong className={`student-comparison__value student-comparison__value--${classGapTone}`}>{classGap === null ? '-' : `${classGap > 0 ? '+' : ''}${Math.round(classGap * 10) / 10}%p`}</strong></div>
                    </div>
                    {isAssessment && <p>학생 총 풀이 시간 {formatAnalysisDuration(summary?.totalSolvingDurationMs)} · 학급 평균 {formatAnalysisDuration(summary?.classAverageSolvingDurationMs)}</p>}
                </section>
                <section className="diagnosis-card student-weaknesses">
                    <div className="diagnosis-card__heading"><div><span>취약 영역</span><h2>취약 소분류</h2></div></div>
                    {summary?.weaknessSubcategories?.length
                        ? <ul>{summary.weaknessSubcategories.map((subcategory) => <li key={subcategory.subcategoryId}><strong>{subcategory.subcategoryName}</strong><span>오답 {subcategory.incorrectCount}/{subcategory.gradedCount}</span><b>{formatRate(subcategory.accuracyRate)}</b></li>)}</ul>
                        : <p className="student-analysis-view__empty">취약 소분류가 없습니다.</p>}
                </section>
            </>
        </QueryState>

        <StudentAnalysisReport reportState={reportState} />

        <StudentCustomLearningSessions query={customLearningQuery} />

        <StudentPerformanceAnalysis
            worksheetType={summary?.worksheetType ?? (worksheet.type === 'assessment'
                ? WorksheetType.COMPREHENSIVE_ASSESSMENT
                : WorksheetType.GENERAL_LEARNING)}
            query={performanceQuery}
        />

        <QueryState query={itemsQuery} pendingMessage="문항별 결과를 불러오는 중입니다." errorMessage="문항별 결과를 불러오지 못했습니다.">
            <section className="student-analysis-view__results diagnosis-card">
                <div className="student-analysis-view__results-heading">
                    <div><span>지도 근거 확인</span><h2>문항별 결과</h2></div>
                    <div className="diagnosis-tabs" role="group" aria-label="문항 결과 필터">{[['all', '전체'], ['wrong', '오답·부분 정답'], ['pending', '채점 대기'], ['failed', '채점 실패']].map(([value, label]) => <button type="button" key={value} className={resultFilter === value ? 'diagnosis-tabs__button diagnosis-tabs__button--active' : 'diagnosis-tabs__button'} aria-pressed={resultFilter === value} onClick={() => setResultFilter(value)}>{label}</button>)}</div>
                </div>
                <div className="student-analysis-view__cards">{filteredItems.map((item) => <QuestionResultCard key={item.worksheetItemId} item={item} reportMessage={reportMessagesByItemId.get(String(item.worksheetItemId))} />)}{!filteredItems.length && <p className="student-analysis-view__empty">해당하는 문항 결과가 없습니다.</p>}</div>
            </section>
        </QueryState>
    </div>;
}

export default StudentAnalysisStatusView;
