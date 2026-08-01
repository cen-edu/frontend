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
        term: 'first',
        classId: 'class-1',
        worksheet: 'linear-equation',
    });
    const dashboard = useMemo(() => dashboardWorksheets[filters.worksheet], [filters.worksheet]);
    const selectedClassLabel = dashboardFilterOptions.classes.find((option) => option.value === filters.classId)?.label;
    const changeFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }));

    return (
        <div className="dashboard-page">
            <Header />

            <main className="dashboard-page__main">
                <div className="dashboard-page__heading">
                    <div>
                        <h1>학급 대시보드</h1>
                        <p className="dashboard-page__context">{selectedClassLabel} · {dashboard.title}</p>
                    </div>
                    <p className="dashboard-page__description">{dashboard.updatedAt}</p>
                </div>

                <AnalysisFilters className="dashboard-page__filters" filters={filters} options={dashboardFilterOptions} onChange={changeFilter} showContext={false} />
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
