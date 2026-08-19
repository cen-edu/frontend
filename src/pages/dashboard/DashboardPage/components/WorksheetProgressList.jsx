import { useNavigate } from 'react-router-dom';
import { worksheetTypeLabels } from '../../../../mocks/labels';

function WorksheetProgressList({ worksheets }) {
    const navigate = useNavigate();

    const moveToAction = (worksheet) => {
        navigate(`/learning/weaknesses?worksheet=${worksheet.analysisId}`);
    };

    return (
        <section className="dashboard-section" aria-labelledby="worksheet-progress-title">
            <div className="dashboard-section__header">
                <div>
                    <h2 id="worksheet-progress-title">학습지별 현황</h2>
                    {worksheets.length > 0 && <p>배정 순서대로 정렬했습니다. API에서 제공하지 않는 맞춤 학습 연결 정보와 종합평가 결과 상태는 정보 부족으로 표시합니다.</p>}
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
                    {worksheets.map((worksheet) => (
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
                                {worksheet.resultInformationMissing
                                    ? <button type="button" className="worksheet-list__action-button worksheet-list__action-button--missing" disabled title="종합평가 결과 상태 정보가 API 응답에 없습니다.">정보 부족</button>
                                    : <button type="button" className="worksheet-list__action-button" onClick={() => moveToAction(worksheet)}>분석 보기</button>}
                            </div>
                        </li>
                    ))}
                </ol>}
        </section>
    );
}

export default WorksheetProgressList;
