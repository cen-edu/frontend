import { getResultBreakdown } from '../../../../mocks/weaknessAnalysis';
import ConceptMatrix from './ConceptMatrix';
import DetailSidePanel from './DetailSidePanel';
import DiagnosisSummaryCards from './DiagnosisSummaryCards';
import GradingNotice from './GradingNotice';
import PriorityQuestionsTable from './PriorityQuestionsTable';
import QuestionMatrix from './QuestionMatrix';
import ResultBreakdown from './ResultBreakdown';
import StudentTimeScoreScatter from './StudentTimeScoreScatter';

function ClassAnalysisView({ worksheet, displayedWorksheet, metrics, selection, onSelection, matrixView, onMatrixView, sortBy, onSortBy, onSelectStudent }) {
    return <div className="class-analysis-view">
        <GradingNotice count={metrics.pending} excludedCount={metrics.pendingResponses} />
        <DiagnosisSummaryCards worksheet={worksheet} metrics={metrics} />
        <p className="analysis-disclaimer">학급 정답률은 자료 부족 학생과 채점 대기 문항을 제외한 값이며, 등수나 전체 학업 능력을 의미하지 않습니다.</p>
        <div className="class-analysis-view__breakdowns">
            <ResultBreakdown title="영역별 결과" description="사고 유형 기준" items={getResultBreakdown(worksheet, 'area')} />
            <ResultBreakdown title="난이도별 결과" description="문항 난이도 기준" items={getResultBreakdown(worksheet, 'difficulty')} />
        </div>
        {worksheet.type === 'assessment'
            ? <>
                <QuestionMatrix worksheet={displayedWorksheet} view={matrixView} onViewChange={onMatrixView} onSelect={onSelection} selection={selection} />
                <StudentTimeScoreScatter worksheet={worksheet} onSelectStudent={onSelectStudent} />
            </>
            : <div className="weakness-page__analysis-grid">
                <ConceptMatrix worksheet={displayedWorksheet} sortBy={sortBy} onSortChange={onSortBy} onSelect={onSelection} />
                <DetailSidePanel worksheet={worksheet} selection={selection} />
            </div>}
        <PriorityQuestionsTable worksheet={worksheet} onSelect={onSelection} />
    </div>;
}

export default ClassAnalysisView;
