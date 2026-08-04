import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import UnitScopeFilter from '../../components/common/UnitScopeFilter/UnitScopeFilter';
import UnitTreeSelector from '../../components/common/UnitTreeSelector/UnitTreeSelector';
import { curriculumUnits } from '../../mocks/curriculum';
import { defaultUnitCounts, difficultyLevels, generateProblems } from '../../mocks/problemCreation';
import { libraryWorksheets } from '../../mocks/problemLibrary';
import ConceptPanel from './components/ConceptPanel';
import ProblemPreviewList from '../../components/common/ProblemViewer/ProblemPreviewList';
import ProblemRevisePanel from './components/ProblemRevisePanel';
import ProblemStepView from '../../components/common/ProblemViewer/ProblemStepView';
import UnitConfigTable from './components/UnitConfigTable';
import './ProblemCreationPage.scss';
import './components/ProblemCreationComponents.scss';

const subjectId = 'math';
let nextRequestId = 1;

function ProblemCreationPage() {
    const [searchParams] = useSearchParams();
    const initializedFromLibrary = useRef(false);
    const [gradeId, setGradeId] = useState('middle-1');
    const [term, setTerm] = useState('first');
    const [unitConfigs, setUnitConfigs] = useState([]);
    const [result, setResult] = useState(null);
    const [selectedProblemId, setSelectedProblemId] = useState('');
    const [saved, setSaved] = useState(false);
    const [revisionRequests, setRevisionRequests] = useState({});

    const majorUnits = useMemo(() => curriculumUnits.find((item) => item.gradeId === gradeId && item.subjectId === subjectId && item.term === term)?.majorUnits ?? [], [gradeId, subjectId, term]);
    const unitIndex = useMemo(() => new Map(majorUnits.flatMap((major) => major.middleUnits.flatMap((middle) => middle.smallUnits.map((unit) => [unit.id, { ...unit, majorName: major.name, middleName: middle.name }])))), [majorUnits]);
    const selectedIds = unitConfigs.map((config) => config.unitId);
    const configs = unitConfigs.map((config) => ({ ...config, unit: unitIndex.get(config.unitId) })).filter((config) => config.unit);
    const totalCount = configs.reduce((sum, config) => sum + difficultyLevels.reduce((unitSum, level) => unitSum + config.counts[level], 0), 0);
    const canGenerate = configs.length > 0 && configs.every((config) => difficultyLevels.some((level) => config.counts[level] > 0));
    const selectedProblem = result?.problems.find((problem) => problem.id === selectedProblemId) ?? null;

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
        setResult(null);
        setSelectedProblemId('');
        setRevisionRequests({});
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
        setSaved(false);
        setRevisionRequests({});
    };

    const addRevisionRequest = (prompt) => {
        if (!selectedProblem) return;
        setRevisionRequests((current) => ({
            ...current,
            [selectedProblem.id]: [...(current[selectedProblem.id] ?? []), { id: `revision-request-${nextRequestId++}`, prompt }],
        }));
    };

    const removeRevisionRequest = (requestId) => {
        setRevisionRequests((current) => ({
            ...current,
            [selectedProblemId]: (current[selectedProblemId] ?? []).filter((request) => request.id !== requestId),
        }));
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
                        <div><h2 id="problem-result-title">생성 결과</h2><p>총 {result.problems.length}문항의 문제와 단계별 풀이를 검토하고 문항별 수정 요청을 작성합니다.</p></div>
                        <div className="problem-creation-page__result-actions">
                            <button type="button" className="problem-creation-button problem-creation-button--secondary" onClick={closeResult}>출제 구성 수정</button>
                            <button type="button" className="problem-creation-button problem-creation-button--secondary" onClick={() => setSaved(true)} disabled={saved}>{saved ? '저장 완료' : '문제 보관함에 저장'}</button>
                        </div>
                    </header>
                    {saved && <p className="problem-creation-page__saved" role="status"><i className="bi bi-check-circle-fill" aria-hidden="true" /> 문제 보관함에 저장했습니다.</p>}
                    <div className="problem-creation-page__preview-grid">
                        <ProblemPreviewList problems={result.problems} selectedId={selectedProblemId} onSelect={setSelectedProblemId} />
                        <div className="problem-creation-page__problem-column">
                            <ProblemStepView problem={selectedProblem} />
                            <ProblemRevisePanel key={selectedProblemId} problem={selectedProblem} requests={revisionRequests[selectedProblemId] ?? []} onAddRequest={addRevisionRequest} onRemoveRequest={removeRevisionRequest} />
                        </div>
                        <ConceptPanel problem={selectedProblem} />
                    </div>
                </section>
            )}
        </section>
    );
}

export default ProblemCreationPage;
