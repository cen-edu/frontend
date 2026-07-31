import { useMemo, useState } from 'react';
import Header from '../../components/Header/Header';
import { dashboardFilterOptions, dashboardWorksheets } from '../../mocks/teacherDashboard';
import AccuracyAnalysis from './components/AccuracyAnalysis';
import AchievementDistribution from './components/AchievementDistribution';
import DashboardFilters from './components/DashboardFilters';
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
    const changeFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }));

    return (
        <div className="dashboard-page">
            <Header />

            <main className="dashboard-page__main">
                <div className="dashboard-page__heading">
                    <div>
                        <p className="dashboard-page__eyebrow">TODAY</p>
                        <h1>이하영 선생님, 우리 반 학습 현황이에요.</h1>
                    </div>
                    <p className="dashboard-page__description">{dashboard.updatedAt}</p>
                </div>

                <DashboardFilters filters={filters} options={dashboardFilterOptions} onChange={changeFilter} />
                <DashboardSummaryCards summaries={dashboard.summaries} />

                <div className="dashboard-page__content-grid">
                    <AccuracyAnalysis concepts={dashboard.concepts} questions={dashboard.questions} worksheetId={filters.worksheet} />
                    <AchievementDistribution students={dashboard.students} />
                    <WeakConceptActions concepts={dashboard.concepts} worksheetId={filters.worksheet} />
                    <SubmissionStatus submission={dashboard.submission} />
                </div>

                <StudentResultsTable students={dashboard.students} />
            </main>
        </div>
    );
}

export default DashboardPage;
