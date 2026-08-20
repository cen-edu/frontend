import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UnitScopeFilter, UnitTreeSelector } from '../../../components/common/filters';
import { defaultSupportModes } from '../../../mocks/labels';
import { defaultUnitCounts, difficultyLevels } from '../../../mocks/problemCreation';
import { PracticeProblemView, StudentSupportPreview } from '../../../components/common/worksheets';
import useSectionFocusMode from '../../../components/SectionLayout/useSectionFocusMode';
import sennyChatbot from '../../../assets/images/senny-chatbot.png';
import ProblemAiEditPanel from './components/ProblemAiEditPanel';
import UnitConfigTable from './components/UnitConfigTable';
import { useProblemUnitsQuery } from '../problemUnitHooks.js';
import { useProblemGenerationMutation } from '../problemGenerationHooks.js';
import {
    useWorksheetGenSpecQuery,
    useWorksheetSaveMutation,
} from '../worksheetHooks.js';
import { buildPracticePrefillConfigs } from '../worksheetGenSpecAdapter.js';
import WorksheetTitleModal from '../shared/WorksheetTitleModal.jsx';
import './ProblemCreationPage.scss';
import './components/ProblemCreationComponents.scss';

function ProblemCreationPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const sourceWorksheetId = searchParams.get('from');
    const initializedFromLibrary = useRef(false);
    const [gradeId, setGradeId] = useState('middle-1');
    const [term, setTerm] = useState('first');
    const [unitConfigs, setUnitConfigs] = useState([]);
    const [result, setResult] = useState(null);
    const [selectedProblemId, setSelectedProblemId] = useState('');
    const [savedWorksheet, setSavedWorksheet] = useState(null);
    const [titleModalOpen, setTitleModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [supports, setSupports] = useState({});

    useSectionFocusMode(Boolean(result));

    const unitsQuery = useProblemUnitsQuery({ gradeId, term });
    const genSpecQuery = useWorksheetGenSpecQuery(sourceWorksheetId);
    const generationMutation = useProblemGenerationMutation();
    const saveMutation = useWorksheetSaveMutation();
    const majorUnits = unitsQuery.data ?? [];

    const unitIndex = useMemo(() => new Map(majorUnits.flatMap((major) => major.children.flatMap((middle) => middle.children.map((unit) => [unit.id, { ...unit, majorName: major.name, middleName: middle.name }])))), [majorUnits]);
    const selectedIds = unitConfigs.map((config) => config.unitId);
    const configs = unitConfigs.map((config) => ({ ...config, unit: unitIndex.get(config.unitId) })).filter((config) => config.unit);
    const totalCount = configs.reduce((sum, config) => sum + difficultyLevels.reduce((unitSum, level) => unitSum + config.counts[level], 0), 0);
    const canGenerate = configs.length > 0 && configs.every((config) => difficultyLevels.some((level) => config.counts[level] > 0));
    const selectedProblem = result?.problems.find((problem) => problem.id === selectedProblemId) ?? null;
    const selectedProblemIndex = result?.problems.findIndex((problem) => problem.id === selectedProblemId) ?? -1;
    const previewProgress = result?.problems.length ? Math.round(((selectedProblemIndex + 1) / result.problems.length) * 100) : 0;
    const selectedSupport = supports[selectedProblemId] ?? defaultSupportModes.practice;
    const generationError = generationMutation.error?.code === 'QUESTION_INVENTORY_INSUFFICIENT'
        ? '선택한 소단원과 난이도에 요청한 수량만큼의 문제가 없습니다. 문항 수를 줄여 다시 시도해 주세요.'
        : generationMutation.error?.message;
    const configurationError = genSpecQuery.isError
        ? genSpecQuery.error?.message || '복제할 학습지의 출제 조건을 불러오지 못했습니다.'
        : generationError;
    const isConfigurationLoading = genSpecQuery.isFetching;
    const worksheetTitle = `${configs[0]?.unit.name ?? '수학'}${configs.length > 1 ? ` 외 ${configs.length - 1}개 단원` : ''} 일반 학습`;

    useEffect(() => {
        if (initializedFromLibrary.current) return;
        const source = genSpecQuery.data;
        if (!source || source.type !== 'practice') return;
        initializedFromLibrary.current = true;
        setGradeId(source.gradeId);
        setTerm(source.term);
        setUnitConfigs(buildPracticePrefillConfigs(source.genSpec));
    }, [genSpecQuery.data]);

    const closeResult = () => {
        setEditMode(false);
        setEditTarget(null);
        setResult(null);
        setSelectedProblemId('');
        setSupports({});
    };

    const resetCreation = () => {
        generationMutation.reset();
        setUnitConfigs([]);
        setSavedWorksheet(null);
        saveMutation.reset();
        closeResult();
    };

    const changeScope = (setter, value) => {
        setter(value);
        resetCreation();
    };

    const toggleUnit = (unitId) => {
        generationMutation.reset();
        setUnitConfigs((current) => current.some((config) => config.unitId === unitId)
            ? current.filter((config) => config.unitId !== unitId)
            : [...current, { unitId, counts: { ...defaultUnitCounts } }]);
    };

    const toggleMiddle = (unitIds) => {
        generationMutation.reset();
        setUnitConfigs((current) => {
            const allSelected = unitIds.every((unitId) => current.some((config) => config.unitId === unitId));
            if (allSelected) return current.filter((config) => !unitIds.includes(config.unitId));
            const existingIds = new Set(current.map((config) => config.unitId));
            return [...current, ...unitIds.filter((unitId) => !existingIds.has(unitId)).map((unitId) => ({ unitId, counts: { ...defaultUnitCounts } }))];
        });
    };

    const changeCount = (unitId, difficulty, value) => {
        generationMutation.reset();
        setUnitConfigs((current) => current.map((config) => config.unitId === unitId ? { ...config, counts: { ...config.counts, [difficulty]: value } } : config));
    };

    const createProblems = () => {
        generationMutation.mutate(configs, {
            onSuccess: (problems) => {
                setResult({ problems });
                setSelectedProblemId(problems[0]?.id ?? '');
                setSupports({});
                setSavedWorksheet(null);
                saveMutation.reset();
            },
        });
    };

    const changeSupport = (mode) => {
        if (!selectedProblemId) return;
        setSupports((current) => ({ ...current, [selectedProblemId]: mode }));
        setSavedWorksheet(null);
        saveMutation.reset();
    };

    const updateEditedProblem = (problem) => {
        setResult((current) => ({
            ...current,
            problems: current.problems.map((item) => item.id === problem.id ? problem : item),
        }));
        setSavedWorksheet(null);
        saveMutation.reset();
    };

    const openTitleModal = () => {
        saveMutation.reset();
        setTitleModalOpen(true);
    };

    const saveWorksheet = (title) => {
        saveMutation.mutate({
            title,
            type: 'practice',
            gradeId,
            semester: term,
            problems: result.problems,
            supports: Object.fromEntries(result.problems.map((problem) => [
                problem.id,
                supports[problem.id] ?? defaultSupportModes.practice,
            ])),
        }, {
            onSuccess: (worksheet) => {
                setSavedWorksheet(worksheet);
                setTitleModalOpen(false);
                window.alert('문제 보관함에 저장했습니다.');
                navigate('/problems/library');
            },
        });
    };

    const movePreview = (offset) => {
        const nextProblem = result?.problems[selectedProblemIndex + offset];
        if (nextProblem) {
            setSelectedProblemId(nextProblem.id);
            setEditTarget(null);
        }
    };

    const toggleEditMode = () => {
        setEditMode((current) => !current);
        setEditTarget(null);
    };

    return (
        <section className="problem-creation-page" aria-labelledby={result ? 'problem-result-title' : 'unit-selection-title'}>
            {!result && <UnitScopeFilter gradeId={gradeId} term={term} disabled={generationMutation.isPending || isConfigurationLoading} onGradeChange={(value) => changeScope(setGradeId, value)} onTermChange={(value) => changeScope(setTerm, value)} />}

            {!result ? (
                <div className="problem-creation-page__configuration">
                    <section className="problem-creation-section" aria-labelledby="unit-selection-title">
                        <header><div><h2 id="unit-selection-title">단원 선택</h2><p>출제할 소단원을 선택합니다.</p></div><span>{configs.length}개 선택</span></header>
                        <UnitTreeSelector key={`${gradeId}-${term}`} majorUnits={majorUnits} selectedUnitIds={selectedIds} onToggleUnit={toggleUnit} onToggleMiddleUnit={toggleMiddle} isLoading={unitsQuery.isPending} error={unitsQuery.error} onRetry={unitsQuery.refetch} disabled={generationMutation.isPending || isConfigurationLoading} />
                    </section>
                    <section className="problem-creation-section" aria-labelledby="unit-config-title">
                        <header><div><h2 id="unit-config-title">출제 구성</h2><p>소단원별로 하·중·상 문항 수를 배분합니다.</p></div><span>난이도별 최대 30문항</span></header>
                        <UnitConfigTable configs={configs} totalCount={totalCount} onCountChange={changeCount} onRemove={toggleUnit} onGenerate={createProblems} canGenerate={canGenerate} isGenerating={generationMutation.isPending || isConfigurationLoading} error={configurationError} />
                    </section>
                </div>
            ) : (
                <section className="problem-creation-page__result" aria-labelledby="problem-result-title">
                    <header className="problem-creation-page__result-header">
                        <div><h2 id="problem-result-title">생성 결과</h2><p>총 {result.problems.length}문항을 학생 화면과 같은 순서로 검토합니다.</p></div>
                        <div className="problem-creation-page__result-actions">
                            <button type="button" className="problem-creation-button problem-creation-button--secondary" onClick={closeResult}>이전</button>
                            <button type="button" className={`problem-creation-page__ai-edit-button${editMode ? ' problem-creation-page__ai-edit-button--active' : ''}`} aria-pressed={editMode} onClick={toggleEditMode}>
                                <img src={sennyChatbot} alt="" />
                                {editMode ? '편집 모드 종료' : 'AI 에이전트로 편집'}
                            </button>
                            <button type="button" className="problem-creation-button problem-creation-button--secondary" onClick={openTitleModal} disabled={Boolean(savedWorksheet) || saveMutation.isPending}>{saveMutation.isPending ? '저장 중...' : savedWorksheet ? '저장 완료' : '문제 보관함에 저장'}</button>
                        </div>
                    </header>
                    <div className="problem-creation-page__preview-progress" aria-label={`미리보기 진행률 ${previewProgress}%`}>
                        <div><span style={{ width: `${previewProgress}%` }} /></div>
                        <strong>{selectedProblemIndex + 1}/{result.problems.length}문항</strong>
                    </div>
                    <div className="problem-creation-page__student-preview">
                        <div className="problem-creation-page__student-preview-content">
                            <PracticeProblemView
                                problem={selectedProblem}
                                answerMode="answer"
                                headingId="teacher-preview-problem-title"
                                editMode={editMode}
                                selectedEditTarget={editTarget}
                                onSelectEditTarget={setEditTarget}
                                footer={<footer className="problem-creation-page__preview-controls">
                                    <button type="button" disabled={selectedProblemIndex === 0} onClick={() => movePreview(-1)}>
                                        <i className="bi bi-chevron-left" aria-hidden="true" /> 이전 학습
                                    </button>
                                    <span>풀이를 순서대로 완성해 보세요.</span>
                                    <button type="button" className="problem-creation-page__preview-next" disabled={selectedProblemIndex === result.problems.length - 1} onClick={() => movePreview(1)}>
                                        다음 학습 <i className="bi bi-chevron-right" aria-hidden="true" />
                                    </button>
                                </footer>}
                            />
                            <StudentSupportPreview
                                value={selectedSupport}
                                onChange={changeSupport}
                                concept={selectedProblem?.concept}
                                conceptHeadingId="teacher-preview-concept-title"
                                editMode={editMode}
                                conceptSelected={editTarget?.type === 'concept'}
                                onSelectConcept={() => setEditTarget({ type: 'concept', id: selectedProblem?.id, label: '개념 설명 전체' })}
                            />
                        </div>
                    </div>
                    {editMode && !editTarget && <p className="problem-creation-page__edit-guide" role="status"><i className="bi bi-cursor" aria-hidden="true" /> 편집할 문제 전체, 풀이 과정 또는 개념 설명 영역을 선택하세요.</p>}
                    {editMode && (
                        <ProblemAiEditPanel
                            currentProblem={selectedProblem}
                            target={editTarget}
                            onProblemUpdated={updateEditedProblem}
                            onClose={() => setEditTarget(null)}
                        />
                    )}
                </section>
            )}
            {titleModalOpen && result && <WorksheetTitleModal initialTitle={worksheetTitle} isSaving={saveMutation.isPending} error={saveMutation.isError ? saveMutation.error?.message || '문제 보관함에 저장하지 못했습니다.' : ''} onClose={() => setTitleModalOpen(false)} onSave={saveWorksheet} />}
        </section>
    );
}

export default ProblemCreationPage;
