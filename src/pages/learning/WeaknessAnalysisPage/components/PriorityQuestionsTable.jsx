import { areaLabels, difficultyLabels, getQuestionAccuracy } from '../../../../mocks/weaknessAnalysis';

function PriorityQuestionsTable({ worksheet, onSelect }) {
    const rows = worksheet.questions.map((question) => ({ question, ...getQuestionAccuracy(worksheet, question.no) })).sort((a, b) => a.rate - b.rate);
    return (
        <section className="diagnosis-card priority-questions">
            <div className="diagnosis-card__heading"><div><span>학급 정답률 낮은 순</span><h2>먼저 확인할 문항</h2></div><small>자료 부족 학생 제외</small></div>
            <div className="priority-questions__wrap"><table>
                <thead><tr><th>문항</th><th>영역</th><th>난이도</th><th>정답 수</th><th>학급 정답률</th></tr></thead>
                <tbody>{rows.map(({ question, correct, total, rate }) => <tr key={question.no} tabIndex={0} onClick={() => onSelect({ type: 'question', questionNo: question.no })} onKeyDown={(event) => { if (event.key === 'Enter') onSelect({ type: 'question', questionNo: question.no }); }}>
                    <td><strong>{question.no}번</strong> {question.prompt}</td><td>{areaLabels[question.area]}</td><td>{difficultyLabels[question.difficulty]}</td><td>{correct}/{total}명</td><td><b className={rate < 60 ? 'score-rate score-rate--low' : 'score-rate'}>{rate}%</b></td>
                </tr>)}</tbody>
            </table></div>
        </section>
    );
}

export default PriorityQuestionsTable;
