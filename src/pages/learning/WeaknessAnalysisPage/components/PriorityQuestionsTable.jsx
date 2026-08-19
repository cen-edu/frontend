import { MathText } from '../../../../components/common/worksheets';
import { difficultyBandLabels, evaluationAreaLabels } from '../analysisAdapters.js';

const formatRate = (value) => value === null ? '-' : `${Math.round(value * 10) / 10}%`;

function PriorityQuestionsTable({ items, showEvaluationArea = true }) {
    return (
        <section className="diagnosis-card priority-questions">
            <div className="diagnosis-card__heading"><div><span>완전 정답률 낮은 순</span><h2>우선 확인 문항</h2></div><small>최대 5문항</small></div>
            <div className="priority-questions__wrap"><table>
                <thead><tr><th>문항</th>{showEvaluationArea && <th>영역</th>}<th>난이도</th><th>정답 수</th><th>학급 정답률</th></tr></thead>
                <tbody>{items.map((item) => <tr key={item.worksheetItemId}>
                    <td><strong>{item.itemNumber}번</strong> <MathText>{item.questionTitle}</MathText></td>
                    {showEvaluationArea && <td>{item.evaluationArea ? evaluationAreaLabels[item.evaluationArea] ?? item.evaluationArea : '-'}</td>}
                    <td>{difficultyBandLabels[item.difficultyBand] ?? item.difficultyBand}</td>
                    <td>{item.correctStudentCount}/{item.gradedStudentCount}명</td>
                    <td><b className={item.accuracyRate !== null && item.accuracyRate < 60 ? 'score-rate score-rate--low' : 'score-rate'}>{formatRate(item.accuracyRate)}</b></td>
                </tr>)}</tbody>
            </table></div>
            {!items.length && <p className="priority-questions__empty">우선 확인할 문항이 없습니다.</p>}
        </section>
    );
}

export default PriorityQuestionsTable;
