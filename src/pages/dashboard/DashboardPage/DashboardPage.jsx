import Header from '../../../components/Header/Header';
import { AnalysisFilters, useAcademicContextFilters } from '../../../components/common/filters';
import ClassStudentProgress from './components/ClassStudentProgress';
import DashboardSummaryCards from './components/DashboardSummaryCards';
import WorksheetProgressList from './components/WorksheetProgressList';
import {
    adaptAssignments,
    adaptDashboardSummaries,
    adaptStudentProgress,
    formatCalculatedAt,
} from './dashboardAdapters.js';
import {
    useDashboardAssignmentsQuery,
    useDashboardStudentProgressQuery,
    useDashboardSummaryQuery,
} from './dashboardHooks.js';
import './DashboardPage.scss';
import './components/DashboardComponents.scss';

function DashboardPage() {
    const { filters, options, changeFilter, query: academicContextsQuery } = useAcademicContextFilters();
    const selectedClassLabel = options.classes.find((option) => option.value === filters.classId)?.label;
    const queryParams = { classId: filters.classId, semester: filters.semester };
    const summaryQuery = useDashboardSummaryQuery(queryParams);
    const studentProgressQuery = useDashboardStudentProgressQuery(queryParams);
    const assignmentsQuery = useDashboardAssignmentsQuery(queryParams);
    const summaries = adaptDashboardSummaries(summaryQuery.data);
    const { students, worksheets: studentWorksheets } = adaptStudentProgress(studentProgressQuery.data);
    const worksheets = adaptAssignments(assignmentsQuery.data, studentProgressQuery.data);

    const selectedGradeLabel = options.grades.find((option) => option.value === filters.grade)?.label;
    const selectedTermLabel = options.semesters.find((option) => option.value === filters.semester)?.label;
    const hasDashboardSelection = Number(filters.classId) > 0 && ['1', '2'].includes(filters.semester);

    const filtersDisabled = academicContextsQuery.isPending || academicContextsQuery.isError;
    const filterControls = [
        { key: 'academicYear', label: '학년도 선택', value: filters.academicYear, options: options.academicYears, onChange: (value) => changeFilter('academicYear', value), width: 132, disabled: filtersDisabled || !options.academicYears.length },
        { key: 'grade', label: '학년 선택', value: filters.grade, options: options.grades, onChange: (value) => changeFilter('grade', value), width: 132, disabled: filtersDisabled || !options.grades.length },
        { key: 'classId', label: '반 선택', value: filters.classId, options: options.classes, onChange: (value) => changeFilter('classId', value), width: 104, disabled: filtersDisabled || !options.classes.length },
        { key: 'semester', label: '학기 선택', value: filters.semester, options: options.semesters, onChange: (value) => changeFilter('semester', value), width: 104, disabled: filtersDisabled || !options.semesters.length },
    ];

    return (
        <div className="dashboard-page">
            <Header hideOnWheel />

            <main className="dashboard-page__main">
                <div className="dashboard-page__heading">
                    <div>
                        <h1>학급 대시보드</h1>
                        <p className="dashboard-page__context">{filters.academicYear ? `${filters.academicYear}학년도 · ${selectedGradeLabel} ${selectedClassLabel} · ${selectedTermLabel} 누적` : '담당 학급이 없습니다.'}</p>
                    </div>
                    <p className="dashboard-page__description">{formatCalculatedAt(summaryQuery.data?.calculatedAt)}</p>
                </div>

                <AnalysisFilters className="dashboard-page__filters" controls={filterControls} showContext={false} />
                {!hasDashboardSelection
                    ? <div className={`dashboard-page__request-state${academicContextsQuery.isError ? ' dashboard-page__request-state--error' : ''}`} role={academicContextsQuery.isError ? 'alert' : 'status'}>
                        {academicContextsQuery.isPending
                            ? '담당 학급을 불러오는 중입니다.'
                            : academicContextsQuery.isError
                                ? academicContextsQuery.error?.message || '담당 학급을 불러오지 못했습니다.'
                                : '조회할 담당 학급이 없습니다.'}
                    </div>
                    : <>
                {summaryQuery.isPending
                    ? <div className="dashboard-page__request-state" role="status">대시보드 요약을 불러오는 중입니다.</div>
                    : summaryQuery.isError
                        ? <div className="dashboard-page__request-state dashboard-page__request-state--error" role="alert">{summaryQuery.error?.message || '대시보드 요약을 불러오지 못했습니다.'}</div>
                        : <DashboardSummaryCards summaries={summaries} />}

                {studentProgressQuery.isPending
                    ? <div className="dashboard-page__request-state dashboard-page__request-state--section" role="status">학생별 학습 현황을 불러오는 중입니다.</div>
                    : studentProgressQuery.isError
                        ? <div className="dashboard-page__request-state dashboard-page__request-state--section dashboard-page__request-state--error" role="alert">{studentProgressQuery.error?.message || '학생별 학습 현황을 불러오지 못했습니다.'}</div>
                        : <ClassStudentProgress students={students} worksheets={studentWorksheets} />}

                {assignmentsQuery.isPending
                    ? <div className="dashboard-page__request-state dashboard-page__request-state--section" role="status">학습지별 현황을 불러오는 중입니다.</div>
                    : assignmentsQuery.isError
                        ? <div className="dashboard-page__request-state dashboard-page__request-state--section dashboard-page__request-state--error" role="alert">{assignmentsQuery.error?.message || '학습지별 현황을 불러오지 못했습니다.'}</div>
                        : <WorksheetProgressList worksheets={worksheets} />}
                    </>}
            </main>
        </div>
    );
}

export default DashboardPage;
