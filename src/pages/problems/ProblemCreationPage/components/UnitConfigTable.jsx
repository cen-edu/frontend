import { difficultyLabels, difficultyLevels } from '../../../../mocks/problemCreation';

function CountStepper({ unitName, difficulty, value, onChange, disabled = false }) {
    const label = difficultyLabels[difficulty];
    return (
        <div className="unit-config__stepper">
            <button type="button" aria-label={`${unitName} ${label} 난이도 문항 수 줄이기`} disabled={disabled || value <= 0} onClick={() => onChange(value - 1)}>−</button>
            <span aria-label={`${unitName} ${label} 난이도 ${value}문항`}>{value}</span>
            <button type="button" aria-label={`${unitName} ${label} 난이도 문항 수 늘리기`} disabled={disabled || value >= 30} onClick={() => onChange(value + 1)}>+</button>
        </div>
    );
}

function UnitConfigTable({ configs, totalCount, onCountChange, onRemove, onGenerate, canGenerate, isGenerating = false, error = null }) {
    return (
        <div className="unit-config">
            {!configs.length ? (
                <div className="unit-config__empty">왼쪽에서 소단원을 선택하면 여기에 추가됩니다.</div>
            ) : (
                <div className="unit-config__scroll">
                    <table>
                        <thead><tr><th>소단원</th>{difficultyLevels.map((level) => <th key={level}>{difficultyLabels[level]}</th>)}<th>소계</th><th><span className="problem-creation-sr-only">제외</span></th></tr></thead>
                        <tbody>
                            {configs.map(({ unit, counts }) => {
                                const subtotal = difficultyLevels.reduce((sum, level) => sum + counts[level], 0);
                                return (
                                    <tr key={unit.id}>
                                        <td><span>{unit.majorName} · {unit.middleName}</span><strong>{unit.name}</strong></td>
                                        {difficultyLevels.map((level) => <td key={level}><CountStepper unitName={unit.name} difficulty={level} value={counts[level]} disabled={isGenerating} onChange={(value) => onCountChange(unit.id, level, value)} /></td>)}
                                        <td className="unit-config__subtotal">{subtotal}</td>
                                        <td><button type="button" className="unit-config__remove" aria-label={`${unit.name} 출제 구성에서 제외`} disabled={isGenerating} onClick={() => onRemove(unit.id)}><i className="bi bi-x-lg" aria-hidden="true" /></button></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
            {error && <p className="unit-config__error" role="alert"><i className="bi bi-exclamation-circle" aria-hidden="true" /> {error}</p>}
            <footer className="unit-config__footer">
                <div><span>총</span><strong>{totalCount}문항</strong>{!canGenerate && <small>각 소단원에 1문항 이상 배분해 주세요.</small>}</div>
                <button type="button" className="problem-creation-button problem-creation-button--primary" disabled={!canGenerate || isGenerating} onClick={onGenerate}>{isGenerating ? '문제 생성 중...' : '문제 생성'}</button>
            </footer>
        </div>
    );
}

export default UnitConfigTable;
