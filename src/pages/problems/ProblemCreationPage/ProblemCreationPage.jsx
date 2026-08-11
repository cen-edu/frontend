import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import UnitScopeFilter from '../../../components/common/UnitScopeFilter/UnitScopeFilter';
import UnitTreeSelector from '../../../components/common/UnitTreeSelector/UnitTreeSelector';
import { curriculumUnits } from '../../../mocks/curriculum';
import { defaultSupportModes } from '../../../mocks/labels';
import { defaultUnitCounts, difficultyLevels, generateProblems } from '../../../mocks/problemCreation';
import { libraryWorksheets } from '../../../mocks/problemLibrary';
import PracticeProblemView from '../../../components/common/PracticeProblemView/PracticeProblemView';
import StudentSupportPreview from '../../../components/common/StudentSupportPreview/StudentSupportPreview';
import sennyChatbot from '../../../assets/images/senny-chatbot.png';
import ProblemAiEditPanel from './components/ProblemAiEditPanel';
import UnitConfigTable from './components/UnitConfigTable';
import './ProblemCreationPage.scss';
import './components/ProblemCreationComponents.scss';

const subjectId = 'math';

function ProblemCreationPage() {
    const [searchParams] = useSearchParams();
    const initializedFromLibrary = useRef(false);
    const [gradeId, setGradeId] = useState('middle-1');
    const [term, setTerm] = useState('first');
    const [unitConfigs, setUnitConfigs] = useState([]);
    const [result, setResult] = useState(null);
    const [selectedProblemId, setSelectedProblemId] = useState('');
    const [saved, setSaved] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [supports, setSupports] = useState({});

    const majorUnits = useMemo(() => curriculumUnits.find((item) => item.gradeId === gradeId && item.subjectId === subjectId && item.term === term)?.majorUnits ?? [], [gradeId, subjectId, term]);
    const unitIndex = useMemo(() => new Map(majorUnits.flatMap((major) => major.middleUnits.flatMap((middle) => middle.smallUnits.map((unit) => [unit.id, { ...unit, majorName: major.name, middleName: middle.name }])))), [majorUnits]);
    const selectedIds = unitConfigs.map((config) => config.unitId);
    const configs = unitConfigs.map((config) => ({ ...config, unit: unitIndex.get(config.unitId) })).filter((config) => config.unit);
    const totalCount = configs.reduce((sum, config) => sum + difficultyLevels.reduce((unitSum, level) => unitSum + config.counts[level], 0), 0);
    const canGenerate = configs.length > 0 && configs.every((config) => difficultyLevels.some((level) => config.counts[level] > 0));
    const selectedProblem = result?.problems.find((problem) => problem.id === selectedProblemId) ?? null;
    const selectedProblemIndex = result?.problems.findIndex((problem) => problem.id === selectedProblemId) ?? -1;
    const previewProgress = result?.problems.length ? Math.round(((selectedProblemIndex + 1) / result.problems.length) * 100) : 0;
    const selectedSupport = supports[selectedProblemId] ?? defaultSupportModes.practice;

    useEffect(() => {
        if (initializedFromLibrary.current) return;
        const source = libraryWorksheets.find((item) => item.id === searchParams.get('from') && item.type === 'practice' && item.origin !== 'custom');
        if (!source) return;
        initializedFromLibrary.current = true;
        setGradeId(source.gradeId);
        setTerm(source.term ?? 'first');
        const countsByUnit = source.problems.reduce((acc, problem) => {
            acc[problem.unitId] ??= { ...defaultUnitCounts };
            acc[problem.unitId][problem.difficulty] += 1;
            return acc;
        }, {});
        setUnitConfigs(Object.entries(countsByUnit).map(([unitId, counts]) => ({ unitId, counts })));
    }, [searchParams]);

    const closeResult = () => {
        setEditMode(false);
        setEditTarget(null);
        setResult(null);
        setSelectedProblemId('');
        setSupports({});
    };

    const resetCreation = () => {
        setUnitConfigs([]);
        setSaved(false);
        closeResult();
    };

    const changeScope = (setter, value) => {
        setter(value);
        resetCreation();
    };

    const toggleUnit = (unitId) => {
        setUnitConfigs((current) => current.some((config) => config.unitId === unitId)
            ? current.filter((config) => config.unitId !== unitId)
            : [...current, { unitId, counts: { ...defaultUnitCounts } }]);
    };

    const toggleMiddle = (unitIds) => {
        setUnitConfigs((current) => {
            const allSelected = unitIds.every((unitId) => current.some((config) => config.unitId === unitId));
            if (allSelected) return current.filter((config) => !unitIds.includes(config.unitId));
            const existingIds = new Set(current.map((config) => config.unitId));
            return [...current, ...unitIds.filter((unitId) => !existingIds.has(unitId)).map((unitId) => ({ unitId, counts: { ...defaultUnitCounts } }))];
        });
    };

    const changeCount = (unitId, difficulty, value) => {
        setUnitConfigs((current) => current.map((config) => config.unitId === unitId ? { ...config, counts: { ...config.counts, [difficulty]: value } } : config));
    };

    const createProblems = () => {
        const problems = generateProblems(configs);
        setResult({ problems });
        setSelectedProblemId(problems[0]?.id ?? '');
        setSupports({});
        setSaved(false);
    };

    const changeSupport = (mode) => {
        if (!selectedProblemId) return;
        setSupports((current) => ({ ...current, [selectedProblemId]: mode }));
        setSaved(false);
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
            {!result && <UnitScopeFilter gradeId={gradeId} term={term} onGradeChange={(value) => changeScope(setGradeId, value)} onTermChange={(value) => changeScope(setTerm, value)} />}

            {!result ? (
                <div className="problem-creation-page__configuration">
                    <section className="problem-creation-section" aria-labelledby="unit-selection-title">
                        <header><div><h2 id="unit-selection-title">단원 선택</h2><p>출제할 소단원을 선택합니다.</p></div><span>{configs.length}개 선택</span></header>
                        <UnitTreeSelector key={`${gradeId}-${subjectId}-${term}`} majorUnits={majorUnits} selectedUnitIds={selectedIds} onToggleUnit={toggleUnit} onToggleMiddleUnit={toggleMiddle} />
                    </section>
                    <section className="problem-creation-section" aria-labelledby="unit-config-title">
                        <header><div><h2 id="unit-config-title">출제 구성</h2><p>소단원별로 하·중·상 문항 수를 배분합니다.</p></div><span>단원당 최대 30문항</span></header>
                        <UnitConfigTable configs={configs} totalCount={totalCount} onCountChange={changeCount} onRemove={toggleUnit} onGenerate={createProblems} canGenerate={canGenerate} />
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
                            <button type="button" className="problem-creation-button problem-creation-button--secondary" onClick={() => setSaved(true)} disabled={saved}>{saved ? '저장 완료' : '문제 보관함에 저장'}</button>
                        </div>
                    </header>
                    {saved && <p className="problem-creation-page__saved" role="status"><i className="bi bi-check-circle-fill" aria-hidden="true" /> 문제 보관함에 저장했습니다.</p>}
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
                    {editMode && <ProblemAiEditPanel target={editTarget} onClose={() => setEditTarget(null)} />}
                </section>
            )}
        </section>
    );
}

export default ProblemCreationPage;
