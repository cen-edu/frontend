import { useState } from 'react';
import CustomSelect from '../../../components/common/CustomSelect/CustomSelect';
import { customStages, customStageLabels } from '../../../mocks/customCreation';

function Stepper({ value, disabled, label, onChange }) {
    return <span className="custom-config__stepper">
        <button type="button" aria-label={`${label} 문항 수 줄이기`} disabled={disabled || value <= 0} onClick={() => onChange(value - 1)}>−</button>
        <span aria-label={`${label} ${value}문항`}>{value}</span>
        <button type="button" aria-label={`${label} 문항 수 늘리기`} disabled={disabled || value >= 5} onClick={() => onChange(value + 1)}>+</button>
    </span>;
}

function CustomConfigTable({ configs, availableUnits, reason, onCountChange, onRemove, onAdd, onGenerate }) {
    const addable = availableUnits.filter((unit) => !configs.some((config) => config.unitId === unit.id));
    const [unitId, setUnitId] = useState(addable[0]?.id ?? '');
    const total = configs.reduce((sum, config) => sum + customStages.reduce((stageSum, stage) => stageSum + config.counts[stage], 0), 0);
    const canGenerate = total > 0;
    const selectedUnitId = addable.some((unit) => unit.id === unitId) ? unitId : addable[0]?.id ?? '';

    return <section className="custom-config" aria-labelledby="custom-config-title">
        <header><div><h2 id="custom-config-title">문항 구성</h2><p>자동 제안을 검토하고 단계별 문항 수를 조정합니다.</p></div><span>개념당 단계별 최대 5문항</span></header>
        {configs.length === 0 ? <p className="custom-config__empty">{reason}</p> : <div className="custom-config__table-wrap"><table><thead><tr><th>취약 개념</th>{customStages.map((stage) => <th key={stage}>{customStageLabels[stage]}</th>)}<th><span className="custom-sr-only">제외</span></th></tr></thead><tbody>{configs.map((config) => <tr key={config.conceptId}>
            <td><strong>{config.conceptLabel}</strong><span>{config.manual ? '수동 추가 · 복습 제외' : `원본 ${config.sourceQuestionNo}번`}</span></td>
            {customStages.map((stage) => <td key={stage}><Stepper label={`${config.conceptLabel} ${customStageLabels[stage]}`} value={config.counts[stage]} disabled={config.manual && stage === 'retrace'} onChange={(value) => onCountChange(config.conceptId, stage, value)} /></td>)}
            <td><button type="button" className="custom-config__remove" aria-label={`${config.conceptLabel} 제외`} onClick={() => onRemove(config.conceptId)}><i className="bi bi-x-lg" aria-hidden="true" /></button></td>
        </tr>)}</tbody></table></div>}
        <footer className="custom-config__footer">
            <div className="custom-config__add"><CustomSelect label="추가할 개념 선택" value={selectedUnitId} options={addable.length ? addable.map((unit) => ({ value: unit.id, label: unit.name })) : [{ value: '', label: '추가 가능한 개념 없음' }]} onChange={setUnitId} width={200} disabled={!addable.length} placement="top" /><button type="button" disabled={!selectedUnitId} onClick={() => onAdd(selectedUnitId)}>개념 추가</button></div>
            <div className="custom-config__generate"><span>총 <strong>{total}</strong>문항</span><button type="button" disabled={!canGenerate} onClick={onGenerate}>문제 생성</button></div>
        </footer>
    </section>;
}

export default CustomConfigTable;
