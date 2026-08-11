import { useState } from 'react';
import { Link } from 'react-router-dom';
import { customStageStepLabels, customStages } from '../../../../mocks/customCreation';
import { getConceptRate, getCustomSessionSummary, getStudentCustomSessions, prescriptionLabels } from '../../../../mocks/weaknessAnalysis';

function CustomLearningResult({ worksheet, student }) {
    const sessions = getStudentCustomSessions(worksheet, student);
    const [sessionId, setSessionId] = useState(sessions[sessions.length - 1]?.id ?? null);
    const session = sessions.find((item) => item.id === sessionId) ?? sessions[sessions.length - 1];

    if (!session) {
        if (student.status === 'stable' || student.status === 'insufficient') return null;
        return <section className="diagnosis-card custom-learning">
            <div className="diagnosis-card__heading"><div><span>맞춤 학습 후속 확인</span><h2>맞춤 학습 결과</h2></div></div>
            <p className="custom-learning__empty">아직 배정된 맞춤 학습이 없습니다. <Link to={`/problems/custom?worksheet=${worksheet.id}&students=${student.id}`}>맞춤 문제 만들기</Link></p>
        </section>;
    }

    const summary = getCustomSessionSummary(session);
    const conceptLabel = worksheet.concepts.find((concept) => concept.id === session.conceptId)?.label ?? session.conceptId;
    const before = getConceptRate(worksheet, student, session.conceptId);

    return (
        <section className="diagnosis-card custom-learning">
            <div className="diagnosis-card__heading">
                <div><span>맞춤 학습 후속 확인</span><h2>맞춤 학습 결과</h2></div>
                <small>{conceptLabel} · 총 {sessions.length}회차</small>
            </div>
            {sessions.length > 1 && <div className="diagnosis-tabs custom-learning__rounds">
                {sessions.map((item, order) => <button type="button" key={item.id} className={item.id === session.id ? 'diagnosis-tabs__button diagnosis-tabs__button--active' : 'diagnosis-tabs__button'} onClick={() => setSessionId(item.id)}>{order + 1}회차 {item.assignedAt}</button>)}
            </div>}
            <div className="custom-learning__summary">
                <span className={`status-badge status-badge--${summary.status}`}>{prescriptionLabels[summary.status]}</span>
                <dl>
                    <div><dt>배정일</dt><dd>{session.assignedAt}</dd></div>
                    <div><dt>완료일</dt><dd>{session.completedAt ?? '진행 중'}</dd></div>
                    <div><dt>풀이</dt><dd>{summary.solvedCount}/{summary.totalCount}문항</dd></div>
                    <div><dt>정답률</dt><dd>{summary.rate}%</dd></div>
                </dl>
            </div>
            <div className="custom-learning__compare">
                <strong>{conceptLabel} 정답률 변화</strong>
                <div className="custom-learning__bars">
                    <div><span>원 학습지</span><em><i style={{ width: `${before.rate}%` }} /></em><b>{before.rate}%</b></div>
                    <div className="custom-learning__bar--after"><span>맞춤 학습</span><em><i style={{ width: `${summary.rate}%` }} /></em><b>{summary.rate}%</b></div>
                </div>
                <small>원 학습지는 {before.count}개 응답 단계, 맞춤 학습은 {summary.solvedCount}문항 기준입니다.</small>
            </div>
            <ul className="custom-learning__stages">
                {customStages.map((stage) => {
                    const item = summary.stages.find((value) => value.stage === stage);
                    return <li key={stage} className={stage === 'independent' ? 'custom-learning__stage custom-learning__stage--key' : 'custom-learning__stage'}>
                        <span>{customStageStepLabels[stage]}</span>
                        <strong>{item.total ? `${item.correct}/${item.total}` : '—'}</strong>
                        <small>{item.solved < item.total ? `미풀이 ${item.total - item.solved}문항` : `${item.total}문항 중 정답`}</small>
                    </li>;
                })}
            </ul>
            <p className="custom-learning__note">
                {summary.status === 'resolved' && '응용 단계까지 모두 해결해 취약 개념이 해소된 것으로 봅니다.'}
                {summary.status === 'unresolved' && '응용 단계에서 오답이 남아 있어 같은 개념의 재처방이 필요합니다.'}
                {summary.status === 'pending' && '아직 풀지 않은 문항이 있어 해소 여부를 판단하지 않았습니다.'}
                {summary.status === 'unresolved' && <Link to={`/problems/custom?worksheet=${worksheet.id}&students=${student.id}&concept=${session.conceptId}`}>새 문제 재처방</Link>}
            </p>
        </section>
    );
}

export default CustomLearningResult;
