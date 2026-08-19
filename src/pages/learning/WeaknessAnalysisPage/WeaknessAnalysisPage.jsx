import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { AnalysisFilters, useAcademicContextFilters } from '../../../components/common/filters';
import { getWorksheetTypeLabel } from '../../../mocks/labels';
import { WorksheetType } from '../../../api/analysis/analysisConstants.js';
import {
    adaptAnalysisStudents,
    formatAnalysisCalculatedAt,
    normalizeAnalysisWorksheetType,
} from './analysisAdapters.js';
import {
    useAnalysisAssignmentsQuery,
    useAnalysisOverviewQuery,
    useAnalysisStudentsQuery,
    useComprehensiveAssessmentInsightsQuery,
    useItemAchievementQuery,
    useLearningAssessmentAchievementQuery,
    useLearningAssessmentInsightsQuery,
    useScoreTimeDistributionQuery,
    useStudentAnalysisSummaryQuery,
    useStudentAnalysisReport,
    useStudentComprehensiveAssessmentPerformanceQuery,
    useStudentCustomLearningSessionsQuery,
    useStudentItemResultsQuery,
    useStudentLearningAssessmentPerformanceQuery,
} from './analysisAssignmentHooks';
import AnalysisTargetList from './components/AnalysisTargetList';
import ClassAnalysisView from './components/ClassAnalysisView';
import StudentAnalysisStatusView from './components/StudentAnalysisStatusView.jsx';
import './WeaknessAnalysisPage.scss';
import './StudentDiagnosisPage.scss';
import './components/WeaknessComponents.scss';

const ASSIGNMENT_ACCESS_DENIED = 'ANALYSIS_ASSIGNMENT_ACCESS_DENIED';
const ASSIGNMENT_NOT_FOUND = 'ANALYSIS_ASSIGNMENT_NOT_FOUND';
const ASSIGNMENT_TYPE_MISMATCH = 'ANALYSIS_ASSIGNMENT_TYPE_MISMATCH';
const LEARNING_ASSESSMENT_TYPE_MISMATCH = 'ANALYSIS_LEARNING_ASSESSMENT_TYPE_MISMATCH';
const FORBIDDEN = 'FORBIDDEN';
const STUDENT_NOT_ASSIGNED = 'ANALYSIS_STUDENT_NOT_ASSIGNED';
const worksheetTypeOptions = [
    { value: '', label: '전체' },
    { value: WorksheetType.COMPREHENSIVE_ASSESSMENT, label: '종합 평가' },
    { value: WorksheetType.GENERAL_LEARNING, label: '일반 학습' },
];

