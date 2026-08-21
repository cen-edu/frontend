import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { worksheetTypeLabels } from '../../../../mocks/labels';

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

    // 접힌 원본의 자식은 빼고, 그 자리에 요약 한 줄을 넣는다.
    const visibleRows = useMemo(() => {
        const rows = [];
        let currentParent = null;

        worksheets.forEach((worksheet) => {
            if (worksheet.depth > 0) {
                const collapsed = currentParent
                    && currentParent.childCount > COLLAPSE_THRESHOLD
                    && !expandedParents.has(currentParent.id);
                if (!collapsed) rows.push(worksheet);
                return;
            }

            currentParent = worksheet;
            rows.push(worksheet);
            if (worksheet.childCount > COLLAPSE_THRESHOLD && !expandedParents.has(worksheet.id)) {
                const children = worksheets.filter((row) => (
                    row.depth > 0 && row.orderLabel.startsWith(`${worksheet.orderLabel}-`)
                ));
                const done = children.filter((row) => row.status === 'completed').length;

                // 배정마다 학생 수가 다르다. 한 명짜리 개별 배정과 스물다섯 명짜리 반 배정을
                // 같은 무게로 평균내면 실제 학생들의 성취와 어긋난다. 배정 인원으로 가중한다.
                const weighted = children
                    .filter((row) => row.accuracy !== null && row.accuracy !== undefined)
                    .map((row) => ({ accuracy: row.accuracy, weight: row.assignedCount || 1 }));
                const totalWeight = weighted.reduce((sum, row) => sum + row.weight, 0);
                const average = totalWeight === 0
                    ? null
                    : Math.round((weighted.reduce(
                        (sum, row) => sum + (row.accuracy * row.weight), 0,
                    ) / totalWeight) * 10) / 10;

                rows.push({
                    id: `${worksheet.id}-summary`,
                    isCustomSummary: true,
                    parentId: worksheet.id,
                    childCount: worksheet.childCount,
                    doneCount: done,
                    average,
                });
            }
        });

        return rows;
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
                    {visibleRows.map((worksheet) => (worksheet.isCustomSummary
                        ? (
                            <li key={worksheet.id} className="worksheet-list__item worksheet-list__item--child worksheet-list__item--summary">
                                <div className="worksheet-list__content">
                                    <span className="worksheet-list__order" aria-hidden="true">└</span>
                                    <div className="worksheet-list__title-block">
                                        <div className="worksheet-list__title">
                                            <strong>맞춤 학습 {worksheet.childCount}건</strong>
                                            <span className="worksheet-list__summary-detail">학생별 보강</span>
                                        </div>
                                    </div>
                                </div>
                                <span className="worksheet-list__period" aria-hidden="true">—</span>
                                <span className="worksheet-list__status" aria-hidden="true" />
                                <span className="worksheet-list__submission">{worksheet.doneCount}/{worksheet.childCount}건</span>
                                <div className="worksheet-list__metric">
                                    <strong>{worksheet.average === null ? '-' : `${worksheet.average}%`}</strong>
                                    <span>평균 정답률</span>
                                </div>
                                <div className="worksheet-list__action">
                                    <button type="button" className="worksheet-list__action-button" onClick={() => toggleParent(worksheet.parentId)}>펼치기</button>
                                </div>
                            </li>
                        )
                        : (
                        <li key={worksheet.id} className={`worksheet-list__item${worksheet.depth > 0 ? ' worksheet-list__item--child' : ''}`}>
                            <div className="worksheet-list__content">
                                <span className="worksheet-list__order">{worksheet.orderLabel}</span>
                                <div className="worksheet-list__title-block">
                                    <div className="worksheet-list__title">
                                        <strong>{worksheet.title}</strong>
                                        <span className={`worksheet-list__type worksheet-list__type--${worksheet.type}`}>{worksheetTypeLabels[worksheet.type]}</span>
                                        {worksheet.origin === 'custom' && <span className="worksheet-list__type worksheet-list__type--custom">맞춤</span>}
                                        {worksheet.sourceInformationMissing && <span className="worksheet-list__missing">정보 부족</span>}
                                        {worksheet.childCount > 0 && <span className="worksheet-list__custom-count">맞춤 {worksheet.childCount}</span>}
                                        {worksheet.childCount > COLLAPSE_THRESHOLD && expandedParents.has(worksheet.id)
                                            && <button type="button" className="worksheet-list__collapse" onClick={() => toggleParent(worksheet.id)}>접기</button>}
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
                        )))}
                </ol>}
        </section>
    );
}

export default WorksheetProgressList;
