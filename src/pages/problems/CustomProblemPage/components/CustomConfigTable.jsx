import { customStages, customStageStepLabels } from '../../../../mocks/customCreation';

function Stepper({ value, max, disabled, label, onChange }) {
    return <span className="custom-config__stepper">
        <button type="button" aria-label={`${label} 문항 수 줄이기`} disabled={disabled || value <= 0} onClick={() => onChange(value - 1)}>−</button>
        <span aria-label={`${label} ${value}문항`}>{value}</span>
        <button type="button" aria-label={`${label} 문항 수 늘리기`} disabled={disabled || value >= max} onClick={() => onChange(value + 1)}>+</button>
    </span>;
}

function CustomConfigTable({ configs, reason, isPending, isError, onCountChange, onRemove }) {
    const total = configs.reduce((sum, config) => sum + customStages.reduce((stageSum, stage) => stageSum + config.counts[stage], 0), 0);

    return <section className="custom-config" aria-labelledby="custom-config-title">
        <header><div><h2 id="custom-config-title">문항 구성 제안</h2><p>서버가 분석한 단계별 권장 문항 수입니다.</p></div><span>제안 조회 연동</span></header>
        {configs.length === 0 ? <p className={`custom-config__empty${isError ? ' custom-config__empty--error' : ''}`} role={isError ? 'alert' : 'status'}>{reason}</p> : <div className="custom-config__table-wrap"><table><thead><tr><th>취약 소분류</th>{customStages.map((stage) => <th key={stage}>{customStageStepLabels[stage]}</th>)}<th><span className="custom-sr-only">제외</span></th></tr></thead><tbody>{configs.map((config) => <tr key={config.conceptId}>
            <td><strong>{config.conceptLabel}</strong><span>현재 난이도 {config.adaptive.difficultyLabel}</span></td>
            {customStages.map((stage) => <td key={stage}><Stepper label={`${config.conceptLabel} ${customStageStepLabels[stage]}`} value={config.counts[stage]} max={config.maxCounts[stage]} disabled={isPending || isError || config.maxCounts[stage] === 0} onChange={(value) => onCountChange(config.conceptId, stage, value)} /></td>)}
            <td><button type="button" className="custom-config__remove" aria-label={`${config.conceptLabel} 제외`} onClick={() => onRemove(config.conceptId)}><i className="bi bi-x-lg" aria-hidden="true" /></button></td>
        </tr>)}</tbody></table></div>}
        <footer className="custom-config__footer">
            <p className="custom-config__integration-notice"><i className="bi bi-info-circle" aria-hidden="true" /> 문제 생성·배포는 후속 API 연동 후 사용할 수 있습니다.</p>
            <div className="custom-config__generate"><span>총 <strong>{total}</strong>문항</span><button type="button" disabled>문제 생성</button></div>
        </footer>
    </section>;
}

export default CustomConfigTable;
