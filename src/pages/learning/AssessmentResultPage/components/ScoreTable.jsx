import { questionResultLabels } from '../../../../mocks/labels';

const formatScore = (score) => score === null ? '—' : score;
const getAssessmentScoreTone = (score, maxScore) => {
    if (score === '—') return 'empty';
    if (score === 0) return 'zero';
    if (score === maxScore) return 'full';
    return 'partial';
};

const PracticeResultMark = ({ result }) => result === 'empty'
    ? <span aria-label={questionResultLabels[result]}>—</span>
    : <span className="score-table__result-dot" role="img" aria-label={questionResultLabels[result]} />;

function ScoreTable({ worksheet, onGradeStudent }) {
    const isPractice = worksheet.type === 'practice';
    const rows = worksheet.students.map((student) => {
        const answers = worksheet.questions.map((question) => student.answers.find((answer) => answer.no === question.no));
        const pending = !student.gradingComplete;
        const correctCount = answers.filter((answer) => answer?.result === 'correct').length;
        return {
            key: student.id,
            label: student.name,
            values: answers.map((answer) => isPractice
                ? answer?.result ?? 'empty'
                : formatScore(answer?.score ?? null)),
            summary: isPractice
                ? (pending ? '채점 대기' : `${correctCount}개`)
                : (pending ? '채점 대기' : `${student.totalScore}/${worksheet.maxTotalScore}`),
            pending,
        };
    });
    return (
        <section className="score-table" aria-label="평가 점수표">
            <div className="score-table__toolbar">
                <div><h3>학생별 결과</h3><p>{worksheet.questions.length}개 문항 · {isPractice ? '정오표시' : `총 ${worksheet.maxTotalScore}점`}</p></div>
            </div>
            <div className="score-table__scroll">
                <table style={{ '--score-table-questions-width': `${worksheet.questions.length * 44}px` }}>
                    <thead><tr><th className="score-table__student">학생</th>{worksheet.questions.map((question) => <th key={question.no} className="score-table__question">{question.no}</th>)}<th className="score-table__summary">{isPractice ? '정답 수' : '총점'}</th><th className="score-table__action">채점</th></tr></thead>
                    <tbody>
                        {rows.map((row) => <tr key={row.key}><th className="score-table__student">{row.label}</th>{row.values.map((value, columnIndex) => <td key={`${row.key}-${worksheet.questions[columnIndex].no}`} className={isPractice ? `score-table__mark score-table__mark--${value}` : `score-table__score score-table__score--${getAssessmentScoreTone(value, worksheet.questions[columnIndex].maxScore)}`}>{isPractice ? <PracticeResultMark result={value} /> : value}</td>)}<td className={`score-table__summary${row.pending ? ' score-table__summary--pending' : ''}`}>{row.summary}</td><td className="score-table__action"><button type="button" onClick={() => onGradeStudent(row.key)}>{row.pending ? '채점' : '확인'}</button></td></tr>)}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default ScoreTable;
