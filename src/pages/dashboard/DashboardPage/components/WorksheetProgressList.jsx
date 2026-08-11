import { useNavigate } from 'react-router-dom';
import { worksheetTypeLabels } from '../../../../mocks/teacherDashboard';

function WorksheetProgressList({ worksheets }) {
    const navigate = useNavigate();

    const moveToAction = (worksheet) => {
        if (worksheet.type === 'assessment' && worksheet.resultStatus !== 'confirmed') {
            const params = new URLSearchParams();
            params.set('worksheet', worksheet.resultId ?? worksheet.id);
            navigate(`/learning/results?${params}`);
            return;
        }
        navigate(`/learning/weaknesses?worksheet=${worksheet.analysisId}`);
    };

    return (
        <section className="dashboard-section" aria-labelledby="worksheet-progress-title">
            <div className="dashboard-section__header">
                <div>
                    <h2 id="worksheet-progress-title">학습지별 현황</h2>
                    {worksheets.length > 0 && <p>배정 순서대로 정렬했고 맞춤 학습은 원본 학습지 아래에 묶었습니다. 앞의 번호는 학생별 학습 현황의 결과 칸 순서와 같습니다.</p>}
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
                                        {worksheet.childCount > 0 && <span className="worksheet-list__custom-count">맞춤 {worksheet.childCount}</span>}
                                    </div>
                                </div>
                            </div>

                            <span className="worksheet-list__period">{worksheet.assignedAt} ~ {worksheet.dueAt}</span>
                            <span className={`worksheet-list__status worksheet-list__status--${worksheet.status}`}>
                                {worksheet.status === 'ongoing' ? '진행 중' : '마감'}
                            </span>
                            <span className="worksheet-list__submission">{worksheet.submittedCount}/{worksheet.assignedCount}명</span>

                            <div className="worksheet-list__metric">
                                {worksheet.type === 'assessment'
                                    ? <><strong>{worksheet.score === null ? '-' : `${worksheet.score}점`}</strong><span>평균 점수</span></>
                                    : <><strong>{worksheet.accuracy === null ? '-' : `${worksheet.accuracy}%`}</strong><span>평균 정답률</span></>}
                            </div>

                            <div className="worksheet-list__action">
                                <button
                                    type="button"
                                    className={worksheet.type === 'assessment' && worksheet.resultStatus !== 'confirmed' ? 'worksheet-list__action-button worksheet-list__action-button--grading' : 'worksheet-list__action-button'}
                                    onClick={() => moveToAction(worksheet)}
                                >
                                    {worksheet.type === 'assessment' && worksheet.resultStatus !== 'confirmed' ? '채점하기' : '분석 보기'}
                                </button>
                            </div>
                        </li>
                    ))}
                </ol>}
        </section>
    );
}

export default WorksheetProgressList;
