import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AnalysisFilters, useAcademicContextFilters } from '../../../components/common/filters';
import { SearchInput } from '../../../components/common/inputs';
import {
    useGradingScoreTableQuery,
    useGradingWorksheetsQuery,
    useReleaseGradingResultsMutation,
} from './gradingHooks.js';
import ResultWorksheetList from './components/ResultWorksheetList';
import ResultSummaryBar from './components/ResultSummaryBar';
import ScoreTable from './components/ScoreTable';
import './AssessmentResultPage.scss';
import './components/AssessmentResultComponents.scss';

const statusTabs = [
    { value: 'all', label: '전체' },
    { value: 'grading', label: '채점 대기' },
    { value: 'graded', label: '채점 완료' },
    { value: 'confirmed', label: '확정됨' },
];

const getSelectableWorksheets = (worksheets) => worksheets.flatMap((worksheet) => [
    worksheet,
    ...(worksheet.customLearning?.students ?? []).flatMap((student) => student.sessions ?? []),
]);

const filterWorksheetTree = (worksheets, searchTerm) => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return worksheets;

    return worksheets.reduce((filteredWorksheets, worksheet) => {
        const parentMatches = worksheet.title.toLowerCase().includes(keyword);
        const students = (worksheet.customLearning?.students ?? []).reduce((matchedStudents, student) => {
            const sessions = (student.sessions ?? []).filter((session) => (
                parentMatches || session.title.toLowerCase().includes(keyword)
            ));
            return sessions.length ? [...matchedStudents, { ...student, sessions }] : matchedStudents;
        }, []);

        if (!parentMatches && !students.length) return filteredWorksheets;
        return [...filteredWorksheets, {
            ...worksheet,
            customLearning: worksheet.customLearning
                ? { ...worksheet.customLearning, students }
                : null,
        }];
    }, []);
};

function AssessmentResultPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const {
        filters: academicFilters,
        options: academicOptions,
        changeFilter: updateAcademicFilter,
        query: academicContextsQuery,
    } = useAcademicContextFilters();
    const [status, setStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedId, setSelectedId] = useState(searchParams.get('worksheet') ?? '');
    const hasAcademicClass = Boolean(
        academicFilters.grade
        && academicFilters.classId
        && academicFilters.semester,
    );
    const queryParams = useMemo(() => ({
        grade: academicFilters.grade ? Number(academicFilters.grade) : undefined,
        classId: academicFilters.classId ? Number(academicFilters.classId) : undefined,
        semester: academicFilters.semester || undefined,
        status: status === 'all' ? undefined : status,
    }), [academicFilters.classId, academicFilters.grade, academicFilters.semester, status]);
    const worksheetsQuery = useGradingWorksheetsQuery(queryParams);
    const results = hasAcademicClass ? worksheetsQuery.data ?? [] : [];
    const filtered = useMemo(
        () => filterWorksheetTree(results, searchTerm),
        [results, searchTerm],
    );
    const selectableWorksheets = useMemo(() => getSelectableWorksheets(filtered), [filtered]);
    const selectedWorksheet = selectableWorksheets.find((item) => item.id === selectedId);
    const scoreTableQuery = useGradingScoreTableQuery(Number(selectedWorksheet?.assignmentId));
    const worksheet = scoreTableQuery.data
        ? { ...selectedWorksheet, ...scoreTableQuery.data }
        : null;
    const releaseMutation = useReleaseGradingResultsMutation();

    useEffect(() => {
        const requestedWorksheetId = searchParams.get('worksheet');
        const nextId = selectableWorksheets.some((item) => item.id === requestedWorksheetId)
            ? requestedWorksheetId
            : selectableWorksheets[0]?.id ?? '';
        if (!selectableWorksheets.some((item) => item.id === selectedId)) setSelectedId(nextId);
    }, [searchParams, selectableWorksheets, selectedId]);

    const changeAcademicFilter = (key, value) => {
        updateAcademicFilter(key, value);
        setSelectedId('');
    };

    const filterControls = [
        { key: 'grade', label: '학년 선택', value: academicFilters.grade, options: academicOptions.grades, onChange: (value) => changeAcademicFilter('grade', value), width: 132 },
        { key: 'classId', label: '반 선택', value: academicFilters.classId, options: academicOptions.classes, onChange: (value) => changeAcademicFilter('classId', value), width: 104 },
        { key: 'semester', label: '학기 선택', value: academicFilters.semester, options: academicOptions.semesters, onChange: (value) => changeAcademicFilter('semester', value), width: 112 },
    ].map((control) => ({
        ...control,
        disabled: academicContextsQuery.isPending || academicContextsQuery.isError || !control.options.length,
    }));

    const requestMessage = academicContextsQuery.isPending
        ? '담당 학급을 불러오는 중입니다.'
        : academicContextsQuery.isError
            ? academicContextsQuery.error?.message || '담당 학급을 불러오지 못했습니다.'
            : !hasAcademicClass
                ? '조회할 담당 학급이 없습니다. 학생 관리에서 반을 먼저 등록해 주세요.'
                : worksheetsQuery.isPending
                    ? '평가 결과를 불러오는 중입니다.'
                    : worksheetsQuery.isError
                        ? worksheetsQuery.error?.message || '평가 결과를 불러오지 못했습니다.'
                        : !selectedWorksheet
                            ? '표시할 평가 결과가 없습니다.'
                            : scoreTableQuery.isPending
                                ? '점수표를 불러오는 중입니다.'
                                : scoreTableQuery.isError
                                    ? scoreTableQuery.error?.message || '점수표를 불러오지 못했습니다.'
                                    : '표시할 평가 결과가 없습니다.';

    const openGrading = (studentId) => {
        const params = new URLSearchParams();
        if (studentId) params.set('student', studentId);
        navigate(`/learning/results/${worksheet.assignmentId}/grading?${params}`);
    };
    const confirmResults = () => releaseMutation.mutate(worksheet.assignmentId);

    return (
        <section className="assessment-results" aria-labelledby="assessment-results-title">
            <header className="assessment-results__page-header">
                <div>
                    <h1 id="assessment-results-title">평가 결과</h1>
                    <p>학습별 채점 진행 상태와 학생별 문항 결과를 확인합니다.</p>
                </div>
                <span>검색 결과 <strong>{selectableWorksheets.length}</strong>건</span>
            </header>
            <div className="assessment-results__toolbar">
                <div className="assessment-results__filters">
                    <AnalysisFilters showContext={false} className="analysis-filters--results" controls={filterControls} />
                    <div className="assessment-results__tabs" role="group" aria-label="채점 상태">{statusTabs.map((tab) => <button key={tab.value} type="button" className={status === tab.value ? 'assessment-results__tab assessment-results__tab--active' : 'assessment-results__tab'} onClick={() => setStatus(tab.value)}>{tab.label}</button>)}</div>
                </div>
                <SearchInput value={searchTerm} placeholder="학습명 검색" onChange={setSearchTerm} />
            </div>
            <div className="assessment-results__content">
                <ResultWorksheetList
                    worksheets={filtered}
                    selectedId={selectedId}
                    onSelect={setSelectedId}
                    emptyMessage={!hasAcademicClass ? '등록된 담당 학급이 없습니다.' : undefined}
                />
                <main className="assessment-results__detail">
                    {worksheet ? <><ResultSummaryBar worksheet={worksheet} metrics={worksheet.metrics} onGrade={() => openGrading()} onConfirm={confirmResults} isConfirming={releaseMutation.isPending} errorMessage={releaseMutation.error?.message} /><ScoreTable worksheet={worksheet} onGradeStudent={openGrading} /></> : <div className="assessment-results__empty">{requestMessage}</div>}
                </main>
            </div>
        </section>
    );
}

export default AssessmentResultPage;
