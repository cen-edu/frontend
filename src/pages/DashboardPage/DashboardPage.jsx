import { useMemo, useState } from 'react';
import Header from '../../components/Header/Header';
import {
    dashboardFilterOptions,
    getClassTerm,
    getCustomSourceWorksheetId,
    getDashboardSummaries,
    getStudentProgress,
    getWeakConcepts,
    getWorksheetSummary,
} from '../../mocks/teacherDashboard';
import AnalysisFilters from '../../components/common/AnalysisFilters/AnalysisFilters';
import ClassStudentProgress from './components/ClassStudentProgress';
import DashboardSummaryCards from './components/DashboardSummaryCards';
import WeakConceptActions from './components/WeakConceptActions';
import WorksheetProgressList from './components/WorksheetProgressList';
import './DashboardPage.scss';
import './components/DashboardComponents.scss';

function DashboardPage() {
    const [filters, setFilters] = useState({
        year: '2026',
        grade: 'middle-1',
        classId: 'middle-1-1',
        term: 'first',
    });

    const classTerm = useMemo(() => getClassTerm(filters.classId, filters.term), [filters.classId, filters.term]);
    const students = useMemo(() => getStudentProgress(classTerm), [classTerm]);
    const worksheets = useMemo(() => getWorksheetSummary(classTerm), [classTerm]);
    const concepts = useMemo(() => getWeakConcepts(classTerm), [classTerm]);
    const summaries = useMemo(() => getDashboardSummaries(classTerm), [classTerm]);
    const customWorksheetId = getCustomSourceWorksheetId(classTerm);

    const selectedGradeLabel = dashboardFilterOptions.grades.find((option) => option.value === filters.grade)?.label;
    const selectedClassLabel = dashboardFilterOptions.classes.find((option) => option.value === filters.classId)?.label;
    const selectedTermLabel = dashboardFilterOptions.terms.find((option) => option.value === filters.term)?.label;

    const changeFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }));
    const filterControls = [
        { key: 'year', label: '학년도 선택', value: filters.year, options: dashboardFilterOptions.years, onChange: (value) => changeFilter('year', value), width: 132 },
        { key: 'grade', label: '학년 선택', value: filters.grade, options: dashboardFilterOptions.grades, onChange: (value) => changeFilter('grade', value), width: 132 },
        { key: 'classId', label: '반 선택', value: filters.classId, options: dashboardFilterOptions.classes, onChange: (value) => changeFilter('classId', value), width: 104 },
        { key: 'term', label: '학기 선택', value: filters.term, options: dashboardFilterOptions.terms, onChange: (value) => changeFilter('term', value), width: 104 },
    ];

    return (
        <div className="dashboard-page">
            <Header hideOnWheel />

            <main className="dashboard-page__main">
                <div className="dashboard-page__heading">
                    <div>
                        <h1>학급 대시보드</h1>
                        <p className="dashboard-page__context">{filters.year}학년도 · {selectedGradeLabel} {selectedClassLabel} · {selectedTermLabel} 누적</p>
                    </div>
                    <p className="dashboard-page__description">{classTerm.updatedAt}</p>
                </div>

                <AnalysisFilters className="dashboard-page__filters" controls={filterControls} showContext={false} />
                <DashboardSummaryCards summaries={summaries} />

                <ClassStudentProgress students={students} worksheets={worksheets} />

                <div className="dashboard-page__support-grid">
                    <WorksheetProgressList worksheets={worksheets} />
                    <WeakConceptActions concepts={concepts} customWorksheetId={customWorksheetId} />
                </div>
            </main>
        </div>
    );
}

export default DashboardPage;
