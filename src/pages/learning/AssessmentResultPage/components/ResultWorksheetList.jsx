import { getWorksheetTypeLabel } from '../../../../mocks/labels';

const statusLabels = { grading: '채점 대기', graded: '채점 완료', confirmed: '확정됨' };

const WorksheetButton = ({ worksheet, selectedId, onSelect, child = false }) => (
    <button
        type="button"
        className={`result-worksheet-list__item${child ? ' result-worksheet-list__item--child' : ''}${selectedId === worksheet.id ? ' result-worksheet-list__item--active' : ''}`}
        onClick={() => onSelect(worksheet.id)}
    >
        <span className="result-worksheet-list__meta">
            {child ? `${worksheet.sessionNumber}차 맞춤 학습` : `${worksheet.className} · ${getWorksheetTypeLabel(worksheet)}`}
        </span>
        <strong>{worksheet.title}</strong>
        <span className={`result-worksheet-list__status result-worksheet-list__status--${worksheet.status}`}>
            {statusLabels[worksheet.status] ?? worksheet.status}
        </span>
    </button>
);

function ResultWorksheetList({ worksheets, selectedId, onSelect, emptyMessage = '조건에 맞는 학습이 없습니다.' }) {
    const worksheetCount = worksheets.reduce((count, worksheet) => (
        count + 1 + (worksheet.customLearning?.students ?? []).reduce(
            (sessionCount, student) => sessionCount + (student.sessions?.length ?? 0),
            0,
        )
    ), 0);

    return (
        <aside className="result-worksheet-list" aria-label="학습 목록">
            <div className="result-worksheet-list__heading"><h2>학습 목록</h2><span>{worksheetCount}건</span></div>
            <div className="result-worksheet-list__items">
                {worksheets.map((worksheet) => (
                    <section key={worksheet.id} className="result-worksheet-list__group" aria-label={`${worksheet.title} 학습 결과`}>
                        <WorksheetButton worksheet={worksheet} selectedId={selectedId} onSelect={onSelect} />
                        {!!worksheet.customLearning?.students?.length && (
                            <div className="result-worksheet-list__custom">
                                {worksheet.customLearning.students.map((student) => (
                                    <div key={student.studentId} className="result-worksheet-list__student">
                                        <div className="result-worksheet-list__student-heading">
                                            <i className="bi bi-person" aria-hidden="true" />
                                            <strong>{student.displayNumber}번 {student.name}</strong>
                                            <span>{student.sessions.length}회차</span>
                                        </div>
                                        <div className="result-worksheet-list__sessions">
                                            {student.sessions.map((session) => (
                                                <WorksheetButton
                                                    key={session.id}
                                                    worksheet={session}
                                                    selectedId={selectedId}
                                                    onSelect={onSelect}
                                                    child
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                ))}
                {!worksheets.length && <p className="result-worksheet-list__empty">{emptyMessage}</p>}
            </div>
        </aside>
    );
}

export default ResultWorksheetList;
