import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AnalysisFilters from '../../../components/common/AnalysisFilters/AnalysisFilters';
import SearchInput from '../../../components/common/SearchInput/SearchInput';
import { assessmentResultFilterOptions, getAssessmentResults, getWorksheetMetrics, saveAssessmentResults } from '../../../mocks/assessmentResult';
import ResultWorksheetList from './components/ResultWorksheetList';
import ResultSummaryBar from './components/ResultSummaryBar';
import ScoreTable from './components/ScoreTable';
import './AssessmentResultPage.scss';
import './components/AssessmentResultComponents.scss';

const statusTabs = [{ value: 'all', label: '전체' }, { value: 'grading', label: '채점 대기' }, { value: 'confirmed', label: '확정됨' }];

function AssessmentResultPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [results, setResults] = useState(getAssessmentResults);
    const [gradeId, setGradeId] = useState('all');
    const [classId, setClassId] = useState('all');
    const [term, setTerm] = useState('all');
    const [status, setStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedId, setSelectedId] = useState(() => {
        const requestedWorksheetId = searchParams.get('worksheet');
        return results.some((worksheet) => worksheet.id === requestedWorksheetId) ? requestedWorksheetId : results[0]?.id ?? '';
    });

    useEffect(() => {
        const refresh = () => setResults(getAssessmentResults());
        window.addEventListener('focus', refresh);
        return () => window.removeEventListener('focus', refresh);
    }, []);

    const filtered = useMemo(() => results.filter((worksheet) =>
        (gradeId === 'all' || worksheet.gradeId === gradeId)
        && (classId === 'all' || worksheet.classId === classId)
        && (term === 'all' || worksheet.term === term)
        && (status === 'all' || worksheet.status === status)
        && worksheet.title.toLowerCase().includes(searchTerm.trim().toLowerCase())), [classId, gradeId, results, searchTerm, status, term]);
    useEffect(() => { if (!filtered.some((worksheet) => worksheet.id === selectedId)) setSelectedId(filtered[0]?.id ?? ''); }, [filtered, selectedId]);
    const worksheet = filtered.find((item) => item.id === selectedId);

    const openGrading = (studentId) => {
        const params = new URLSearchParams();
        if (studentId) params.set('student', studentId);
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
                    <p>학습별 채점 진행 상태와 학생별 문항 결과를 확인합니다.</p>
                </div>
                <span>검색 결과 <strong>{filtered.length}</strong>건</span>
            </header>
            <div className="assessment-results__toolbar">
                <div className="assessment-results__filters">
                    <AnalysisFilters showContext={false} className="analysis-filters--results" controls={[
                        { key: 'grade', label: '학년 선택', value: gradeId, options: assessmentResultFilterOptions.grades, onChange: (value) => { setGradeId(value); setClassId('all'); }, width: 148 },
                        { key: 'class', label: '반 선택', value: classId, options: assessmentResultFilterOptions.classes, onChange: setClassId, width: 104 },
                        { key: 'term', label: '학기 선택', value: term, options: assessmentResultFilterOptions.terms, onChange: setTerm, width: 112 },
                    ]} />
                    <div className="assessment-results__tabs" role="group" aria-label="채점 상태">{statusTabs.map((tab) => <button key={tab.value} type="button" className={status === tab.value ? 'assessment-results__tab assessment-results__tab--active' : 'assessment-results__tab'} onClick={() => setStatus(tab.value)}>{tab.label}</button>)}</div>
                </div>
                <SearchInput value={searchTerm} placeholder="학습명 검색" onChange={setSearchTerm} />
            </div>
            <div className="assessment-results__content">
                <ResultWorksheetList worksheets={filtered} selectedId={selectedId} onSelect={setSelectedId} />
                <main className="assessment-results__detail">
                    {worksheet ? <><ResultSummaryBar worksheet={worksheet} metrics={getWorksheetMetrics(worksheet)} onGrade={() => openGrading()} onConfirm={confirmResults} /><ScoreTable worksheet={worksheet} onGradeStudent={openGrading} /></> : <div className="assessment-results__empty">표시할 평가 결과가 없습니다.</div>}
                </main>
            </div>
        </section>
    );
}

export default AssessmentResultPage;
