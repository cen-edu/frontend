import { ReportGenerationStatus } from '../../../../api/analysis/analysisConstants.js';
import { MathText } from '../../../../components/common/worksheets';
import './StudentAnalysisReport.scss';

const REPORT_NOT_GRADED = 'ANALYSIS_REPORT_NOT_GRADED';

function ReportState({ icon, title, description, onRetry, retryLabel = '다시 시도' }) {
    return <section className="diagnosis-card student-analysis-report">
        <div className="diagnosis-card__heading"><div><span>AI 응답 분석</span><h2>학생 분석 보고서</h2></div></div>
        <div className="student-analysis-report__state" role="status">
            <i className={`bi ${icon}`} aria-hidden="true" />
            <strong>{title}</strong>
            <p>{description}</p>
            {onRetry && <button type="button" onClick={onRetry}>{retryLabel}</button>}
        </div>
    </section>;
}

function StudentAnalysisReport({ reportState }) {
    const { generationMutation, reportQuery, retry } = reportState;
    const generationError = generationMutation.error;
    const report = reportQuery.data;

    if (generationMutation.isPending) {
        return <ReportState icon="bi-stars" title="분석 보고서를 준비하고 있습니다." description="학생의 채점 결과를 바탕으로 보고서 생성을 요청하고 있습니다." />;
    }

    if (generationError?.code === REPORT_NOT_GRADED) {
        return <ReportState icon="bi-hourglass-split" title="채점 완료 후 보고서를 만들 수 있습니다." description="아직 채점이 완료되지 않아 AI 분석 보고서를 생성하지 않았습니다." onRetry={retry} retryLabel="채점 후 다시 시도" />;
    }

    if (generationError || reportQuery.isError) {
        return <ReportState icon="bi-exclamation-circle" title="분석 보고서를 불러오지 못했습니다." description={generationError?.message || reportQuery.error?.message || '잠시 후 다시 시도해 주세요.'} onRetry={retry} />;
    }

    if (reportQuery.isPending || report?.generationStatus === ReportGenerationStatus.PENDING || report?.generationStatus === ReportGenerationStatus.GENERATING) {
        return <ReportState icon="bi-stars" title="AI가 학생 응답을 분석하고 있습니다." description="분석이 끝나면 보고서가 자동으로 표시됩니다." />;
    }

    if (report?.generationStatus === ReportGenerationStatus.FAILED) {
        return <ReportState icon="bi-exclamation-circle" title="분석 보고서 생성에 실패했습니다." description="기존 문장 데이터는 표시하지 않았습니다. 생성 요청부터 다시 시도해 주세요." onRetry={retry} />;
    }

    if (report?.generationStatus !== ReportGenerationStatus.READY) return null;

    return <section className="diagnosis-card student-analysis-report">
        <div className="diagnosis-card__heading">
            <div><span>AI 응답 분석</span><h2>학생 분석 보고서</h2></div>
            <span className="student-analysis-report__ready"><i className="bi bi-check-circle" aria-hidden="true" /> 분석 완료</span>
        </div>
        <div className="student-analysis-report__messages">
            {report.summaryMessage && <div><strong>핵심 요약</strong><p><MathText>{report.summaryMessage}</MathText></p></div>}
            {report.customLearningMessage && <div><strong>맞춤 학습 관찰</strong><p><MathText>{report.customLearningMessage}</MathText></p></div>}
            {report.overallObservation && <div><strong>종합 관찰</strong><p><MathText>{report.overallObservation}</MathText></p></div>}
            {!report.summaryMessage && !report.customLearningMessage && !report.overallObservation
                && <p className="student-analysis-report__empty">표시할 종합 분석 문장이 없습니다.</p>}
        </div>
        {!!report.itemMessages?.length && <p className="student-analysis-report__item-notice"><i className="bi bi-chat-square-text" aria-hidden="true" /> 문항별 분석은 아래 문항 결과에서 확인할 수 있습니다.</p>}
    </section>;
}

export default StudentAnalysisReport;
