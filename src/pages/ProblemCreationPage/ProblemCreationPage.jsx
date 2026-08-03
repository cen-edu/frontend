import { useMemo, useState } from 'react';
import UnitScopeFilter from '../../components/common/UnitScopeFilter/UnitScopeFilter';
import UnitTreeSelector from '../../components/common/UnitTreeSelector/UnitTreeSelector';
import { curriculumUnits } from '../../mocks/curriculum';
import { defaultUnitCounts, difficultyLevels, generateProblems } from '../../mocks/problemCreation';
import ConceptPanel from './components/ConceptPanel';
import ProblemPreviewList from './components/ProblemPreviewList';
import ProblemStepView from './components/ProblemStepView';
import UnitConfigTable from './components/UnitConfigTable';
import './ProblemCreationPage.scss';
import './components/ProblemCreationComponents.scss';

function ProblemCreationPage() {
    const [gradeId, setGradeId] = useState('middle-1');
    const [subjectId, setSubjectId] = useState('math');
    const [semesterId, setSemesterId] = useState('1');
    const [unitConfigs, setUnitConfigs] = useState([]);
    const [result, setResult] = useState(null);
    const [selectedProblemId, setSelectedProblemId] = useState('');
    const [showAnswers, setShowAnswers] = useState(true);
    const [saved, setSaved] = useState(false);

    const majorUnits = useMemo(() => curriculumUnits.find((item) => item.gradeId === gradeId && item.subjectId === subjectId && item.semesterId === semesterId)?.majorUnits ?? [], [gradeId, semesterId, subjectId]);
    const unitIndex = useMemo(() => new Map(majorUnits.flatMap((major) => major.middleUnits.flatMap((middle) => middle.smallUnits.map((unit) => [unit.id, { ...unit, majorName: major.name, middleName: middle.name }])))), [majorUnits]);
    const selectedIds = unitConfigs.map((config) => config.unitId);
    const configs = unitConfigs.map((config) => ({ ...config, unit: unitIndex.get(config.unitId) })).filter((config) => config.unit);
    const totalCount = configs.reduce((sum, config) => sum + difficultyLevels.reduce((unitSum, level) => unitSum + config.counts[level], 0), 0);
    const canGenerate = configs.length > 0 && configs.every((config) => difficultyLevels.some((level) => config.counts[level] > 0));
    const selectedProblem = result?.problems.find((problem) => problem.id === selectedProblemId) ?? null;

    const resetCreation = () => {
        setUnitConfigs([]);
        setResult(null);
        setSelectedProblemId('');
        setSaved(false);
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
        setSaved(false);
    };

    return (
        <section className="problem-creation-page" aria-labelledby="problem-creation-title">
            <header className="problem-creation-page__page-header">
                <div><h1 id="problem-creation-title">문제 생성</h1><p>출제 단원과 난이도별 문항 수를 설정한 뒤 풀이 단계를 검토합니다.</p></div>
                <span>선택 소단원 <strong>{configs.length}</strong>개 · 총 <strong>{totalCount}</strong>문항</span>
            </header>

            {!result && <UnitScopeFilter gradeId={gradeId} subjectId={subjectId} semesterId={semesterId} onGradeChange={(value) => changeScope(setGradeId, value)} onSubjectChange={(value) => changeScope(setSubjectId, value)} onSemesterChange={(value) => changeScope(setSemesterId, value)} />}

            {!result ? (
                <div className="problem-creation-page__configuration">
                    <section className="problem-creation-section" aria-labelledby="unit-selection-title">
                        <header><div><h2 id="unit-selection-title">단원 선택</h2><p>출제할 소단원을 선택합니다.</p></div><span>{configs.length}개 선택</span></header>
                        <UnitTreeSelector key={`${gradeId}-${subjectId}-${semesterId}`} majorUnits={majorUnits} selectedUnitIds={selectedIds} onToggleUnit={toggleUnit} onToggleMiddleUnit={toggleMiddle} />
                    </section>
                    <section className="problem-creation-section" aria-labelledby="unit-config-title">
                        <header><div><h2 id="unit-config-title">출제 구성</h2><p>소단원별로 하·중·상 문항 수를 배분합니다.</p></div><span>단원당 최대 30문항</span></header>
                        <UnitConfigTable configs={configs} totalCount={totalCount} onCountChange={changeCount} onRemove={toggleUnit} onGenerate={createProblems} canGenerate={canGenerate} />
                    </section>
                </div>
            ) : (
                <section className="problem-creation-page__result" aria-labelledby="problem-result-title">
                    <header className="problem-creation-page__result-header">
                        <div><h2 id="problem-result-title">생성 결과</h2><p>총 {result.problems.length}문항의 문제와 단계별 풀이를 검토합니다.</p></div>
                        <div className="problem-creation-page__result-actions">
                            <button type="button" className="problem-creation-button problem-creation-button--secondary" onClick={() => setResult(null)}>출제 구성 수정</button>
                            <button type="button" className="problem-creation-page__answer-toggle" aria-pressed={showAnswers} onClick={() => setShowAnswers((current) => !current)}><i className={`bi bi-eye${showAnswers ? '' : '-slash'}`} aria-hidden="true" /> 정답 {showAnswers ? '숨기기' : '표시'}</button>
                            <button type="button" className="problem-creation-button problem-creation-button--secondary" onClick={() => setSaved(true)} disabled={saved}>{saved ? '저장 완료' : '문제 보관함에 저장'}</button>
                        </div>
                    </header>
                    {saved && <p className="problem-creation-page__saved" role="status"><i className="bi bi-check-circle-fill" aria-hidden="true" /> 문제 보관함에 저장했습니다.</p>}
                    <div className="problem-creation-page__preview-grid">
                        <ProblemPreviewList problems={result.problems} selectedId={selectedProblemId} onSelect={setSelectedProblemId} />
                        <ProblemStepView problem={selectedProblem} showAnswers={showAnswers} />
                        <ConceptPanel problem={selectedProblem} />
                    </div>
                </section>
            )}
        </section>
    );
}

export default ProblemCreationPage;
