import { useMemo } from 'react';
import Header from '../../../components/Header/Header';
import {
    getClassTerm,
    getDashboardSummaries,
    getStudentProgress,
    getWorksheetSummary,
} from '../../../mocks/teacherDashboard';
import classes from '../../../mocks/classes';
import { AnalysisFilters, useAcademicContextFilters } from '../../../components/common/filters';
import ClassStudentProgress from './components/ClassStudentProgress';
import DashboardSummaryCards from './components/DashboardSummaryCards';
import WorksheetProgressList from './components/WorksheetProgressList';
import './DashboardPage.scss';
import './components/DashboardComponents.scss';

function DashboardPage() {
    const { filters, options, changeFilter, query: academicContextsQuery } = useAcademicContextFilters();
    const selectedClassLabel = options.classes.find((option) => option.value === filters.classId)?.label;
    const mockClassId = classes.find((classItem) => (
        classItem.year === filters.academicYear
        && classItem.grade === filters.grade
        && classItem.name === selectedClassLabel
    ))?.classId;
    const mockTerm = filters.semester === '1' ? 'first' : filters.semester === '2' ? 'second' : '';

    const classTerm = useMemo(() => getClassTerm(mockClassId, mockTerm), [mockClassId, mockTerm]);
    const students = useMemo(() => getStudentProgress(classTerm), [classTerm]);
    const worksheets = useMemo(() => getWorksheetSummary(classTerm), [classTerm]);
    const summaries = useMemo(() => getDashboardSummaries(classTerm), [classTerm]);

    const selectedGradeLabel = options.grades.find((option) => option.value === filters.grade)?.label;
    const selectedTermLabel = options.semesters.find((option) => option.value === filters.semester)?.label;

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
                    <p className="dashboard-page__description">{classTerm.updatedAt}</p>
                </div>

                <AnalysisFilters className="dashboard-page__filters" controls={filterControls} showContext={false} />
                <DashboardSummaryCards summaries={summaries} />

                <ClassStudentProgress students={students} worksheets={worksheets} />
                <WorksheetProgressList worksheets={worksheets} />
            </main>
        </div>
    );
}

export default DashboardPage;
