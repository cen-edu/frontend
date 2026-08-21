import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { customLearningLabel, worksheetTypeLabels } from '../../../../mocks/labels';

// 맞춤이 이보다 많으면 기본으로 접는다. 0 이면 한 건이라도 접는다.
//
// 대시보드는 요약이다. 맞춤은 학생마다 나가는 보강이라 한 건일 때와 스물다섯 건일 때
// 목록 모양이 달라지면 읽는 방식도 달라진다. 항상 같은 자리에 한 줄로 접어 두고,
// 필요할 때만 펼치게 한다.
const COLLAPSE_THRESHOLD = 0;

function WorksheetProgressList({ worksheets }) {
    const navigate = useNavigate();
    const [expandedParents, setExpandedParents] = useState(() => new Set());

    const moveToAction = (worksheet) => {
        navigate(`/learning/weaknesses?worksheet=${worksheet.analysisId}`);
    };

    const toggleParent = (parentId) => {
        setExpandedParents((previous) => {
            const next = new Set(previous);
            if (next.has(parentId)) next.delete(parentId);
            else next.add(parentId);
            return next;
        });
    };

    // 접힌 원본의 자식은 목록에서 뺀다. 접었을 때는 아무 줄도 남기지 않는다 —
    // 요약 줄을 두면 접은 의미가 옅어지고, 필요한 수치는 펼쳐서 보면 된다.
    const visibleRows = useMemo(() => {
        const collapsedParents = new Set(
            worksheets
                .filter((worksheet) => worksheet.depth === 0
                    && worksheet.childCount > COLLAPSE_THRESHOLD
                    && !expandedParents.has(worksheet.id))
                .map((worksheet) => worksheet.orderLabel),
        );

        return worksheets.filter((worksheet) => (
            worksheet.depth === 0
            || ![...collapsedParents].some(
                (parentLabel) => worksheet.orderLabel.startsWith(`${parentLabel}-`),
            )
        ));
    }, [worksheets, expandedParents]);

    return (
        <section className="dashboard-section" aria-labelledby="worksheet-progress-title">
            <div className="dashboard-section__header">
                <div>
                    <h2 id="worksheet-progress-title">학습지별 현황</h2>
                    {worksheets.length > 0 && <p>배정 순서대로 정렬하고, 맞춤 학습은 파생된 원본 학습지 아래에 붙였습니다.</p>}
                </div>
            </div>

            {worksheets.length === 0
                ? <p className="dashboard-empty">이번 학기에 배정한 학습지가 없습니다.</p>
                : <ol className="worksheet-list">
                    <li className="worksheet-list__header" aria-hidden="true">
                        <span>학습지</span>
                        <span>학습 기간</span>
                        <span>상태</span>
                        <span>제출</span>
                        <span>학습 결과</span>
                        <span>동작</span>
                    </li>
                    {visibleRows.map((worksheet) => (
                        <li key={worksheet.id} className={`worksheet-list__item${worksheet.depth > 0 ? ' worksheet-list__item--child' : ''}`}>
                            <div className="worksheet-list__content">
                                <span className="worksheet-list__order">{worksheet.orderLabel}</span>
                                <div className="worksheet-list__title-block">
                                    <div className="worksheet-list__title">
                                        <strong>{worksheet.title}</strong>
                                        {/* 유형(일반/평가)과 출처(원본/맞춤)는 다른 축이라 둘 다 그리면
                                            "일반 학습 · 맞춤 2차" 처럼 겹쳐 읽힌다. 맞춤이면 출처만 보인다. */}
                                        {worksheet.origin === 'custom'
                                            ? (
                                                <span className="worksheet-list__type worksheet-list__type--custom">
                                                    {customLearningLabel}{worksheet.sessionLabel ? ` ${worksheet.sessionLabel}` : ''}
                                                </span>
                                            )
                                            : <span className={`worksheet-list__type worksheet-list__type--${worksheet.type}`}>{worksheetTypeLabels[worksheet.type]}</span>}
                                        {worksheet.sourceInformationMissing && <span className="worksheet-list__missing">정보 부족</span>}
                                        {worksheet.childCount > 0 && <span className="worksheet-list__custom-count">맞춤 {worksheet.childCount}</span>}
                                        {worksheet.childCount > COLLAPSE_THRESHOLD && (
                                            <button type="button" className="worksheet-list__collapse" onClick={() => toggleParent(worksheet.id)}>
                                                {expandedParents.has(worksheet.id) ? '접기' : '펼치기'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <span className="worksheet-list__period">{worksheet.assignedAt} ~ {worksheet.dueAt}</span>
                            <span className={`worksheet-list__status worksheet-list__status--${worksheet.status}`}>
                                {worksheet.status === 'ongoing' ? '진행 중' : worksheet.status === 'overdue' ? '기한 초과' : '완료'}
                            </span>
                            <span className="worksheet-list__submission">{worksheet.submittedCount}/{worksheet.assignedCount}명</span>

                            <div className="worksheet-list__metric">
                                {worksheet.type === 'assessment'
                                    ? <><strong>{worksheet.score === null ? '-' : `${worksheet.score}점`}</strong><span>평균 점수</span></>
                                    : <><strong>{worksheet.accuracy === null ? '-' : `${worksheet.accuracy}%`}</strong><span>평균 정답률</span></>}
                            </div>

                            <div className="worksheet-list__action">
                                <button type="button" className="worksheet-list__action-button" onClick={() => moveToAction(worksheet)}>분석 보기</button>
                            </div>
                        </li>
                    ))}
                </ol>}
        </section>
    );
}

export default WorksheetProgressList;
