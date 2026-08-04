import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AnalysisFilters from '../../components/common/AnalysisFilters/AnalysisFilters';
import { buildProposal, createCustomAssignment, createManualConfig, generateCustomProblems, getAvailableCustomUnits } from '../../mocks/customCreation';
import { weaknessFilterOptions, weaknessWorksheets } from '../../mocks/weaknessAnalysis';
import ProblemPreviewList from '../../components/common/ProblemViewer/ProblemPreviewList';
import ProblemStepView from '../../components/common/ProblemViewer/ProblemStepView';
import ProblemRevisePanel from '../ProblemCreationPage/components/ProblemRevisePanel';
import CustomAssignBar from './components/CustomAssignBar';
import CustomConfigTable from './components/CustomConfigTable';
import StudentWeaknessList from './components/StudentWeaknessList';
import WeaknessSummaryCard from './components/WeaknessSummaryCard';
import './CustomProblemPage.scss';
import './components/CustomProblemComponents.scss';
import '../ProblemCreationPage/components/ProblemCreationComponents.scss';

const defaultWorksheetId = 'factor-practice';
let nextRevisionRequestId = 1;

function CustomProblemPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const queryWorksheet = searchParams.get('worksheet');
    const initialWorksheetId = weaknessWorksheets[queryWorksheet]?.type === 'practice' ? queryWorksheet : defaultWorksheetId;
    const initialWorksheet = weaknessWorksheets[initialWorksheetId];
    const queryStudents = searchParams.get('students')?.split(',').filter(Boolean) ?? [];
    const initialStudentId = initialWorksheet.students.some((student) => student.id === queryStudents[0]) ? queryStudents[0] : initialWorksheet.students[0]?.id ?? '';

    const [filters, setFilters] = useState({ year: '2026', gradeId: initialWorksheet.gradeId, classId: initialWorksheet.classId, term: 'first', worksheetId: initialWorksheetId });
    const [selectedStudentId, setSelectedStudentId] = useState(initialStudentId);
    const [studentWork, setStudentWork] = useState({});
    const [selectedProblemId, setSelectedProblemId] = useState('');
    const [revisionRequests, setRevisionRequests] = useState({});

    const worksheet = weaknessWorksheets[filters.worksheetId];
    const proposals = useMemo(() => Object.fromEntries(worksheet.students.map((student) => {
        const proposal = buildProposal(worksheet, student);
        const preferredConcept = searchParams.get('concept');
        if (preferredConcept) proposal.configs.sort((a, b) => Number(b.conceptId === preferredConcept) - Number(a.conceptId === preferredConcept));
        return [student.id, proposal];
    })), [searchParams, worksheet]);
    const availableUnits = useMemo(() => getAvailableCustomUnits(worksheet), [worksheet]);
    const selectedStudent = worksheet.students.find((student) => student.id === selectedStudentId) ?? worksheet.students[0];
    const selectedProposal = proposals[selectedStudent.id];
    const workKey = `${worksheet.id}:${selectedStudent.id}`;
    const currentWork = studentWork[workKey] ?? { configs: selectedProposal.configs, problems: [], assignment: null };
    const selectedProblem = currentWork.problems.find((problem) => problem.id === selectedProblemId) ?? currentWork.problems[0] ?? null;
    const revisionKey = selectedProblem ? `${workKey}:${selectedProblem.id}` : '';

    const updateCurrentWork = (updater) => setStudentWork((current) => {
        const base = current[workKey] ?? { configs: selectedProposal.configs, problems: [], assignment: null };
        return { ...current, [workKey]: typeof updater === 'function' ? updater(base) : updater };
    });

    const changeFilter = (key, value) => {
        if (key !== 'worksheetId') {
            setFilters((current) => ({ ...current, [key]: value }));
            return;
        }
        const nextWorksheet = weaknessWorksheets[value];
        const nextStudentId = nextWorksheet.students[0]?.id ?? '';
        setFilters((current) => ({ ...current, worksheetId: value, gradeId: nextWorksheet.gradeId, classId: nextWorksheet.classId }));
        setSelectedStudentId(nextStudentId);
        setSelectedProblemId('');
        setSearchParams({ worksheet: value, students: nextStudentId });
    };

    const changeCount = (conceptId, stage, value) => updateCurrentWork((work) => ({ ...work, configs: work.configs.map((config) => config.conceptId === conceptId ? { ...config, counts: { ...config.counts, [stage]: value } } : config), problems: [], assignment: null }));
    const removeConfig = (conceptId) => updateCurrentWork((work) => ({ ...work, configs: work.configs.filter((config) => config.conceptId !== conceptId), problems: [], assignment: null }));
    const addConfig = (unitId) => {
        const unit = availableUnits.find((item) => item.id === unitId);
        if (!unit) return;
        updateCurrentWork((work) => ({ ...work, configs: [...work.configs, createManualConfig(unit)], problems: [], assignment: null }));
    };
    const generate = () => {
        const problems = generateCustomProblems(selectedStudent, currentWork.configs);
        updateCurrentWork((work) => ({ ...work, problems, assignment: null }));
        setSelectedProblemId(problems[0]?.id ?? '');
        setRevisionRequests((current) => Object.fromEntries(Object.entries(current).filter(([key]) => !key.startsWith(`${workKey}:`))));
    };
    const assign = (dueAt) => updateCurrentWork((work) => ({ ...work, assignment: createCustomAssignment(selectedStudent, dueAt, work.problems) }));
    const selectStudent = (studentId) => { setSelectedStudentId(studentId); setSelectedProblemId(''); };
    const addRevisionRequest = (prompt) => {
        if (!revisionKey) return;
        setRevisionRequests((current) => ({
            ...current,
            [revisionKey]: [...(current[revisionKey] ?? []), { id: `custom-revision-${nextRevisionRequestId++}`, prompt }],
        }));
    };
    const removeRevisionRequest = (requestId) => setRevisionRequests((current) => ({
        ...current,
        [revisionKey]: (current[revisionKey] ?? []).filter((request) => request.id !== requestId),
    }));
    const editConfiguration = () => {
        updateCurrentWork((work) => ({ ...work, problems: [], assignment: null }));
        setRevisionRequests((current) => Object.fromEntries(Object.entries(current).filter(([key]) => !key.startsWith(`${workKey}:`))));
    };

    const filterControls = [
        { key: 'year', label: '학년도 선택', value: filters.year, options: weaknessFilterOptions.years, onChange: (value) => changeFilter('year', value), width: 132 },
        { key: 'gradeId', label: '학년 선택', value: filters.gradeId, options: weaknessFilterOptions.grades, onChange: (value) => changeFilter('gradeId', value), width: 132 },
        { key: 'classId', label: '반 선택', value: filters.classId, options: weaknessFilterOptions.classes, onChange: (value) => changeFilter('classId', value), width: 104 },
        { key: 'term', label: '학기 선택', value: filters.term, options: weaknessFilterOptions.terms, onChange: (value) => changeFilter('term', value), width: 104 },
        { key: 'worksheetId', label: '학습지 선택', value: filters.worksheetId, options: weaknessFilterOptions.worksheets.map((option) => ({ ...option, disabled: weaknessWorksheets[option.value].type !== 'practice', label: weaknessWorksheets[option.value].type === 'practice' ? option.label : `${option.label} · 분석 미완료` })), onChange: (value) => changeFilter('worksheetId', value), width: 280 },
    ];

    const workByStudentId = Object.fromEntries(worksheet.students.map((student) => [student.id, studentWork[`${worksheet.id}:${student.id}`]]));

    return <section className="custom-problem-page" aria-labelledby={currentWork.problems.length ? 'custom-result-title' : 'custom-problem-title'}>
        {!currentWork.problems.length && <header className="custom-problem-page__page-header"><div><h1 id="custom-problem-title">맞춤 문제 생성</h1><p>풀이 단계별 오답을 바탕으로 비계를 줄이는 3단계 문제를 구성합니다.</p></div><span>{worksheet.className} · {worksheet.title}</span></header>}
        {currentWork.problems.length ? <section className="custom-problem-result" aria-labelledby="custom-result-title">
            <header><div><h2 id="custom-result-title">생성 결과</h2><p>{selectedStudent.name} 학생 · 총 {currentWork.problems.length}문항</p></div><div><button type="button" onClick={editConfiguration}>구성 수정</button></div></header>
            <div className="custom-problem-result__preview"><ProblemPreviewList problems={currentWork.problems} selectedId={selectedProblem?.id} onSelect={setSelectedProblemId} /><div className="custom-problem-result__problem-column"><ProblemStepView problem={selectedProblem} /><ProblemRevisePanel key={revisionKey} problem={selectedProblem} requests={revisionRequests[revisionKey] ?? []} onAddRequest={addRevisionRequest} onRemoveRequest={removeRevisionRequest} /></div></div>
            <CustomAssignBar student={selectedStudent} assignment={currentWork.assignment} onAssign={assign} />
        </section> : <>
            <AnalysisFilters className="custom-problem-page__filters" controls={filterControls} showContext={false} />
            <div className="custom-problem-page__workspace">
                <StudentWeaknessList students={worksheet.students} selectedId={selectedStudent.id} proposals={proposals} studentWork={workByStudentId} onSelect={selectStudent} />
                <div className="custom-problem-page__main">
                    <CustomConfigTable configs={currentWork.configs} availableUnits={availableUnits} reason={selectedProposal.reason} onCountChange={changeCount} onRemove={removeConfig} onAdd={addConfig} onGenerate={generate} />
                </div>
                <WeaknessSummaryCard student={selectedStudent} configs={selectedProposal.configs} reason={selectedProposal.reason} />
            </div>
        </>}
    </section>;
}

export default CustomProblemPage;
