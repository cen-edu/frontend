import { GradingStatus } from '../../../../api/analysis/analysisConstants.js';
import { formatAnalysisDuration, getItemAchievementResult } from '../analysisAdapters.js';

const views = [['score', '득점'], ['time', '시간']];

const getScoreState = (result, item) => {
    if (!result || result.gradingStatus === GradingStatus.NOT_GRADED) return 'pending';
    if (result.gradingStatus === GradingStatus.FAILED || result.score === null) return 'failed';
    if (result.score === item.maxScore) return 'full';
    if (result.score > 0) return 'partial';
    return 'zero';
};

const getScoreLabel = (result, item) => {
    if (!result || result.gradingStatus === GradingStatus.NOT_GRADED) return '미채점';
    if (result.gradingStatus === GradingStatus.FAILED) return '채점 실패';
    return result.score === null ? '-' : `${result.score}점 / ${item.maxScore}점`;
};

function QuestionMatrix({ achievement, view, onViewChange }) {
    const { items = [], students = [] } = achievement ?? {};

    return (
        <section className="diagnosis-card matrix-card">
            <div className="diagnosis-card__heading">
                <div><span>문항 비교</span><h2>문항별 성취</h2></div>
                <div className="matrix-view-switch">
                    <span>보기 전환</span>
                    <div className="diagnosis-tabs" role="group" aria-label="보기 전환">
                        {views.map(([value, label]) => <button key={value} type="button" className={view === value ? 'diagnosis-tabs__button diagnosis-tabs__button--active' : 'diagnosis-tabs__button'} aria-pressed={view === value} onClick={() => onViewChange(value)}>{label}</button>)}
                    </div>
                </div>
            </div>
            {items.length && students.length ? <div className="matrix-table__wrap">
                <table className="matrix-table matrix-table--questions" style={{ '--question-count': items.length }}>
                    <thead><tr><th>학생</th>{items.map((item) => <th key={item.worksheetItemId}>{item.itemNumber}번<small>{item.maxScore}점</small></th>)}</tr></thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student.studentId}>
                                <th>{student.studentName}</th>
                                {items.map((item) => {
                                    const result = getItemAchievementResult(student, item.worksheetItemId);
                                    const scoreLabel = getScoreLabel(result, item);
                                    const durationLabel = formatAnalysisDuration(result?.solvingDurationMs);
                                    return (
                                        <td key={item.worksheetItemId}>
                                            <span
                                                className={`question-cell question-cell--${view === 'score' ? getScoreState(result, item) : 'time'}`}
                                                style={view === 'time' && result?.solvingDurationMs != null ? { '--time-opacity': Math.min(.82, .14 + result.solvingDurationMs / 360000) } : undefined}
                                                aria-label={`${student.studentName} ${item.itemNumber}번 ${view === 'score' ? scoreLabel : durationLabel}`}
                                            >{view === 'score' ? scoreLabel : durationLabel}</span>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div> : <p className="question-matrix__empty">표시할 학생별 문항 성취 데이터가 없습니다.</p>}
        </section>
    );
}

export default QuestionMatrix;
