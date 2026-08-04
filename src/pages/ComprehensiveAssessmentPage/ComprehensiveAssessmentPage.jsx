import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import UnitScopeFilter from '../../components/common/UnitScopeFilter/UnitScopeFilter';
import UnitTreeSelector from '../../components/common/UnitTreeSelector/UnitTreeSelector';
import { generateAssessmentProblems } from '../../mocks/assessmentCreation';
import { curriculumUnits } from '../../mocks/curriculum';
import { libraryWorksheets } from '../../mocks/problemLibrary';
import AssessmentItemBuilder from './components/AssessmentItemBuilder';
import AssessmentOrderModal from './components/AssessmentOrderModal';
import AssessmentPreviewList from '../../components/common/ProblemViewer/AssessmentPreviewList';
import AssessmentQuestionView from '../../components/common/ProblemViewer/AssessmentQuestionView';
import ProblemRevisePanel from '../ProblemCreationPage/components/ProblemRevisePanel';
import './ComprehensiveAssessmentPage.scss';
import './components/AssessmentComponents.scss';

const currentYear = new Date().getFullYear();
const subjectId = 'math';
let nextRowId = 1;
let nextRevisionRequestId = 1;
const createDefaultRow = () => ({ id: `assessment-row-${nextRowId++}`, format: 'choice', difficulty: 'mid', count: 1 });

