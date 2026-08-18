import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { AnalysisFilters, useAcademicContextFilters } from '../../../components/common/filters';
import { getWorksheetTypeLabel } from '../../../mocks/labels';
import { getStudentMetrics, getWorksheetMetrics, weaknessWorksheets } from '../../../mocks/weaknessAnalysis';
import { useAnalysisAssignmentsQuery } from './analysisAssignmentHooks';
import AnalysisTargetList from './components/AnalysisTargetList';
import ClassAnalysisView from './components/ClassAnalysisView';
import StudentAnalysisView from './components/StudentAnalysisView';
import './WeaknessAnalysisPage.scss';
import './StudentDiagnosisPage.scss';
import './components/WeaknessComponents.scss';

const normalizeWorksheetType = (worksheetType) => {
    const type = String(worksheetType ?? '').toLowerCase();
    return type.includes('assessment') || type.includes('comprehensive') ? 'assessment' : 'practice';
};

const getAnalysisTemplate = (worksheetType) => (
    normalizeWorksheetType(worksheetType) === 'assessment'
        ? weaknessWorksheets['factor-assessment']
        : weaknessWorksheets['factor-practice']
);

function WeaknessAnalysisPage() {
    const { id: studentId } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const initialWorksheet = searchParams.get('worksheet') ?? '';
    const { filters: academicFilters, options: academicOptions, changeFilter: changeAcademicFilter, query: academicContextsQuery } = useAcademicContextFilters();
    const [worksheetId, setWorksheetId] = useState(initialWorksheet);
    const [selection, setSelection] = useState(null);
    const [matrixView, setMatrixView] = useState('score');
    const [matrixSort, setMatrixSort] = useState('score-asc');
    const [targetSort, setTargetSort] = useState('status');
    const [studentSearch, setStudentSearch] = useState('');
    const assignmentQuery = useAnalysisAssignmentsQuery({ classId: academicFilters.classId, semester: academicFilters.semester });
    const assignments = assignmentQuery.data?.assignments ?? [];
    const selectedAssignment = assignments.find((assignment) => String(assignment.assignmentId) === worksheetId && assignment.analysisAvailable);
    const worksheet = useMemo(() => {
        if (!selectedAssignment) return null;
        const template = getAnalysisTemplate(selectedAssignment.worksheetType);
        const gradeLabel = academicOptions.grades.find(({ value }) => value === academicFilters.grade)?.label;
        const classLabel = academicOptions.classes.find(({ value }) => value === academicFilters.classId)?.label;
        return {
            ...template,
            id: String(selectedAssignment.assignmentId),
            title: selectedAssignment.worksheetTitle,
            type: normalizeWorksheetType(selectedAssignment.worksheetType),
            worksheetType: selectedAssignment.worksheetType,
            className: [gradeLabel, classLabel].filter(Boolean).join(' '),
        };
    }, [academicFilters.classId, academicFilters.grade, academicOptions.classes, academicOptions.grades, selectedAssignment]);
    const metrics = useMemo(() => worksheet ? getWorksheetMetrics(worksheet) : null, [worksheet]);
    const displayedWorksheet = useMemo(() => worksheet ? ({ ...worksheet, students: [...worksheet.students].sort((a, b) => {
        if (matrixSort === 'name') return a.name.localeCompare(b.name, 'ko');
        const difference = getStudentMetrics(a).scoreRate - getStudentMetrics(b).scoreRate;
        return matrixSort === 'score-desc' ? -difference : difference;
    }) }) : null, [worksheet, matrixSort]);
    const selectedIndex = worksheet?.students.findIndex((student) => student.id === studentId) ?? -1;
    const selectedStudent = selectedIndex >= 0 ? worksheet.students[selectedIndex] : null;

    useEffect(() => { window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); }, [studentId]);

    useEffect(() => {
        if (assignmentQuery.isPending || assignmentQuery.isError) return;

        const currentAssignment = assignments.find((assignment) => (
            String(assignment.assignmentId) === worksheetId && assignment.analysisAvailable
        ));
        const nextAssignment = currentAssignment ?? assignments.find((assignment) => assignment.analysisAvailable);
        const nextWorksheetId = nextAssignment ? String(nextAssignment.assignmentId) : '';

        if (nextWorksheetId === worksheetId) return;

        setWorksheetId(nextWorksheetId);
        setSelection(null);
        setMatrixView('score');
        navigate(`/learning/weaknesses${studentId ? `/students/${studentId}` : ''}${nextWorksheetId ? `?worksheet=${nextWorksheetId}` : ''}`, { replace: true });
    }, [assignmentQuery.isError, assignmentQuery.isPending, assignments, navigate, studentId, worksheetId]);

    const changeFilter = (key, value) => {
        if (key === 'worksheet') {
            setWorksheetId(value);
            setSelection(null);
            setMatrixView('score');
            navigate(`/learning/weaknesses${studentId ? `/students/${studentId}` : ''}?worksheet=${value}`);
            return;
        }
        changeAcademicFilter(key, value);
        setWorksheetId('');
        setSelection(null);
        setMatrixView('score');
    };
    const selectStudent = (id) => navigate(`/learning/weaknesses/students/${id}?worksheet=${worksheet.id}`);
    const selectAll = () => navigate(`/learning/weaknesses?worksheet=${worksheet.id}`);
    const moveStudent = (delta) => {
        const nextStudent = worksheet.students[selectedIndex + delta];
        if (nextStudent) selectStudent(nextStudent.id);
    };
    const worksheetOptions = assignmentQuery.isPending
        ? [{ value: '', label: '학습지를 불러오는 중입니다.' }]
        : assignmentQuery.isError
            ? [{ value: '', label: '학습지를 불러오지 못했습니다.' }]
            : assignments.length
                ? assignments.map((assignment) => ({
                    value: String(assignment.assignmentId),
                    label: assignment.worksheetTitle,
                    disabled: !assignment.analysisAvailable,
                }))
                : [{ value: '', label: '분석 가능한 학습지가 없습니다.' }];
    const filterControls = [
        { key: 'academicYear', label: '학년도 선택', value: academicFilters.academicYear, options: academicOptions.academicYears, onChange: (value) => changeFilter('academicYear', value), width: 132, disabled: academicContextsQuery.isPending || academicContextsQuery.isError || !academicOptions.academicYears.length },
        { key: 'grade', label: '학년 선택', value: academicFilters.grade, options: academicOptions.grades, onChange: (value) => changeFilter('grade', value), width: 132, disabled: academicContextsQuery.isPending || academicContextsQuery.isError || !academicOptions.grades.length },
        { key: 'classId', label: '반 선택', value: academicFilters.classId, options: academicOptions.classes, onChange: (value) => changeFilter('classId', value), width: 104, disabled: academicContextsQuery.isPending || academicContextsQuery.isError || !academicOptions.classes.length },
        { key: 'semester', label: '학기 선택', value: academicFilters.semester, options: academicOptions.semesters, onChange: (value) => changeFilter('semester', value), width: 104, disabled: academicContextsQuery.isPending || academicContextsQuery.isError || !academicOptions.semesters.length },
        { key: 'worksheet', label: '학습지 선택', value: worksheetId, options: worksheetOptions, onChange: (value) => changeFilter('worksheet', value), width: 252, disabled: assignmentQuery.isPending || assignmentQuery.isError || !assignments.some((assignment) => assignment.analysisAvailable) },
    ];
    const typeLabel = worksheet ? getWorksheetTypeLabel(worksheet) : '';

    const requestStateMessage = assignmentQuery.isPending
        ? '분석 대상 학습지를 불러오는 중입니다.'
        : assignmentQuery.isError
            ? assignmentQuery.error?.message || '분석 대상 학습지를 불러오지 못했습니다.'
            : '분석 가능한 학습지가 없습니다.';

    return <section className="weakness-page" aria-labelledby="weakness-page-title">
        <header className="weakness-page__page-header"><div><h1 id="weakness-page-title">취약점 분석</h1><p>학급과 학생의 응답을 분석하고 보고서에 담길 내용을 확인합니다.</p></div>{worksheet && <span>{worksheet.className} · {typeLabel}</span>}</header>
        <AnalysisFilters className="weakness-page__filters" controls={filterControls} showContext={false} />
        {!worksheet ? <div className="weakness-page__request-state">{requestStateMessage}</div> : <div className="weakness-page__workspace">
            <AnalysisTargetList worksheet={worksheet} selectedStudentId={selectedStudent?.id} search={studentSearch} onSearch={setStudentSearch} sortBy={targetSort} onSortChange={setTargetSort} onSelectAll={selectAll} onSelectStudent={selectStudent} />
            <main className="weakness-page__main">
                <div className="weakness-page__content-header"><div><span>{selectedStudent ? '개인 분석' : '학급 분석'}</span><h2>{selectedStudent ? `${selectedStudent.name} 분석 결과` : `${worksheet.className} 분석 결과`}</h2><p>{worksheet.title} · {worksheet.date} 기준</p></div><button type="button" disabled title="보고서 다운로드는 다음 단계에서 제공됩니다."><i className="bi bi-download" /> {selectedStudent ? '개인 보고서' : '학급 보고서'} 다운로드</button></div>
                {selectedStudent
                    ? <StudentAnalysisView worksheet={worksheet} student={selectedStudent} index={selectedIndex} onMove={moveStudent} />
                    : <ClassAnalysisView worksheet={worksheet} displayedWorksheet={displayedWorksheet} metrics={metrics} selection={selection} onSelection={setSelection} matrixView={matrixView} onMatrixView={setMatrixView} sortBy={matrixSort} onSortBy={setMatrixSort} onSelectStudent={selectStudent} />}
            </main>
        </div>}
    </section>;
}

export default WeaknessAnalysisPage;
