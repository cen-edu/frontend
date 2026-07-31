import { useMemo, useState } from 'react';
import Header from '../../components/Header/Header';
import CustomSelect from '../../components/common/CustomSelect/CustomSelect';
import dashboardData, { dashboardClassOptions } from '../../mocks/dashboard';
import DashboardSummaryCards from './components/DashboardSummaryCards';
import QuickActions from './components/QuickActions';
import RecentActivity from './components/RecentActivity';
import StudentStatusTable from './components/StudentStatusTable';
import WeakConceptAnalysis from './components/WeakConceptAnalysis';
import './DashboardPage.scss';

function DashboardPage() {
    const [selectedClass, setSelectedClass] = useState('class-1');
    const currentDashboard = useMemo(() => dashboardData[selectedClass], [selectedClass]);

    return (
        <div className="dashboard-page">
            <Header />

            <main className="dashboard-page__main">
                <section className="dashboard-page__welcome" aria-labelledby="dashboard-title">
                    <div>
                        <p className="dashboard-page__eyebrow">오늘도 학생들의 성장을 함께해요</p>
                        <h1 id="dashboard-title">이하영 선생님, 안녕하세요!</h1>
                    </div>

                    <div className="dashboard-page__class-filter">
                        <span>조회할 반</span>
                        <CustomSelect
                            label="대시보드 조회 반 선택"
                            value={selectedClass}
                            options={dashboardClassOptions}
                            onChange={setSelectedClass}
                            width={148}
                        />
                    </div>
                </section>

                <DashboardSummaryCards summaries={currentDashboard.summaries} />

                <div className="dashboard-page__grid">
                    <WeakConceptAnalysis concepts={currentDashboard.weakConcepts} classId={selectedClass} />
                    <RecentActivity activities={currentDashboard.activities} />
                    <StudentStatusTable students={currentDashboard.students} />
                    <QuickActions />
                </div>
            </main>
        </div>
    );
}

export default DashboardPage;
