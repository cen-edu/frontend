import { getWorksheetMetrics } from '../../../mocks/assessmentResult';

const formatScore = (score) => score === null ? '—' : score;
const isCorrectAnswer = (answer, question) => answer.isCorrect ?? (typeof answer.score === 'number' && typeof question.maxScore === 'number' && answer.score === question.maxScore);
const getPracticeResult = (answer, question) => {
    if (!answer) return 'empty';
    if (answer.result === 'partial') return 'partial';
    return isCorrectAnswer(answer, question) ? 'correct' : 'wrong';
};
const practiceResultLabels = { correct: 'O', partial: '△', wrong: 'X', empty: '—' };

const PracticeResultMark = ({ result }) => result === 'partial'
    ? <i className="bi bi-triangle" role="img" aria-label="부분 정답" />
    : practiceResultLabels[result];

function ScoreTable({ worksheet, onGradeStudent }) {
    const metrics = getWorksheetMetrics(worksheet);
    const isPractice = worksheet.type === 'practice';
    const rows = worksheet.students.map((student, index) => {
        const answers = worksheet.questions.map((question) => student.answers.find((answer) => answer.no === question.no));
        const pending = !isPractice && answers.some((answer) => answer?.score === null);
        const correctCount = answers.filter((answer, answerIndex) => answer && isCorrectAnswer(answer, worksheet.questions[answerIndex])).length;
        return {
            key: student.id,
            number: student.number,
            label: student.name,
            values: answers.map((answer, answerIndex) => isPractice ? getPracticeResult(answer, worksheet.questions[answerIndex]) : formatScore(answer?.score ?? null)),
            summary: isPractice ? `${correctCount}개` : (pending ? '채점 대기' : `${metrics.totals[index]}/${metrics.maxTotal}`),
            pending,
        };
    });
    return (
        <section className="score-table" aria-label="평가 점수표">
            <div className="score-table__toolbar">
                <div><h3>학생별 결과</h3><p>{worksheet.questions.length}개 문항 · {isPractice ? '정오표시' : `총 ${metrics.maxTotal}점`}</p></div>
            </div>
            <div className="score-table__scroll">
                <table>
                    <thead><tr><th className="score-table__student">학생</th>{worksheet.questions.map((question) => <th key={question.no} className="score-table__question">{question.no}</th>)}<th className="score-table__summary">{isPractice ? '정답 수' : '총점'}</th><th className="score-table__action">채점</th></tr></thead>
                    <tbody>
                        {rows.map((row) => <tr key={row.key}><th className="score-table__student"><span>{row.number}번</span>{row.label}</th>{row.values.map((value, columnIndex) => <td key={`${row.key}-${worksheet.questions[columnIndex].no}`} className={isPractice ? `score-table__mark score-table__mark--${value}` : ''}>{isPractice ? <PracticeResultMark result={value} /> : value}</td>)}<td className={`score-table__summary${row.pending ? ' score-table__summary--pending' : ''}`}>{row.summary}</td><td className="score-table__action"><button type="button" disabled={isPractice} onClick={() => onGradeStudent(row.key)}>{isPractice || row.pending ? '채점' : '확인'}</button></td></tr>)}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default ScoreTable;
