import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import AnalysisFilters from '../../components/common/AnalysisFilters/AnalysisFilters';
import { getWorksheetTypeLabel } from '../../mocks/labels';
import { getStudentMetrics, getWorksheetMetrics, weaknessFilterOptions, weaknessWorksheets } from '../../mocks/weaknessAnalysis';
import AnalysisTargetList from './components/AnalysisTargetList';
import ClassAnalysisView from './components/ClassAnalysisView';
import StudentAnalysisView from './components/StudentAnalysisView';
import './WeaknessAnalysisPage.scss';
import './StudentDiagnosisPage.scss';
import './components/WeaknessComponents.scss';

function WeaknessAnalysisPage() {
    const { id: studentId } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const initialWorksheet = weaknessWorksheets[searchParams.get('worksheet')] ? searchParams.get('worksheet') : 'factor-practice';
    const [filters, setFilters] = useState({ year: '2026', grade: 'middle-1', classId: 'middle-1-1', term: 'second', worksheet: initialWorksheet });
    const [selection, setSelection] = useState(null);
    const [matrixView, setMatrixView] = useState('score');
    const [matrixSort, setMatrixSort] = useState('score-asc');
    const [targetSort, setTargetSort] = useState('status');
    const [studentSearch, setStudentSearch] = useState('');
    const worksheet = weaknessWorksheets[filters.worksheet];
    const metrics = useMemo(() => getWorksheetMetrics(worksheet), [worksheet]);
    const displayedWorksheet = useMemo(() => ({ ...worksheet, students: [...worksheet.students].sort((a, b) => {
        if (matrixSort === 'name') return a.name.localeCompare(b.name, 'ko');
        const difference = getStudentMetrics(a).scoreRate - getStudentMetrics(b).scoreRate;
        return matrixSort === 'score-desc' ? -difference : difference;
    }) }), [worksheet, matrixSort]);
    const selectedIndex = worksheet.students.findIndex((student) => student.id === studentId);
    const selectedStudent = selectedIndex >= 0 ? worksheet.students[selectedIndex] : null;

    useEffect(() => { window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); }, [studentId]);

    const changeFilter = (key, value) => {
        setFilters((current) => ({ ...current, [key]: value }));
        if (key === 'worksheet') {
            setSelection(null);
            setMatrixView('score');
            navigate(`/learning/weaknesses${selectedStudent ? `/students/${selectedStudent.id}` : ''}?worksheet=${value}`);
        }
    };
    const selectStudent = (id) => navigate(`/learning/weaknesses/students/${id}?worksheet=${worksheet.id}`);
    const selectAll = () => navigate(`/learning/weaknesses?worksheet=${worksheet.id}`);
    const moveStudent = (delta) => {
        const nextStudent = worksheet.students[selectedIndex + delta];
        if (nextStudent) selectStudent(nextStudent.id);
    };
    const filterControls = [
        { key: 'year', label: '학년도 선택', value: filters.year, options: weaknessFilterOptions.years, onChange: (value) => changeFilter('year', value), width: 132 },
        { key: 'grade', label: '학년 선택', value: filters.grade, options: weaknessFilterOptions.grades, onChange: (value) => changeFilter('grade', value), width: 132 },
        { key: 'classId', label: '반 선택', value: filters.classId, options: weaknessFilterOptions.classes, onChange: (value) => changeFilter('classId', value), width: 104 },
        { key: 'term', label: '학기 선택', value: filters.term, options: weaknessFilterOptions.terms, onChange: (value) => changeFilter('term', value), width: 104 },
        { key: 'worksheet', label: '학습지 선택', value: filters.worksheet, options: weaknessFilterOptions.worksheets, onChange: (value) => changeFilter('worksheet', value), width: 252 },
    ];
    const typeLabel = getWorksheetTypeLabel(worksheet);

    return <section className="weakness-page" aria-labelledby="weakness-page-title">
        <header className="weakness-page__page-header"><div><h1 id="weakness-page-title">취약점 분석</h1><p>학급과 학생의 응답을 분석하고 보고서에 담길 내용을 확인합니다.</p></div><span>{worksheet.className} · {typeLabel}</span></header>
        <AnalysisFilters className="weakness-page__filters" controls={filterControls} showContext={false} />
        <div className="weakness-page__workspace">
            <AnalysisTargetList worksheet={worksheet} selectedStudentId={selectedStudent?.id} search={studentSearch} onSearch={setStudentSearch} sortBy={targetSort} onSortChange={setTargetSort} onSelectAll={selectAll} onSelectStudent={selectStudent} />
            <main className="weakness-page__main">
                <div className="weakness-page__content-header"><div><span>{selectedStudent ? '개인 분석' : '학급 분석'}</span><h2>{selectedStudent ? `${selectedStudent.name} 분석 결과` : `${worksheet.className} 분석 결과`}</h2><p>{worksheet.title} · {worksheet.date} 기준</p></div><button type="button" disabled title="보고서 다운로드는 다음 단계에서 제공됩니다."><i className="bi bi-download" /> {selectedStudent ? '개인 보고서' : '학급 보고서'} 다운로드</button></div>
                {selectedStudent
                    ? <StudentAnalysisView worksheet={worksheet} student={selectedStudent} index={selectedIndex} onMove={moveStudent} />
                    : <ClassAnalysisView worksheet={worksheet} displayedWorksheet={displayedWorksheet} metrics={metrics} selection={selection} onSelection={setSelection} matrixView={matrixView} onMatrixView={setMatrixView} sortBy={matrixSort} onSortBy={setMatrixSort} onSelectStudent={selectStudent} />}
            </main>
        </div>
    </section>;
}

export default WeaknessAnalysisPage;
