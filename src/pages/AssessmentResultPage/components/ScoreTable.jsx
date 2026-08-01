import { getWorksheetMetrics } from '../../../mocks/assessmentResult';

const formatScore = (score) => score === null ? '—' : score;

function ScoreTable({ worksheet, view, onViewChange, onCellClick }) {
    const metrics = getWorksheetMetrics(worksheet);
    const studentRows = worksheet.students.map((student, index) => ({
        key: student.id, label: student.name, scores: student.answers.map((answer) => answer.score),
        total: student.answers.some((answer) => answer.score === null) ? '대기' : metrics.totals[index], grade: student.answers.some((answer) => answer.score === null) ? '-' : student.grade,
    }));
    const questionRows = worksheet.questions.map((question) => ({
        key: question.no, label: `${question.no}번`, scores: worksheet.students.map((student) => student.answers.find((answer) => answer.no === question.no)?.score ?? null),
        total: worksheet.students.reduce((sum, student) => sum + (student.answers.find((answer) => answer.no === question.no)?.score ?? 0), 0), grade: `${question.maxScore}점`,
    }));
    const rows = view === 'student' ? studentRows : questionRows;
    const columns = view === 'student' ? worksheet.questions.map((question) => `${question.no}`) : worksheet.students.map((student) => student.name);
    const averages = columns.map((_, columnIndex) => {
        const values = rows.map((row) => row.scores[columnIndex]).filter((score) => score !== null);
        return values.length ? (values.reduce((sum, score) => sum + score, 0) / values.length).toFixed(1) : '—';
    });

    const handleCell = (rowIndex, columnIndex) => {
        const studentId = view === 'student' ? rows[rowIndex].key : worksheet.students[columnIndex].id;
        const questionNo = view === 'student' ? worksheet.questions[columnIndex].no : rows[rowIndex].key;
        onCellClick(studentId, questionNo);
    };
    const exportScores = () => {
        const header = [view === 'student' ? '학생' : '문항', ...columns, '합계', view === 'student' ? '등급' : '배점'];
        const body = rows.map((row) => [row.label, ...row.scores.map(formatScore), row.total, row.grade]);
        const csv = [header, ...body, ['평균', ...averages, metrics.average, '—']].map((line) => line.join(',')).join('\n');
        const url = URL.createObjectURL(new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8' }));
        const anchor = document.createElement('a');
        anchor.href = url; anchor.download = `${worksheet.title}-점수표.csv`; anchor.click();
        URL.revokeObjectURL(url);
    };

    return (
        <section className="score-table" aria-label="평가 점수표">
            <div className="score-table__toolbar">
                <div className="score-table__toggle" role="group" aria-label="점수표 보기 방식">
                    <button type="button" className={view === 'student' ? 'score-table__toggle-button score-table__toggle-button--active' : 'score-table__toggle-button'} onClick={() => onViewChange('student')}>학생별</button>
                    <button type="button" className={view === 'question' ? 'score-table__toggle-button score-table__toggle-button--active' : 'score-table__toggle-button'} onClick={() => onViewChange('question')}>문항별</button>
                </div>
                <button type="button" className="score-table__export" onClick={exportScores}><i className="bi bi-download" aria-hidden="true" /> 내보내기</button>
            </div>
            <div className="score-table__scroll">
                <table>
                    <thead><tr><th>{view === 'student' ? '학생' : '문항'}</th>{columns.map((column) => <th key={column}>{column}</th>)}<th>합계</th><th>{view === 'student' ? '등급' : '배점'}</th></tr></thead>
                    <tbody>
                        {rows.map((row, rowIndex) => <tr key={row.key}><th>{row.label}</th>{row.scores.map((score, columnIndex) => <td key={`${row.key}-${columnIndex}`}><button type="button" aria-label={`${row.label} ${columns[columnIndex]} 점수`} onClick={() => handleCell(rowIndex, columnIndex)}>{formatScore(score)}</button></td>)}<td className="score-table__total">{row.total}</td><td>{row.grade}</td></tr>)}
                    </tbody>
                    <tfoot><tr><th>평균</th>{averages.map((average, index) => <td key={columns[index]}>{average}</td>)}<td>{metrics.average}</td><td>—</td></tr></tfoot>
                </table>
            </div>
        </section>
    );
}

export default ScoreTable;