function WeaknessAnalysisPage() {
    const { id: studentId } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const initialWorksheet = searchParams.get('worksheet') ?? '';
    const {
        filters: academicFilters,
        options: academicOptions,
        changeFilter: changeAcademicFilter,
        query: academicContextsQuery,
    } = useAcademicContextFilters();
    const [worksheetId, setWorksheetId] = useState(initialWorksheet);
    const [worksheetTypeFilter, setWorksheetTypeFilter] = useState('');
    const [requiresWorksheetReselection, setRequiresWorksheetReselection] = useState(false);
    const [assignmentNotice, setAssignmentNotice] = useState('');
    const [targetSort, setTargetSort] = useState('status');
    const [studentSearch, setStudentSearch] = useState('');
    const refreshedMissingClassErrorAt = useRef(0);
    const handledAssignmentErrorAt = useRef(0);

    const assignmentQuery = useAnalysisAssignmentsQuery({
        classId: academicFilters.classId,
        semester: academicFilters.semester,
        worksheetType: worksheetTypeFilter,
    });
    const overviewQuery = useAnalysisOverviewQuery(worksheetId);
    const studentsQuery = useAnalysisStudentsQuery(worksheetId);
    const assignments = assignmentQuery.data?.assignments ?? [];
    const hasAcademicClass = Boolean(academicFilters.classId && academicFilters.semester);
    const isAssignmentPending = hasAcademicClass && assignmentQuery.isPending;
    const selectedAssignment = assignments.find((assignment) => (
        String(assignment.assignmentId) === worksheetId && assignment.analysisAvailable
    ));
    const shouldLoadLearningAssessment = !studentId
        && selectedAssignment?.worksheetType === 'GENERAL_LEARNING';
    const shouldLoadComprehensiveAssessment = !studentId
        && selectedAssignment?.worksheetType === 'COMPREHENSIVE_ASSESSMENT';
    const insightsQuery = useLearningAssessmentInsightsQuery(worksheetId, shouldLoadLearningAssessment);
    const achievementQuery = useLearningAssessmentAchievementQuery(worksheetId, shouldLoadLearningAssessment);
    const comprehensiveInsightsQuery = useComprehensiveAssessmentInsightsQuery(worksheetId, shouldLoadComprehensiveAssessment);
    const itemAchievementQuery = useItemAchievementQuery(worksheetId, shouldLoadComprehensiveAssessment);
    const scoreTimeDistributionQuery = useScoreTimeDistributionQuery(worksheetId, shouldLoadComprehensiveAssessment);
    const studentSummaryQuery = useStudentAnalysisSummaryQuery(worksheetId, studentId);
    const studentItemsQuery = useStudentItemResultsQuery(worksheetId, studentId);
    const studentLearningPerformanceQuery = useStudentLearningAssessmentPerformanceQuery(
        worksheetId,
        studentId,
        selectedAssignment?.worksheetType === 'GENERAL_LEARNING',
    );
    const studentComprehensivePerformanceQuery = useStudentComprehensiveAssessmentPerformanceQuery(
        worksheetId,
        studentId,
        selectedAssignment?.worksheetType === 'COMPREHENSIVE_ASSESSMENT',
    );
    const studentCustomLearningQuery = useStudentCustomLearningSessionsQuery(worksheetId, studentId);
    const studentReportState = useStudentAnalysisReport(worksheetId, studentId);
    const students = useMemo(() => adaptAnalysisStudents(studentsQuery.data), [studentsQuery.data]);
    const worksheet = useMemo(() => {
        if (!selectedAssignment) return null;

        const context = overviewQuery.data?.context;
        const gradeLabel = academicOptions.grades.find(({ value }) => value === academicFilters.grade)?.label;
        const classLabel = academicOptions.classes.find(({ value }) => value === academicFilters.classId)?.label;
        const worksheetType = context?.worksheetType ?? selectedAssignment.worksheetType;

        return {
            id: String(selectedAssignment.assignmentId),
            title: context?.worksheetTitle ?? selectedAssignment.worksheetTitle,
            type: normalizeAnalysisWorksheetType(worksheetType),
            worksheetType,
            className: context?.className ?? [gradeLabel, classLabel].filter(Boolean).join(' '),
            date: formatAnalysisCalculatedAt(context?.calculatedAt),
            students,
        };
    }, [academicFilters.classId, academicFilters.grade, academicOptions.classes, academicOptions.grades, overviewQuery.data, selectedAssignment, students]);
    const selectedIndex = worksheet?.students.findIndex((student) => student.id === studentId) ?? -1;
    const selectedStudent = selectedIndex >= 0 ? worksheet.students[selectedIndex] : null;

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        });
    }, [studentId]);

    useEffect(() => {
        if (
            assignmentQuery.error?.status !== 404
            || !assignmentQuery.errorUpdatedAt
            || refreshedMissingClassErrorAt.current === assignmentQuery.errorUpdatedAt
        ) return;

        refreshedMissingClassErrorAt.current = assignmentQuery.errorUpdatedAt;
        academicContextsQuery.refetch();
    }, [academicContextsQuery.refetch, assignmentQuery.error, assignmentQuery.errorUpdatedAt]);

    useEffect(() => {
        const studentError = [
            studentSummaryQuery,
            studentItemsQuery,
            studentLearningPerformanceQuery,
            studentComprehensivePerformanceQuery,
            studentCustomLearningQuery,
            studentReportState,
        ].find(({ error }) => error?.code === STUDENT_NOT_ASSIGNED);
        if (!studentError || handledAssignmentErrorAt.current === studentError.errorUpdatedAt) return;

        handledAssignmentErrorAt.current = studentError.errorUpdatedAt;
        setAssignmentNotice('선택한 학생은 이 학습지의 배정 대상이 아닙니다. 갱신된 학생 목록을 확인해 주세요.');
        studentsQuery.refetch();
        navigate(`/learning/weaknesses?worksheet=${worksheetId}`, { replace: true });
    }, [navigate, studentComprehensivePerformanceQuery.error, studentComprehensivePerformanceQuery.errorUpdatedAt, studentCustomLearningQuery.error, studentCustomLearningQuery.errorUpdatedAt, studentItemsQuery.error, studentItemsQuery.errorUpdatedAt, studentLearningPerformanceQuery.error, studentLearningPerformanceQuery.errorUpdatedAt, studentReportState.error, studentReportState.errorUpdatedAt, studentSummaryQuery.error, studentSummaryQuery.errorUpdatedAt, studentsQuery.refetch, worksheetId]);

    useEffect(() => {
        const assignmentError = [
            overviewQuery,
            studentsQuery,
            insightsQuery,
            achievementQuery,
            comprehensiveInsightsQuery,
            itemAchievementQuery,
            scoreTimeDistributionQuery,
            studentSummaryQuery,
            studentItemsQuery,
            studentLearningPerformanceQuery,
            studentComprehensivePerformanceQuery,
            studentCustomLearningQuery,
            studentReportState,
        ].find(({ error }) => (
            error?.code === ASSIGNMENT_ACCESS_DENIED
            || error?.code === ASSIGNMENT_NOT_FOUND
            || error?.code === ASSIGNMENT_TYPE_MISMATCH
            || error?.code === LEARNING_ASSESSMENT_TYPE_MISMATCH
            || error?.code === FORBIDDEN
        ));
        if (!assignmentError || handledAssignmentErrorAt.current === assignmentError.errorUpdatedAt) return;

        handledAssignmentErrorAt.current = assignmentError.errorUpdatedAt;
        setRequiresWorksheetReselection(true);
        setAssignmentNotice(
            assignmentError.error.code === ASSIGNMENT_TYPE_MISMATCH
            || assignmentError.error.code === LEARNING_ASSESSMENT_TYPE_MISMATCH
                ? '선택한 학습지 유형과 분석 화면이 맞지 않습니다. 학습지를 다시 선택해 주세요.'
                : assignmentError.error.code === ASSIGNMENT_ACCESS_DENIED || assignmentError.error.code === FORBIDDEN
                ? '이 학습지에 접근할 수 없습니다. 학습지 목록에서 다시 선택해 주세요.'
                : '선택한 학습지가 없어졌습니다. 갱신된 목록에서 다시 선택해 주세요.',
        );
        setWorksheetId('');
        setStudentSearch('');
        assignmentQuery.refetch();
        navigate('/learning/weaknesses', { replace: true });
    }, [achievementQuery.error, achievementQuery.errorUpdatedAt, assignmentQuery.refetch, comprehensiveInsightsQuery.error, comprehensiveInsightsQuery.errorUpdatedAt, insightsQuery.error, insightsQuery.errorUpdatedAt, itemAchievementQuery.error, itemAchievementQuery.errorUpdatedAt, navigate, overviewQuery.error, overviewQuery.errorUpdatedAt, scoreTimeDistributionQuery.error, scoreTimeDistributionQuery.errorUpdatedAt, studentComprehensivePerformanceQuery.error, studentComprehensivePerformanceQuery.errorUpdatedAt, studentCustomLearningQuery.error, studentCustomLearningQuery.errorUpdatedAt, studentItemsQuery.error, studentItemsQuery.errorUpdatedAt, studentLearningPerformanceQuery.error, studentLearningPerformanceQuery.errorUpdatedAt, studentReportState.error, studentReportState.errorUpdatedAt, studentSummaryQuery.error, studentSummaryQuery.errorUpdatedAt, studentsQuery.error, studentsQuery.errorUpdatedAt]);

    useEffect(() => {
        if (!hasAcademicClass || assignmentQuery.isPending || assignmentQuery.isError || requiresWorksheetReselection) return;

        const currentAssignment = assignments.find((assignment) => (
            String(assignment.assignmentId) === worksheetId && assignment.analysisAvailable
        ));
        const nextAssignment = currentAssignment ?? assignments.find((assignment) => assignment.analysisAvailable);
        const nextWorksheetId = nextAssignment ? String(nextAssignment.assignmentId) : '';

        if (nextWorksheetId === worksheetId) return;

        setWorksheetId(nextWorksheetId);
        setStudentSearch('');
        navigate(`/learning/weaknesses${nextWorksheetId ? `?worksheet=${nextWorksheetId}` : ''}`, { replace: true });
    }, [assignmentQuery.isError, assignmentQuery.isPending, assignments, hasAcademicClass, navigate, requiresWorksheetReselection, worksheetId]);

    const changeFilter = (key, value) => {
        setAssignmentNotice('');
        setRequiresWorksheetReselection(false);
        setStudentSearch('');

        if (key === 'worksheet') {
            setWorksheetId(value);
            navigate(`/learning/weaknesses?worksheet=${value}`);
            return;
        }

        if (key === 'worksheetType') {
            setWorksheetTypeFilter(value);
            setWorksheetId('');
            navigate('/learning/weaknesses', { replace: true });
            return;
        }

        changeAcademicFilter(key, value);
        setWorksheetId('');
        navigate('/learning/weaknesses', { replace: true });
    };
    const selectStudent = (id) => navigate(`/learning/weaknesses/students/${id}?worksheet=${worksheet.id}`);
    const selectAll = () => navigate(`/learning/weaknesses?worksheet=${worksheet.id}`);
    const moveStudent = (delta) => {
        const nextStudent = worksheet.students[selectedIndex + delta];
        if (nextStudent) selectStudent(nextStudent.id);
    };

    const worksheetOptions = academicContextsQuery.isPending
        ? [{ value: '', label: '담당 학급을 불러오는 중입니다.' }]
        : academicContextsQuery.isError
            ? [{ value: '', label: '담당 학급을 불러오지 못했습니다.' }]
            : !hasAcademicClass
                ? [{ value: '', label: '등록된 담당 학급이 없습니다.' }]
                : assignmentQuery.isPending
        ? [{ value: '', label: '학습지를 불러오는 중입니다.' }]
        : assignmentQuery.isError
            ? [{ value: '', label: '학습지를 불러오지 못했습니다.' }]
            : assignments.length
                ? [
                    ...(requiresWorksheetReselection
                        ? [{ value: '', label: '학습지를 다시 선택해 주세요.', disabled: true }]
                        : []),
                    ...assignments.map((assignment) => ({
                        value: String(assignment.assignmentId),
                        label: assignment.worksheetTitle,
                        disabled: !assignment.analysisAvailable,
                    })),
                ]
                : [{ value: '', label: '분석 가능한 학습지가 없습니다.' }];
    const filterControls = [
        { key: 'academicYear', label: '학년도 선택', value: academicFilters.academicYear, options: academicOptions.academicYears, onChange: (value) => changeFilter('academicYear', value), width: 132, disabled: academicContextsQuery.isPending || academicContextsQuery.isError || !academicOptions.academicYears.length },
        { key: 'grade', label: '학년 선택', value: academicFilters.grade, options: academicOptions.grades, onChange: (value) => changeFilter('grade', value), width: 132, disabled: academicContextsQuery.isPending || academicContextsQuery.isError || !academicOptions.grades.length },
        { key: 'classId', label: '반 선택', value: academicFilters.classId, options: academicOptions.classes, onChange: (value) => changeFilter('classId', value), width: 104, disabled: academicContextsQuery.isPending || academicContextsQuery.isError || !academicOptions.classes.length },
        { key: 'semester', label: '학기 선택', value: academicFilters.semester, options: academicOptions.semesters, onChange: (value) => changeFilter('semester', value), width: 104, disabled: academicContextsQuery.isPending || academicContextsQuery.isError || !academicOptions.semesters.length },
        { key: 'worksheetType', label: '학습 유형 선택', value: worksheetTypeFilter, options: worksheetTypeOptions, onChange: (value) => changeFilter('worksheetType', value), width: 132, disabled: !hasAcademicClass || academicContextsQuery.isPending || academicContextsQuery.isError },
        { key: 'worksheet', label: '학습지 선택', value: worksheetId, options: worksheetOptions, onChange: (value) => changeFilter('worksheet', value), width: 252, disabled: !hasAcademicClass || isAssignmentPending || assignmentQuery.isError || !assignments.some((assignment) => assignment.analysisAvailable) },
    ];
    const typeLabel = worksheet ? getWorksheetTypeLabel(worksheet) : '';
    const requestStateMessage = assignmentNotice || (academicContextsQuery.isPending
        ? '담당 학급을 불러오는 중입니다.'
        : academicContextsQuery.isError
            ? academicContextsQuery.error?.message || '담당 학급을 불러오지 못했습니다.'
            : !hasAcademicClass
                ? '분석할 담당 학급이 없습니다. 학생 관리에서 반을 먼저 등록해 주세요.'
                : assignmentQuery.isPending
                    ? '분석 대상 학습지를 불러오는 중입니다.'
                    : assignmentQuery.isError
                        ? assignmentQuery.error?.message || '분석 대상 학습지를 불러오지 못했습니다.'
                        : '분석 가능한 학습지가 없습니다.');

    const renderAnalysisContent = () => {
        if (studentId) {
            const performanceQuery = selectedAssignment?.worksheetType === 'COMPREHENSIVE_ASSESSMENT'
                ? studentComprehensivePerformanceQuery
                : studentLearningPerformanceQuery;
            return <StudentAnalysisStatusView
                worksheet={worksheet}
                student={selectedStudent}
                index={selectedIndex}
                onMove={moveStudent}
                summaryQuery={studentSummaryQuery}
                itemsQuery={studentItemsQuery}
                performanceQuery={performanceQuery}
                customLearningQuery={studentCustomLearningQuery}
                reportState={studentReportState}
            />;
        }

        if (overviewQuery.isPending) return <div className="weakness-page__request-state">학급 분석 요약을 불러오는 중입니다.</div>;
        if (overviewQuery.isError) return <div className="weakness-page__request-state" role="alert">{overviewQuery.error?.message || '학급 분석 요약을 불러오지 못했습니다.'}</div>;
        return <ClassAnalysisView
            worksheet={worksheet}
            overview={overviewQuery.data}
            insightsQuery={insightsQuery}
            achievementQuery={achievementQuery}
            comprehensiveInsightsQuery={comprehensiveInsightsQuery}
            itemAchievementQuery={itemAchievementQuery}
            scoreTimeDistributionQuery={scoreTimeDistributionQuery}
            onSelectStudent={selectStudent}
        />;
    };

    return <section className="weakness-page" aria-labelledby="weakness-page-title">
        <header className="weakness-page__page-header">
            <div><h1 id="weakness-page-title">취약점 분석</h1><p>학급과 학생의 응답을 분석하고 보고서에 담길 내용을 확인합니다.</p></div>
            {worksheet && <span>{worksheet.className} · {typeLabel}</span>}
        </header>
        <AnalysisFilters className="weakness-page__filters" controls={filterControls} showContext={false} />
        {!worksheet
            ? <div className="weakness-page__request-state">{requestStateMessage}</div>
            : <div className="weakness-page__workspace">
                <AnalysisTargetList
                    worksheet={worksheet}
                    classPerformanceRate={overviewQuery.data?.summary?.classPerformanceRate}
                    isPending={studentsQuery.isPending}
                    error={studentsQuery.isError ? studentsQuery.error : null}
                    selectedStudentId={selectedStudent?.id}
                    search={studentSearch}
                    onSearch={setStudentSearch}
                    sortBy={targetSort}
                    onSortChange={setTargetSort}
                    onSelectAll={selectAll}
                    onSelectStudent={selectStudent}
                />
                <main className="weakness-page__main">
                    {assignmentNotice && <div className="weakness-page__inline-notice" role="status">{assignmentNotice}</div>}
                    <div className="weakness-page__content-header">
                        <div>
                            <span>{studentId ? '개인 분석' : '학급 분석'}</span>
                            <h2>{studentId ? `${studentSummaryQuery.data?.studentName ?? selectedStudent?.name ?? '학생'} 분석 결과` : `${worksheet.className} 분석 결과`}</h2>
                            <p>{worksheet.title} · {worksheet.date}</p>
                        </div>
                        <button type="button" disabled title="보고서 다운로드는 다음 단계에서 제공됩니다."><i className="bi bi-download" aria-hidden="true" /> {studentId ? '개인 보고서' : '학급 보고서'} 다운로드</button>
                    </div>
                    {renderAnalysisContent()}
                </main>
            </div>}
    </section>;
}

export default WeaknessAnalysisPage;
