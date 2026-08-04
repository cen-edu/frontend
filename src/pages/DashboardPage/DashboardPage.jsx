import { useMemo, useState } from 'react';
import Header from '../../components/Header/Header';
import { dashboardFilterOptions, dashboardWorksheets } from '../../mocks/teacherDashboard';
import AccuracyAnalysis from './components/AccuracyAnalysis';
import AchievementDistribution from './components/AchievementDistribution';
import AnalysisFilters from '../../components/common/AnalysisFilters/AnalysisFilters';
import DashboardSummaryCards from './components/DashboardSummaryCards';
import StudentResultsTable from './components/StudentResultsTable';
import SubmissionStatus from './components/SubmissionStatus';
import WeakConceptActions from './components/WeakConceptActions';
import './DashboardPage.scss';

function DashboardPage() {
    const [filters, setFilters] = useState({
        year: '2026',
        grade: 'middle-1',
        term: 'first',
        classId: 'middle-1-1',
        worksheet: 'linear-equation',
    });
    const dashboard = useMemo(() => dashboardWorksheets[filters.worksheet], [filters.worksheet]);
    const selectedGradeLabel = dashboardFilterOptions.grades.find((option) => option.value === filters.grade)?.label;
    const selectedClassLabel = dashboardFilterOptions.classes.find((option) => option.value === filters.classId)?.label;
    const changeFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }));
    const filterControls = [
        { key: 'year', label: '학년도 선택', value: filters.year, options: dashboardFilterOptions.years, onChange: (value) => changeFilter('year', value), width: 132 },
        { key: 'grade', label: '학년 선택', value: filters.grade, options: dashboardFilterOptions.grades, onChange: (value) => changeFilter('grade', value), width: 132 },
        { key: 'classId', label: '반 선택', value: filters.classId, options: dashboardFilterOptions.classes, onChange: (value) => changeFilter('classId', value), width: 104 },
        { key: 'term', label: '학기 선택', value: filters.term, options: dashboardFilterOptions.terms, onChange: (value) => changeFilter('term', value), width: 104 },
        { key: 'worksheet', label: '학습지 선택', value: filters.worksheet, options: dashboardFilterOptions.worksheets, onChange: (value) => changeFilter('worksheet', value), width: 252 },
    ];

    return (
        <div className="dashboard-page">
            <Header hideOnWheel />

            <main className="dashboard-page__main">
                <div className="dashboard-page__heading">
                    <div>
                        <h1>학급 대시보드</h1>
                        <p className="dashboard-page__context">{selectedGradeLabel} {selectedClassLabel} · {dashboard.title}</p>
                    </div>
                    <p className="dashboard-page__description">{dashboard.updatedAt}</p>
                </div>

                <AnalysisFilters className="dashboard-page__filters" controls={filterControls} showContext={false} />
                <DashboardSummaryCards summaries={dashboard.summaries} />

                <div className="dashboard-page__analysis-grid">
                    <AccuracyAnalysis concepts={dashboard.concepts} questions={dashboard.questions} worksheetId={filters.worksheet} />
                    <SubmissionStatus submission={dashboard.submission} />
                </div>

                <div className="dashboard-page__support-grid">
                    <AchievementDistribution students={dashboard.students} />
                    <WeakConceptActions concepts={dashboard.concepts} worksheetId={filters.worksheet} />
                </div>

                <StudentResultsTable students={dashboard.students} />
            </main>
        </div>
    );
}

export default DashboardPage;
