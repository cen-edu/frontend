import {
    diagnosticStageLabels,
    evaluationAreaLabels,
} from '../customProposalAdapters.js';

function WeaknessSummaryCard({ student, configs, reason, isError }) {
    return <section className="weakness-summary" aria-labelledby="weakness-summary-title">
        <header><div><h2 id="weakness-summary-title">{student?.name ?? '학생'} 학생의 제안 근거</h2><p>분석 결과와 적응형 출제 기준을 확인합니다.</p></div><span>{configs.length}개 소분류</span></header>
        {configs.length === 0 ? <p className={`weakness-summary__empty${isError ? ' weakness-summary__empty--error' : ''}`} role={isError ? 'alert' : 'status'}>{reason}</p> : <div className="weakness-summary__items">{configs.map((config) => <article key={config.conceptId}>
            <div><strong>{config.conceptLabel}</strong><span>{config.guidance.status || '제안 상태 정보가 없습니다.'}</span></div>
            <dl>
                <div><dt>출제 계획</dt><dd>{config.guidance.plan || '-'}</dd></div>
                <div><dt>취약 근거</dt><dd>{config.guidance.weakness || '-'}</dd></div>
                <div><dt>현재 난이도</dt><dd>{config.adaptive.difficultyLabel}</dd></div>
                {config.advanced.triggered && <>
                    <div><dt>주요 영역</dt><dd>{evaluationAreaLabels[config.advanced.primaryEvaluationArea] ?? config.advanced.primaryEvaluationArea ?? '-'}</dd></div>
                    <div><dt>취약 단계</dt><dd>{diagnosticStageLabels[config.advanced.primaryTargetStage] ?? config.advanced.primaryTargetStage ?? '-'}</dd></div>
                </>}
            </dl>
        </article>)}</div>}
    </section>;
}

export default WeaknessSummaryCard;
