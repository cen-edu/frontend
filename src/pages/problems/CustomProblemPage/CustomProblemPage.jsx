import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnalysisFilters } from '../../../components/common/filters';
import { buildProposal, createCustomAssignment, createManualConfig, generateCustomProblems, getAvailableCustomUnits } from '../../../mocks/customCreation';
import { customStageLabels, defaultSupportModes, difficultyLabels } from '../../../mocks/labels';
import { weaknessFilterOptions, weaknessWorksheets } from '../../../mocks/weaknessAnalysis';
import { PracticeProblemView, StudentSupportPreview } from '../../../components/common/worksheets';
import sennyChatbot from '../../../assets/images/senny-chatbot.png';
import ProblemAiEditPanel from '../ProblemCreationPage/components/ProblemAiEditPanel';
import CustomAssignBar from './components/CustomAssignBar';
import CustomConfigTable from './components/CustomConfigTable';
import StudentWeaknessList from './components/StudentWeaknessList';
import WeaknessSummaryCard from './components/WeaknessSummaryCard';
import './CustomProblemPage.scss';
import './components/CustomProblemComponents.scss';
import '../ProblemCreationPage/components/ProblemCreationComponents.scss';

const defaultWorksheetId = 'factor-practice';

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
    const [editMode, setEditMode] = useState(false);
    const [editTarget, setEditTarget] = useState(null);

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
    const currentWork = studentWork[workKey] ?? { configs: selectedProposal.configs, problems: [], assignment: null, supports: {} };
    const selectedProblem = currentWork.problems.find((problem) => problem.id === selectedProblemId) ?? currentWork.problems[0] ?? null;
    const selectedProblemIndex = currentWork.problems.findIndex((problem) => problem.id === selectedProblem?.id);
    const previewProgress = currentWork.problems.length ? Math.round(((selectedProblemIndex + 1) / currentWork.problems.length) * 100) : 0;
    const selectedSupport = currentWork.supports?.[selectedProblem?.id] ?? defaultSupportModes.custom;

    const updateCurrentWork = (updater) => setStudentWork((current) => {
        const base = current[workKey] ?? { configs: selectedProposal.configs, problems: [], assignment: null, supports: {} };
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
        setEditMode(false);
        setEditTarget(null);
        setSearchParams({ worksheet: value, students: nextStudentId });
    };

    const changeCount = (conceptId, stage, value) => updateCurrentWork((work) => ({ ...work, configs: work.configs.map((config) => config.conceptId === conceptId ? { ...config, counts: { ...config.counts, [stage]: value } } : config), problems: [], assignment: null, supports: {} }));
    const removeConfig = (conceptId) => updateCurrentWork((work) => ({ ...work, configs: work.configs.filter((config) => config.conceptId !== conceptId), problems: [], assignment: null, supports: {} }));
    const addConfig = (unitId) => {
        const unit = availableUnits.find((item) => item.id === unitId);
        if (!unit) return;
        updateCurrentWork((work) => ({ ...work, configs: [...work.configs, createManualConfig(unit)], problems: [], assignment: null, supports: {} }));
    };
    const generate = () => {
        const problems = generateCustomProblems(selectedStudent, currentWork.configs);
        updateCurrentWork((work) => ({ ...work, problems, assignment: null, supports: {} }));
        setSelectedProblemId(problems[0]?.id ?? '');
        setEditMode(false);
        setEditTarget(null);
    };
    const changeSupport = (mode) => {
        if (!selectedProblem) return;
        updateCurrentWork((work) => ({ ...work, supports: { ...work.supports, [selectedProblem.id]: mode }, assignment: null }));
    };
    const assign = (dueAt) => updateCurrentWork((work) => ({ ...work, assignment: createCustomAssignment(selectedStudent, dueAt, work.problems, work.supports) }));
    const selectStudent = (studentId) => {
        setSelectedStudentId(studentId);
        setSelectedProblemId('');
        setEditMode(false);
        setEditTarget(null);
    };
    const editConfiguration = () => {
        updateCurrentWork((work) => ({ ...work, problems: [], assignment: null, supports: {} }));
        setEditMode(false);
        setEditTarget(null);
    };
    const movePreview = (offset) => {
        const nextProblem = currentWork.problems[selectedProblemIndex + offset];
        if (!nextProblem) return;
        setSelectedProblemId(nextProblem.id);
        setEditTarget(null);
    };
    const toggleEditMode = () => {
        setEditMode((current) => !current);
        setEditTarget(null);
    };

    const filterControls = [
        { key: 'year', label: '학년도 선택', value: filters.year, options: weaknessFilterOptions.years, onChange: (value) => changeFilter('year', value), width: 132 },
        { key: 'gradeId', label: '학년 선택', value: filters.gradeId, options: weaknessFilterOptions.grades, onChange: (value) => changeFilter('gradeId', value), width: 132 },
        { key: 'classId', label: '반 선택', value: filters.classId, options: weaknessFilterOptions.classes, onChange: (value) => changeFilter('classId', value), width: 104 },
        { key: 'term', label: '학기 선택', value: filters.term, options: weaknessFilterOptions.terms, onChange: (value) => changeFilter('term', value), width: 104 },
        { key: 'worksheetId', label: '학습지 선택', value: filters.worksheetId, options: weaknessFilterOptions.worksheets.map((option) => ({ ...option, disabled: weaknessWorksheets[option.value].type !== 'practice', label: weaknessWorksheets[option.value].type === 'practice' ? option.label : `${option.label} · 분석 미완료` })), onChange: (value) => changeFilter('worksheetId', value), width: 280 },
    ];

    const workByStudentId = Object.fromEntries(worksheet.students.map((student) => [student.id, studentWork[`${worksheet.id}:${student.id}`]]));

    return <section className="custom-problem-page" aria-labelledby="custom-problem-title">
        {!currentWork.problems.length && <header className="custom-problem-page__page-header"><div><h1 id="custom-problem-title">맞춤 문제 생성</h1><p>풀이 단계별 오답을 바탕으로 비계를 줄이는 3단계 문제를 구성합니다.</p></div><span>{worksheet.className} · {worksheet.title}</span></header>}
        {currentWork.problems.length ? <section className="custom-problem-result" aria-labelledby="custom-result-title">
            <header className="custom-problem-result__header">
                <div><h2 id="custom-result-title">생성 결과</h2><p>{selectedStudent.name} 학생 · 총 {currentWork.problems.length}문항을 학생 화면과 같은 순서로 검토합니다.</p></div>
                <div className="custom-problem-result__actions">
                    <button type="button" className="custom-problem-result__secondary-button" onClick={editConfiguration}>이전</button>
                    <button type="button" className={`custom-problem-result__ai-edit-button${editMode ? ' custom-problem-result__ai-edit-button--active' : ''}`} aria-pressed={editMode} onClick={toggleEditMode}>
                        <img src={sennyChatbot} alt="" />
                        {editMode ? '편집 모드 종료' : 'AI 에이전트로 편집'}
                    </button>
                </div>
            </header>
            <div className="custom-problem-result__progress" aria-label={`미리보기 진행률 ${previewProgress}%`}>
                <div><span style={{ width: `${previewProgress}%` }} /></div>
                <strong>{selectedProblemIndex + 1}/{currentWork.problems.length}문항</strong>
            </div>
            <div className="custom-problem-result__student-preview">
                <div className="custom-problem-result__student-preview-content">
                    <PracticeProblemView
                        problem={selectedProblem}
                        answerMode="answer"
                        headingId="custom-preview-problem-title"
                        difficultyText={`${customStageLabels[selectedProblem.stage]} · 난이도 ${difficultyLabels[selectedProblem.difficulty]}`}
                        editMode={editMode}
                        selectedEditTarget={editTarget}
                        onSelectEditTarget={setEditTarget}
                        footer={<footer className="custom-problem-result__preview-controls">
                            <button type="button" disabled={selectedProblemIndex === 0} onClick={() => movePreview(-1)}>
                                <i className="bi bi-chevron-left" aria-hidden="true" /> 이전 학습
                            </button>
                            <span>{customStageLabels[selectedProblem.stage]} 단계 문제를 검토하고 있습니다.</span>
                            <button type="button" className="custom-problem-result__preview-next" disabled={selectedProblemIndex === currentWork.problems.length - 1} onClick={() => movePreview(1)}>
                                다음 학습 <i className="bi bi-chevron-right" aria-hidden="true" />
                            </button>
                        </footer>}
                    />
                </div>
                <StudentSupportPreview
                    value={selectedSupport}
                    onChange={changeSupport}
                    concept={selectedProblem.concept}
                    conceptHeadingId="custom-preview-concept-title"
                    studentName={selectedStudent.name}
                />
            </div>
            {editMode && !editTarget && <p className="custom-problem-result__edit-guide" role="status"><i className="bi bi-cursor" aria-hidden="true" /> 편집할 문제 전체 또는 풀이 과정 영역을 선택하세요.</p>}
            {editMode && <ProblemAiEditPanel target={editTarget} onClose={() => setEditTarget(null)} />}
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
