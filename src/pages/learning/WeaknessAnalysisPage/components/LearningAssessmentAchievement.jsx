import { getAchievementRate, getSubcategoryResult } from '../analysisAdapters.js';

const formatRate = (value) => value === null ? '미채점' : `${Math.round(value * 10) / 10}%`;

function LearningAssessmentAchievement({ achievement }) {
    const { subcategories = [], students = [], subcategoryRanking = [] } = achievement ?? {};
    const hasManySubcategories = subcategories.length > 6;

    return (
        <div className="weakness-page__analysis-grid learning-assessment-achievement">
            <section className="diagnosis-card matrix-card">
                <div className="diagnosis-card__heading">
                    <div>
                        <span>SUBCATEGORY ACHIEVEMENT</span>
                        <h2>소분류별 성취</h2>
                        {hasManySubcategories && <small className="matrix-card__description">{subcategories.length}개 소분류 · 표를 좌우로 이동해 확인하세요.</small>}
                    </div>
                </div>
                {subcategories.length && students.length
                    ? <div className="matrix-table__wrap" tabIndex={hasManySubcategories ? 0 : undefined} aria-label={hasManySubcategories ? `${subcategories.length}개 소분류별 성취표, 좌우로 스크롤 가능` : undefined}>
                        <table className="matrix-table matrix-table--concepts" style={{ '--concept-count': subcategories.length }}>
                            <thead><tr><th>학생</th>{subcategories.map((subcategory) => <th key={subcategory.subcategoryId}>{subcategory.subcategoryName}</th>)}</tr></thead>
                            <tbody>{students.map((student) => <tr key={student.studentId}>
                                <th>{student.studentName}</th>
                                {subcategories.map((subcategory) => {
                                    const result = getSubcategoryResult(student, subcategory.subcategoryId);
                                    const rate = getAchievementRate(result);
                                    const state = rate === null ? 'empty' : rate < 50 ? 'weak' : rate < 100 ? 'partial' : 'full';
                                    return <td key={subcategory.subcategoryId}><span className={`matrix-cell matrix-cell--${state}`}><strong>{formatRate(rate)}</strong>{rate !== null && <small>{result.correctCount}/{result.gradedCount}</small>}</span></td>;
                                })}
                            </tr>)}</tbody>
                        </table>
                    </div>
                    : <p className="learning-assessment-achievement__empty">표시할 소분류별 성취 데이터가 없습니다.</p>}
            </section>
            <aside className="diagnosis-card detail-panel">
                <span className="detail-panel__kicker">취약 순위</span>
                <h2>소분류별 취약 인원</h2>
                <p>취약 학생 수가 많은 순서입니다.</p>
                {subcategoryRanking.length
                    ? <ol className="concept-bars">{subcategoryRanking.map((subcategory, index) => {
                        const share = students.length ? Math.round((subcategory.weakStudentCount / students.length) * 100) : 0;
                        const level = share >= 50 ? 'high' : share >= 25 ? 'mid' : 'low';
                        return <li key={subcategory.subcategoryId}><div className="concept-bars__row" aria-label={`${subcategory.subcategoryName} 취약 ${subcategory.weakStudentCount}명`}>
                            <span className="concept-bars__rank">{index + 1}</span>
                            <strong className="concept-bars__label">{subcategory.subcategoryName}</strong>
                            <span className="concept-bars__value">{subcategory.weakStudentCount}명</span>
                            <span className={`concept-bars__track concept-bars__track--${level}`}><i style={{ width: `${share}%` }} /></span>
                        </div></li>;
                    })}</ol>
                    : <p className="learning-assessment-achievement__empty">취약 소분류 데이터가 없습니다.</p>}
            </aside>
        </div>
    );
}

export default LearningAssessmentAchievement;
