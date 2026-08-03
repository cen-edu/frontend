import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AnalysisFilters from '../../components/common/AnalysisFilters/AnalysisFilters';
import { getStudentMetrics, getWorksheetMetrics, weaknessFilterOptions, weaknessWorksheets } from '../../mocks/weaknessAnalysis';
import ConceptMatrix from './components/ConceptMatrix';
import DetailSidePanel from './components/DetailSidePanel';
import DiagnosisSelectionBar from './components/DiagnosisSelectionBar';
import DiagnosisSummaryCards from './components/DiagnosisSummaryCards';
import GradingNotice from './components/GradingNotice';
import PrescriptionTable from './components/PrescriptionTable';
import QuestionMatrix from './components/QuestionMatrix';
import StudentDiagnosisTable from './components/StudentDiagnosisTable';
import './WeaknessAnalysisPage.scss';
import './components/WeaknessComponents.scss';

function WeaknessAnalysisPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialWorksheet = weaknessWorksheets[searchParams.get('worksheet')] ? searchParams.get('worksheet') : 'factor-practice';
    const [filters, setFilters] = useState({ year: '2026', grade: 'middle-1', classId: 'middle-1-1', term: 'first', worksheet: initialWorksheet });
    const [selection, setSelection] = useState(null); const [selectedStudents, setSelectedStudents] = useState([]); const [statusFilter, setStatusFilter] = useState('all'); const [matrixView, setMatrixView] = useState('score'); const [sortBy, setSortBy] = useState('score-asc');
    const worksheet = weaknessWorksheets[filters.worksheet]; const metrics = useMemo(() => getWorksheetMetrics(worksheet), [worksheet]);
    const displayedWorksheet = useMemo(() => ({ ...worksheet, students: [...worksheet.students].sort((a, b) => { if (sortBy === 'name') return a.name.localeCompare(b.name, 'ko'); const difference = getStudentMetrics(a).scoreRate - getStudentMetrics(b).scoreRate; return sortBy === 'score-desc' ? -difference : difference; }) }), [worksheet, sortBy]);
    const changeFilter = (key, value) => { setFilters((current) => ({ ...current, [key]: value })); if (key === 'worksheet') { setSearchParams({ worksheet: value }); setSelection(null); setSelectedStudents([]); setStatusFilter('all'); setMatrixView('score'); } };
    const filterControls = [
        { key: 'year', label: '학년도 선택', value: filters.year, options: weaknessFilterOptions.years, onChange: (value) => changeFilter('year', value), width: 132 },
        { key: 'grade', label: '학년 선택', value: filters.grade, options: weaknessFilterOptions.grades, onChange: (value) => changeFilter('grade', value), width: 132 },
        { key: 'classId', label: '반 선택', value: filters.classId, options: weaknessFilterOptions.classes, onChange: (value) => changeFilter('classId', value), width: 104 },
        { key: 'term', label: '학기 선택', value: filters.term, options: weaknessFilterOptions.terms, onChange: (value) => changeFilter('term', value), width: 104 },
        { key: 'worksheet', label: '학습지 선택', value: filters.worksheet, options: weaknessFilterOptions.worksheets, onChange: (value) => changeFilter('worksheet', value), width: 252 },
    ];
    const toggleStudent = (studentId) => setSelectedStudents((current) => current.includes(studentId) ? current.filter((id) => id !== studentId) : [...current, studentId]);
    const typeLabel = worksheet.origin === 'custom' ? '맞춤 문제 · 챗봇 연계' : worksheet.type === 'assessment' ? '종합 평가' : '일반 학습';

    return <section className="weakness-page" aria-labelledby="weakness-page-title">
        <header className="weakness-page__page-header"><div><h1 id="weakness-page-title">취약점 분석</h1><p>개념·문항별 결과를 비교하고 우선 지도할 학생을 확인합니다.</p></div><span>{worksheet.className} · {typeLabel}</span></header>
        <AnalysisFilters className="weakness-page__filters" controls={filterControls} showContext={false} />
        <GradingNotice count={metrics.pending} /><DiagnosisSummaryCards worksheet={worksheet} metrics={metrics} />
        {worksheet.origin === 'custom' && <PrescriptionTable worksheet={displayedWorksheet} />}
        <div className="weakness-page__analysis-grid">{worksheet.type === 'assessment' ? <QuestionMatrix worksheet={displayedWorksheet} view={matrixView} onViewChange={setMatrixView} onSelect={setSelection} selection={selection} /> : <ConceptMatrix worksheet={displayedWorksheet} sortBy={sortBy} onSortChange={setSortBy} onSelect={setSelection} selection={selection} />}<DetailSidePanel worksheet={worksheet} selection={selection} onQuadrantSelect={() => setStatusFilter('priority')} /></div>
        <StudentDiagnosisTable worksheet={displayedWorksheet} selected={selectedStudents} onToggle={toggleStudent} statusFilter={statusFilter} onStatusFilter={setStatusFilter} />
        <DiagnosisSelectionBar selectedStudents={worksheet.students.filter((student) => selectedStudents.includes(student.id))} worksheetId={worksheet.id} conceptId={selection?.conceptId} />
    </section>;
}
export default WeaknessAnalysisPage;
