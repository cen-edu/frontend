import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { UnitScopeFilter, UnitTreeSelector } from '../../../components/common/filters';
import { generateAssessmentProblems } from '../../../mocks/assessmentCreation';
import { defaultSupportModes } from '../../../mocks/labels';
import { libraryWorksheets } from '../../../mocks/problemLibrary';
import {
  AssessmentQuestionView,
  StudentSupportPreview,
} from '../../../components/common/worksheets';
import AssessmentItemBuilder from './components/AssessmentItemBuilder';
import AssessmentOrderModal from './components/AssessmentOrderModal';
import sennyChatbot from '../../../assets/images/senny-chatbot.png';
import ProblemAiEditPanel from '../ProblemCreationPage/components/ProblemAiEditPanel';
import { useProblemUnitsQuery } from '../problemUnitHooks.js';
import './ComprehensiveAssessmentPage.scss';
import './components/AssessmentComponents.scss';

const currentYear = new Date().getFullYear();
let nextRowId = 1;
const createDefaultRow = () => ({ id: `assessment-row-${nextRowId++}`, format: 'choice', difficulty: 'mid', count: 1 });

function ComprehensiveAssessmentPage() {
    const [searchParams] = useSearchParams();
    const initializedFromLibrary = useRef(false);
    const [gradeId, setGradeId] = useState('middle-1');
    const [term, setTerm] = useState('first');
    const [unitItems, setUnitItems] = useState([]);
    const [result, setResult] = useState(null);
    const [selectedProblemId, setSelectedProblemId] = useState('');
    const [saved, setSaved] = useState(false);
    const [orderModalOpen, setOrderModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [supports, setSupports] = useState({});

    const unitsQuery = useProblemUnitsQuery({ gradeId, term });
    const majorUnits = unitsQuery.data ?? [];

    const unitIndex = useMemo(() => new Map(majorUnits.flatMap((major) => major.children.flatMap((middle) => middle.children.map((unit) => [unit.id, { ...unit, majorName: major.name, middleName: middle.name }])))), [majorUnits]);
    const groups = unitItems.map((item) => ({ ...item, unit: unitIndex.get(item.unitId) })).filter((item) => item.unit);
    const selectedUnitIds = groups.map((item) => item.unitId);
    const totalCount = groups.reduce((sum, group) => sum + group.rows.reduce((rowSum, row) => rowSum + row.count, 0), 0);
    const resultScore = result?.problems.reduce((sum, problem) => sum + problem.maxScore, 0) ?? 0;
    const selectedProblem = result?.problems.find((problem) => problem.id === selectedProblemId) ?? null;
    const selectedProblemIndex = result?.problems.findIndex((problem) => problem.id === selectedProblemId) ?? -1;
    const previewProgress = result?.problems.length ? Math.round(((selectedProblemIndex + 1) / result.problems.length) * 100) : 0;
    const canGenerate = totalCount > 0;
    const selectedSupport = supports[selectedProblemId] ?? defaultSupportModes.assessment;
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
        setEditMode(false);
        setEditTarget(null);
        setSupports({});
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
        setEditMode(false);
        setEditTarget(null);
        setSupports({});
    };

    const changeSupport = (mode) => {
        if (!selectedProblemId) return;
        setSupports((current) => ({ ...current, [selectedProblemId]: mode }));
        setSaved(false);
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
                            <UnitTreeSelector key={`${gradeId}-${term}`} majorUnits={majorUnits} selectedUnitIds={selectedUnitIds} onToggleUnit={toggleUnit} onToggleMiddleUnit={toggleMiddleUnit} isLoading={unitsQuery.isPending} error={unitsQuery.error} onRetry={unitsQuery.refetch} />
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
                        <div><h2 id="assessment-result-title">생성 결과</h2><p>{title} · 총 {result.problems.length}문항 · {resultScore}점</p></div>
                        <div className="comprehensive-assessment-page__result-actions">
                            <button type="button" className="assessment-button assessment-button--secondary" onClick={invalidateResult}>이전</button>
                            <button type="button" className="assessment-button assessment-button--secondary" onClick={() => setOrderModalOpen(true)}><i className="bi bi-arrow-down-up" aria-hidden="true" /> 문항 순서 변경</button>
                            <button type="button" className={`comprehensive-assessment-page__ai-edit-button${editMode ? ' comprehensive-assessment-page__ai-edit-button--active' : ''}`} aria-pressed={editMode} onClick={toggleEditMode}>
                                <img src={sennyChatbot} alt="" />
                                {editMode ? '편집 모드 종료' : 'AI 에이전트로 편집'}
                            </button>
                            <button type="button" className="assessment-button assessment-button--secondary" onClick={() => setSaved(true)} disabled={saved}>{saved ? '저장 완료' : '문제 보관함에 저장'}</button>
                        </div>
                    </header>
                    {saved && <p className="comprehensive-assessment-page__saved" role="status"><i className="bi bi-check-circle-fill" aria-hidden="true" /> 문제 보관함에 저장했습니다.</p>}
                    <div className="comprehensive-assessment-page__preview-progress" aria-label={`미리보기 진행률 ${previewProgress}%`}>
                        <div><span style={{ width: `${previewProgress}%` }} /></div>
                        <strong>{selectedProblemIndex + 1}/{result.problems.length}문항</strong>
                    </div>
                    <div className="comprehensive-assessment-page__student-preview">
                        <div className="comprehensive-assessment-page__student-preview-content">
                            <div className="comprehensive-assessment-page__question-preview">
                                <AssessmentQuestionView
                                    problem={selectedProblem}
                                    onScoreChange={changeScore}
                                    editMode={editMode}
                                    selectedEditTarget={editTarget}
                                    onSelectEditTarget={setEditTarget}
                                />
                                <footer className="comprehensive-assessment-page__preview-controls">
                                    <button type="button" disabled={selectedProblemIndex === 0} onClick={() => movePreview(-1)}>
                                        <i className="bi bi-chevron-left" aria-hidden="true" /> 이전 문항
                                    </button>
                                    <span>문항과 정답, 채점 기준을 검토하세요.</span>
                                    <button type="button" className="comprehensive-assessment-page__preview-next" disabled={selectedProblemIndex === result.problems.length - 1} onClick={() => movePreview(1)}>
                                        다음 문항 <i className="bi bi-chevron-right" aria-hidden="true" />
                                    </button>
                                </footer>
                            </div>
                            <StudentSupportPreview
                                value={selectedSupport}
                                onChange={changeSupport}
                                concept={selectedProblem?.concept}
                                conceptHeadingId="assessment-preview-concept-title"
                            />
                        </div>
                    </div>
                    {editMode && !editTarget && <p className="comprehensive-assessment-page__edit-guide" role="status"><i className="bi bi-cursor" aria-hidden="true" /> 편집할 문제 전체, 정답 또는 채점 기준 영역을 선택하세요.</p>}
                    {editMode && <ProblemAiEditPanel target={editTarget} onClose={() => setEditTarget(null)} />}
                </section>
            )}
            {orderModalOpen && result && <AssessmentOrderModal problems={result.problems} onClose={() => setOrderModalOpen(false)} onApply={applyProblemOrder} />}
        </section>
    );
}

export default ComprehensiveAssessmentPage;
