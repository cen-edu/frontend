import { getWorksheetMetrics } from '../../../mocks/assessmentResult';

const formatScore = (score) => score === null ? '—' : score;
const isCorrectAnswer = (answer, question) => answer.isCorrect ?? (typeof answer.score === 'number' && typeof question.maxScore === 'number' && answer.score === question.maxScore);

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
            values: answers.map((answer, answerIndex) => isPractice ? (answer ? (isCorrectAnswer(answer, worksheet.questions[answerIndex]) ? 'O' : 'X') : '—') : formatScore(answer?.score ?? null)),
            summary: isPractice ? `${correctCount}/${worksheet.questions.length} (${Math.round((correctCount / worksheet.questions.length) * 100)}%)` : (pending ? '채점 대기' : `${metrics.totals[index]}/${metrics.maxTotal}`),
            pending,
        };
    });
    const exportScores = () => {
        const header = ['학생', ...worksheet.questions.map((question) => `${question.no}번`), isPractice ? '정답 수(정답률)' : '총점'];
        const body = rows.map((row) => [row.label, ...row.values, row.summary]);
        const csv = [header, ...body].map((line) => line.join(',')).join('\n');
        const url = URL.createObjectURL(new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8' }));
        const anchor = document.createElement('a');
        anchor.href = url; anchor.download = `${worksheet.title}-점수표.csv`; anchor.click();
        URL.revokeObjectURL(url);
    };

    return (
        <section className="score-table" aria-label="평가 점수표">
            <div className="score-table__toolbar">
                <div><h3>학생별 결과</h3><p>{worksheet.questions.length}개 문항 · {isPractice ? '정오표시' : `총 ${metrics.maxTotal}점`}</p></div>
                <button type="button" className="score-table__export" onClick={exportScores}><i className="bi bi-download" aria-hidden="true" /> 내보내기</button>
            </div>
            <div className="score-table__scroll">
                <table>
                    <thead><tr><th className="score-table__student">학생</th>{worksheet.questions.map((question) => <th key={question.no} className="score-table__question">{question.no}</th>)}<th className="score-table__summary">{isPractice ? '정답 수 (정답률)' : '총점'}</th>{!isPractice && <th className="score-table__action">채점</th>}</tr></thead>
                    <tbody>
                        {rows.map((row) => <tr key={row.key}><th className="score-table__student"><span>{row.number}번</span>{row.label}</th>{row.values.map((value, columnIndex) => <td key={`${row.key}-${worksheet.questions[columnIndex].no}`} className={isPractice ? `score-table__mark score-table__mark--${value === 'O' ? 'correct' : value === 'X' ? 'wrong' : 'empty'}` : ''}>{value}</td>)}<td className={`score-table__summary${row.pending ? ' score-table__summary--pending' : ''}`}>{row.summary}</td>{!isPractice && <td className="score-table__action"><button type="button" onClick={() => onGradeStudent(row.key)}>{row.pending ? '채점하기' : '확인'}</button></td>}</tr>)}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default ScoreTable;
