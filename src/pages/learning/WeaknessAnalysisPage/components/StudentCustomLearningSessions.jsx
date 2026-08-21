import { useState } from 'react';
import {
    CustomResolutionStatus,
    CustomStage,
} from '../../../../api/analysis/analysisConstants.js';
import { difficultyBandLabels } from '../analysisAdapters.js';

const resolutionStatusView = {
    [CustomResolutionStatus.IN_PROGRESS]: { label: '진행 중', tone: 'review' },
    [CustomResolutionStatus.RESOLVED]: { label: '해소', tone: 'stable' },
    [CustomResolutionStatus.UNRESOLVED]: { label: '미해소', tone: 'priority' },
};

const stageLabels = {
    [CustomStage.REVIEW]: '① 복습',
    [CustomStage.SIMILAR]: '② 유사',
    [CustomStage.ADVANCED]: '③ 응용',
};

const formatRate = (value) => value == null ? '-' : `${Math.round(value * 10) / 10}%`;

const formatDate = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';
    return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(date);
};

function StudentCustomLearningSessions({ query }) {
    const sessions = query.data?.sessions ?? [];
    const [selectedSessionId, setSelectedSessionId] = useState(null);
    // 서버는 배정 순(오래된 순)으로 준다. 교사가 먼저 볼 것은 가장 최근 회차라 끝을 기본으로 둔다.
    const session = sessions.find(({ customAssignmentId }) => String(customAssignmentId) === selectedSessionId)
        ?? sessions[sessions.length - 1];

    if (query.isPending) return <div className="student-analysis-view__section-state">맞춤 학습 회차를 불러오는 중입니다.</div>;
    if (query.isError) return <div className="student-analysis-view__section-state" role="alert">{query.error?.message || '맞춤 학습 회차를 불러오지 못했습니다.'}</div>;

    return <section className="diagnosis-card custom-learning custom-learning--api">
        <div className="diagnosis-card__heading">
            <div><span>맞춤 학습 후속 확인</span><h2>맞춤 학습 결과</h2></div>
            {!!sessions.length && <small>총 {sessions.length}회차</small>}
        </div>
        {!session
            ? <p className="custom-learning__empty">맞춤 학습 이력이 없습니다.</p>
            : <>
                {sessions.length > 1 && <div className="diagnosis-tabs custom-learning__rounds" role="group" aria-label="맞춤 학습 회차 선택">
                    {/* 차수는 서버가 sessionNumber 로 정한다. 배열 위치로 계산하면 정렬이 바뀔 때
                        1차와 2차가 뒤바뀌어 붙는다. */}
                    {sessions.map((item) => {
                        const id = String(item.customAssignmentId);
                        return <button
                            type="button"
                            key={id}
                            className={item === session ? 'diagnosis-tabs__button diagnosis-tabs__button--active' : 'diagnosis-tabs__button'}
                            aria-pressed={item === session}
                            onClick={() => setSelectedSessionId(id)}
                        >{item.sessionNumber}회차 · {formatDate(item.assignedAt)}</button>;
                    })}
                </div>}
                <div className="custom-learning__summary">
                    <span className={`status-badge status-badge--${resolutionStatusView[session.overallResolutionStatus]?.tone ?? 'insufficient'}`}>{resolutionStatusView[session.overallResolutionStatus]?.label ?? session.overallResolutionStatus}</span>
                    <dl>
                        <div><dt>배정일</dt><dd>{formatDate(session.assignedAt)}</dd></div>
                        <div><dt>완료일</dt><dd>{session.completedAt ? formatDate(session.completedAt) : '진행 중'}</dd></div>
                        <div><dt>풀이</dt><dd>{session.completedItemCount}/{session.totalItemCount}문항</dd></div>
                        <div><dt>정답률</dt><dd>{formatRate(session.accuracyRate)}</dd></div>
                    </dl>
                </div>
                {session.subcategories?.length
                    ? <div className="custom-learning__subcategories">{session.subcategories.map((subcategory) => {
                        const status = resolutionStatusView[subcategory.resolutionStatus];
                        return <article key={subcategory.subcategoryId} className="custom-learning__subcategory">
                            <header>
                                <div><strong>{subcategory.subcategoryName}</strong><small>{difficultyBandLabels[subcategory.currentDifficultyBand] ?? '난이도 미정'}</small></div>
                                <span className={`status-badge status-badge--${status?.tone ?? 'insufficient'}`}>{status?.label ?? subcategory.resolutionStatus}</span>
                            </header>
                            <div className="custom-learning__compare">
                                <strong>정답률 변화</strong>
                                <div className="custom-learning__bars">
                                    <div><span>원 학습지</span><em><i style={{ width: `${subcategory.sourceAccuracyRate ?? 0}%` }} /></em><b>{formatRate(subcategory.sourceAccuracyRate)}</b></div>
                                    <div className="custom-learning__bar--after"><span>맞춤 학습</span><em><i style={{ width: `${subcategory.accuracyRate ?? 0}%` }} /></em><b>{formatRate(subcategory.accuracyRate)}</b></div>
                                </div>
                                <small>맞춤 학습 {subcategory.completedItemCount}/{subcategory.totalItemCount}문항 완료</small>
                            </div>
                            <ul className="custom-learning__stages">
                                {(subcategory.stages ?? []).map((stage) => <li key={stage.stage} className={stage.stage === CustomStage.ADVANCED ? 'custom-learning__stage custom-learning__stage--key' : 'custom-learning__stage'}>
                                    <span>{stageLabels[stage.stage] ?? stage.stage}</span>
                                    <strong>{stage.totalCount ? `${stage.correctCount}/${stage.totalCount}` : '—'}</strong>
                                    <small>{stage.totalCount ? `${stage.totalCount}문항 중 정답` : '진행 전'}</small>
                                </li>)}
                            </ul>
                        </article>;
                    })}</div>
                    : <p className="student-analysis-view__empty">이 회차의 소분류 결과가 없습니다.</p>}
            </>}
    </section>;
}

export default StudentCustomLearningSessions;