function ComprehensiveAssessmentPage() {
    const [searchParams] = useSearchParams();
    const initializedFromLibrary = useRef(false);
    const [gradeId, setGradeId] = useState('middle-1');
    const [term, setTerm] = useState('first');
    const [unitItems, setUnitItems] = useState([]);
    const [result, setResult] = useState(null);
    const [selectedProblemId, setSelectedProblemId] = useState('');
    const [showAnswers, setShowAnswers] = useState(true);
    const [saved, setSaved] = useState(false);
    const [orderModalOpen, setOrderModalOpen] = useState(false);
    const [revisionRequests, setRevisionRequests] = useState({});

    const majorUnits = useMemo(() => curriculumUnits.find((item) => item.gradeId === gradeId && item.subjectId === subjectId && item.term === term)?.majorUnits ?? [], [gradeId, subjectId, term]);
    const unitIndex = useMemo(() => new Map(majorUnits.flatMap((major) => major.middleUnits.flatMap((middle) => middle.smallUnits.map((unit) => [unit.id, { ...unit, majorName: major.name, middleName: middle.name }])))), [majorUnits]);
    const groups = unitItems.map((item) => ({ ...item, unit: unitIndex.get(item.unitId) })).filter((item) => item.unit);
    const selectedUnitIds = groups.map((item) => item.unitId);
    const totalCount = groups.reduce((sum, group) => sum + group.rows.reduce((rowSum, row) => rowSum + row.count, 0), 0);
    const resultScore = result?.problems.reduce((sum, problem) => sum + problem.maxScore, 0) ?? 0;
    const selectedProblem = result?.problems.find((problem) => problem.id === selectedProblemId) ?? null;
    const canGenerate = totalCount > 0;
    const title = `${currentYear} ${term === 'first' ? '1' : '2'}학기 종합 평가`;

    useEffect(() => {
        if (initializedFromLibrary.current) return;
        const source = libraryWorksheets.find((item) => item.id === searchParams.get('from') && item.type === 'assessment');
        if (!source) return;
        initializedFromLibrary.current = true;
        setGradeId(source.gradeId);
        setTerm(source.term ?? 'first');
        const grouped = source.problems.reduce((acc, problem) => {
            acc[problem.unitId] ??= [];
            const key = `${problem.format}-${problem.difficulty}`;
            const row = acc[problem.unitId].find((item) => item.key === key);
            if (row) row.count += 1;
            else acc[problem.unitId].push({ id: `assessment-row-${nextRowId++}`, key, format: problem.format, difficulty: problem.difficulty, count: 1 });
            return acc;
        }, {});
        setUnitItems(Object.entries(grouped).map(([unitId, rows]) => ({ unitId, rows: rows.map(({ key, ...row }) => row) })));
    }, [searchParams]);

    const invalidateResult = () => {
        setResult(null);
        setSelectedProblemId('');
        setSaved(false);
        setRevisionRequests({});
    };

    const updateUnitItems = (updater) => {
        setUnitItems(updater);
        invalidateResult();
    };

    const resetScope = (setter, value) => {
        setter(value);
        setUnitItems([]);
        invalidateResult();
    };

    const toggleUnit = (unitId) => {
        updateUnitItems((current) => current.some((item) => item.unitId === unitId)
            ? current.filter((item) => item.unitId !== unitId)
            : [...current, { unitId, rows: [createDefaultRow()] }]);
    };

    const toggleMiddleUnit = (unitIds) => {
        updateUnitItems((current) => {
            const allSelected = unitIds.every((unitId) => current.some((item) => item.unitId === unitId));
            if (allSelected) return current.filter((item) => !unitIds.includes(item.unitId));
            const existingIds = new Set(current.map((item) => item.unitId));
            return [...current, ...unitIds.filter((unitId) => !existingIds.has(unitId)).map((unitId) => ({ unitId, rows: [createDefaultRow()] }))];
        });
    };

    const addRow = (unitId) => updateUnitItems((current) => current.map((item) => item.unitId === unitId ? { ...item, rows: [...item.rows, createDefaultRow()] } : item));
    const changeRow = (unitId, rowId, field, value) => updateUnitItems((current) => current.map((item) => item.unitId === unitId ? { ...item, rows: item.rows.map((row) => row.id === rowId ? { ...row, [field]: value } : row) } : item));
    const removeRow = (unitId, rowId) => updateUnitItems((current) => current.map((item) => item.unitId === unitId ? { ...item, rows: item.rows.filter((row) => row.id !== rowId) } : item));

    const createAssessment = () => {
        const items = groups.flatMap(({ unit, rows }) => rows.map((row) => ({ unit, format: row.format, difficulty: row.difficulty, count: row.count })));
        const problems = generateAssessmentProblems(items);
        setResult({ problems });
        setSelectedProblemId(problems[0]?.id ?? '');
        setSaved(false);
        setRevisionRequests({});
    };

    const addRevisionRequest = (prompt) => {
        if (!selectedProblem) return;
        setRevisionRequests((current) => ({
            ...current,
            [selectedProblem.id]: [...(current[selectedProblem.id] ?? []), { id: `assessment-revision-${nextRevisionRequestId++}`, prompt }],
        }));
    };

    const removeRevisionRequest = (requestId) => {
        setRevisionRequests((current) => ({
            ...current,
            [selectedProblemId]: (current[selectedProblemId] ?? []).filter((request) => request.id !== requestId),
        }));
    };

    const changeScore = (problemId, value) => {
        const score = Number(value);
        if (!Number.isFinite(score) || score < 1 || score > 100) return;
        setResult((current) => ({ ...current, problems: current.problems.map((problem) => problem.id === problemId ? { ...problem, maxScore: score } : problem) }));
        setSaved(false);
    };

    const applyProblemOrder = (orderedProblems) => {
        setResult((current) => ({
            ...current,
            problems: orderedProblems.map((problem, index) => ({ ...problem, no: index + 1 })),
        }));
        setSaved(false);
        setOrderModalOpen(false);
    };

    return (
        <section className="comprehensive-assessment-page" aria-labelledby={result ? 'assessment-result-title' : 'assessment-unit-selection-title'}>
            {!result ? (
                <>
                    <UnitScopeFilter
                        gradeId={gradeId}
                        term={term}
                        onGradeChange={(value) => resetScope(setGradeId, value)}
                        onTermChange={(value) => resetScope(setTerm, value)}
                    />
                    <div className="comprehensive-assessment-page__configuration">
                        <section className="assessment-section" aria-labelledby="assessment-unit-selection-title">
                            <header><div><h2 id="assessment-unit-selection-title">단원 선택</h2><p>종합 평가에 포함할 소단원을 선택합니다.</p></div><span>{groups.length}개 선택</span></header>
                            <UnitTreeSelector key={`${gradeId}-${subjectId}-${term}`} majorUnits={majorUnits} selectedUnitIds={selectedUnitIds} onToggleUnit={toggleUnit} onToggleMiddleUnit={toggleMiddleUnit} />
                        </section>
                        <section className="assessment-section" aria-labelledby="assessment-builder-title">
                            <header><div><h2 id="assessment-builder-title">출제 구성</h2><p>유형, 난이도, 문항 수를 행 단위로 설정합니다.</p></div><span>행당 1~10문항</span></header>
                            <AssessmentItemBuilder groups={groups} totalCount={totalCount} canGenerate={canGenerate} onAddRow={addRow} onChangeRow={changeRow} onRemoveRow={removeRow} onRemoveUnit={toggleUnit} onGenerate={createAssessment} />
                        </section>
                    </div>
                </>
            ) : (
                <section className="comprehensive-assessment-page__result" aria-labelledby="assessment-result-title">
                    <header className="comprehensive-assessment-page__result-header">
                        <div><h2 id="assessment-result-title">{title}</h2><p>총 {result.problems.length}문항 · {resultScore}점</p></div>
                        <div className="comprehensive-assessment-page__result-actions">
                            <button type="button" className="assessment-button assessment-button--secondary" onClick={invalidateResult}>출제 구성 수정</button>
                            <button type="button" className="assessment-button assessment-button--secondary" onClick={() => setOrderModalOpen(true)}><i className="bi bi-arrow-down-up" aria-hidden="true" /> 문항 순서 변경</button>
                            <button type="button" className="comprehensive-assessment-page__answer-toggle" aria-pressed={showAnswers} onClick={() => setShowAnswers((current) => !current)}><i className={`bi bi-eye${showAnswers ? '' : '-slash'}`} aria-hidden="true" /> 정답 {showAnswers ? '숨기기' : '표시'}</button>
                            <button type="button" className="assessment-button assessment-button--secondary" onClick={() => setSaved(true)} disabled={saved}>{saved ? '저장 완료' : '문제 보관함에 저장'}</button>
                        </div>
                    </header>
                    {saved && <p className="comprehensive-assessment-page__saved" role="status"><i className="bi bi-check-circle-fill" aria-hidden="true" /> 문제 보관함에 저장했습니다.</p>}
                    <div className="comprehensive-assessment-page__preview-grid">
                        <AssessmentPreviewList problems={result.problems} selectedId={selectedProblemId} onSelect={setSelectedProblemId} />
                        <div className="comprehensive-assessment-page__question-column">
                            <AssessmentQuestionView problem={selectedProblem} showAnswers={showAnswers} onScoreChange={changeScore} />
                            <ProblemRevisePanel key={selectedProblemId} problem={selectedProblem} requests={revisionRequests[selectedProblemId] ?? []} onAddRequest={addRevisionRequest} onRemoveRequest={removeRevisionRequest} />
                        </div>
                    </div>
                </section>
            )}
            {orderModalOpen && result && <AssessmentOrderModal problems={result.problems} onClose={() => setOrderModalOpen(false)} onApply={applyProblemOrder} />}
        </section>
    );
}

export default ComprehensiveAssessmentPage;
