import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnalysisFilters from '../../components/common/AnalysisFilters/AnalysisFilters';
import AssignmentPeriodFilter from '../../components/common/AssignmentPeriodFilter/AssignmentPeriodFilter';
import SearchInput from '../../components/common/SearchInput/SearchInput';
import { assessmentResultFilterOptions, getAssessmentResults, getWorksheetMetrics, saveAssessmentResults } from '../../mocks/assessmentResult';
import { getDefaultAssignmentDateRange, isAssignedWithinPeriod } from '../../utils/assignmentPeriod';
import ResultWorksheetList from './components/ResultWorksheetList';
import ResultSummaryBar from './components/ResultSummaryBar';
import ScoreTable from './components/ScoreTable';
import './AssessmentResultPage.scss';
import './components/AssessmentResultComponents.scss';

const statusTabs = [{ value: 'all', label: '전체' }, { value: 'grading', label: '채점 대기' }, { value: 'confirmed', label: '확정됨' }];

function AssessmentResultPage() {
    const navigate = useNavigate();
    const [results, setResults] = useState(getAssessmentResults);
    const initialDateRange = useMemo(getDefaultAssignmentDateRange, []);
    const [classId, setClassId] = useState('all');
    const [period, setPeriod] = useState('all');
    const [customStartDate, setCustomStartDate] = useState(initialDateRange.startDate);
    const [customEndDate, setCustomEndDate] = useState(initialDateRange.endDate);
    const [status, setStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedId, setSelectedId] = useState(results[0]?.id ?? '');
    const [view, setView] = useState('student');

    useEffect(() => {
        const refresh = () => setResults(getAssessmentResults());
        window.addEventListener('focus', refresh);
        return () => window.removeEventListener('focus', refresh);
    }, []);

    const filtered = useMemo(() => results.filter((worksheet) =>
        (classId === 'all' || worksheet.classId === classId)
        && isAssignedWithinPeriod(worksheet.assignedAt, period, customStartDate, customEndDate)
        && (status === 'all' || worksheet.status === status)
        && worksheet.title.toLowerCase().includes(searchTerm.trim().toLowerCase())), [classId, customEndDate, customStartDate, period, results, searchTerm, status]);
    useEffect(() => { if (!filtered.some((worksheet) => worksheet.id === selectedId)) setSelectedId(filtered[0]?.id ?? ''); }, [filtered, selectedId]);
    const worksheet = filtered.find((item) => item.id === selectedId);

    const openGrading = (studentId, questionNo) => {
        const params = new URLSearchParams();
        if (studentId) params.set('student', studentId);
        if (questionNo) params.set('question', questionNo);
        navigate(`/learning/results/${worksheet.id}/grading?${params}`);
    };
    const confirmResults = () => {
        const next = results.map((item) => item.id === worksheet.id ? { ...item, status: 'confirmed' } : item);
        setResults(next); saveAssessmentResults(next);
    };

    return (
        <section className="assessment-results" aria-labelledby="assessment-results-title">
            <header className="assessment-results__page-header">
                <div>
                    <h1 id="assessment-results-title">평가 결과</h1>
                    <p>학습별 채점 진행 상태와 학생·문항별 점수를 확인합니다.</p>
                </div>
                <span>검색 결과 <strong>{filtered.length}</strong>건</span>
            </header>
            <div className="assessment-results__toolbar">
                <div className="assessment-results__filters">
                    <AnalysisFilters showContext={false} className="analysis-filters--results" controls={[
                        { key: 'class', label: '반 선택', value: classId, options: assessmentResultFilterOptions.classes, onChange: setClassId, width: 150 },
                        { key: 'period', render: <AssignmentPeriodFilter period={period} startDate={customStartDate} endDate={customEndDate} onPeriodChange={setPeriod} onStartDateChange={setCustomStartDate} onEndDateChange={setCustomEndDate} selectWidth={116} /> },
                    ]} />
                    <div className="assessment-results__tabs" role="group" aria-label="채점 상태">{statusTabs.map((tab) => <button key={tab.value} type="button" className={status === tab.value ? 'assessment-results__tab assessment-results__tab--active' : 'assessment-results__tab'} onClick={() => setStatus(tab.value)}>{tab.label}</button>)}</div>
                </div>
                <SearchInput value={searchTerm} placeholder="학습명 검색" onChange={setSearchTerm} />
            </div>
            <div className="assessment-results__content">
                <ResultWorksheetList worksheets={filtered} selectedId={selectedId} onSelect={setSelectedId} />
                <main className="assessment-results__detail">
                    {worksheet ? <><ResultSummaryBar worksheet={worksheet} metrics={getWorksheetMetrics(worksheet)} onGrade={() => openGrading()} onConfirm={confirmResults} /><ScoreTable worksheet={worksheet} view={view} onViewChange={setView} onCellClick={openGrading} /></> : <div className="assessment-results__empty">표시할 평가 결과가 없습니다.</div>}
                </main>
            </div>
        </section>
    );
}

export default AssessmentResultPage;
