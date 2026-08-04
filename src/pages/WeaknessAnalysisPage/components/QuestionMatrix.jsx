import CustomSelect from '../../../components/common/CustomSelect/CustomSelect';

function QuestionMatrix({ worksheet, view, onViewChange, onSelect, selection }) {
    return (
        <section className="diagnosis-card matrix-card">
            <div className="diagnosis-card__heading">
                <div><span>문항 비교</span><h2>문항별 성취</h2></div>
                <CustomSelect label="보기 방식" value={view} onChange={onViewChange} width={124} options={[{ value: 'score', label: '보기: 득점' }, { value: 'time', label: '보기: 시간' }]} />
            </div>
            <div className="matrix-legend">
                {view === 'score'
                    ? <><span>숫자 = 획득 점수</span><span><i className="matrix-key matrix-key--full" /> 만점</span><span><i className="matrix-key matrix-key--partial" /> 부분 점수</span><span><i className="matrix-key matrix-key--zero" /> 0점</span><span><i className="matrix-key matrix-key--pending" /> 채점 대기</span><span><i className="matrix-key matrix-key--hint" /> 힌트 사용</span></>
                    : <><span>연함 = 빠름</span><span>진함 = 느림</span></>}
            </div>
            <div className="matrix-table__wrap">
                <table className="matrix-table matrix-table--questions" style={{ '--question-count': worksheet.questions.length }}>
                    <thead><tr><th>학생</th>{worksheet.questions.map((question) => <th key={question.no}><button type="button" onClick={() => onSelect({ type: 'question', questionNo: question.no })}>{question.no}번<small>{question.maxScore}점</small></button></th>)}</tr></thead>
                    <tbody>
                        {worksheet.students.map((student) => (
                            <tr key={student.id}>
                                <th>{student.name}</th>
                                {student.responses.map((response) => {
                                    const pending = response.gradedBy === null;
                                    const ratio = response.score / response.maxScore;
                                    const level = pending ? 'pending' : ratio === 1 ? 'full' : ratio > 0 ? 'partial' : 'zero';
                                    const label = `${student.name} ${response.no}번 ${pending ? '채점 대기' : `${response.score}점 / 배점 ${response.maxScore}점`}${response.hintUsed ? ', 힌트 사용' : ''}`;
                                    return (
                                        <td key={response.no}>
                                            <button
                                                type="button"
                                                className={`question-cell question-cell--${view === 'score' ? level : 'time'}${selection?.type === 'question' && selection.questionNo === response.no ? ' question-cell--selected' : ''}`}
                                                style={view === 'time' ? { '--time-opacity': Math.min(.82, .14 + response.seconds / 360) } : undefined}
                                                onClick={() => onSelect({ type: 'question', questionNo: response.no })}
                                                aria-label={view === 'score' ? label : `${student.name} ${response.no}번 ${response.seconds}초`}
                                            >
                                                {view === 'score'
                                                    ? <>{pending ? '–' : response.score}{response.hintUsed && <i className="question-cell__hint" aria-hidden="true" />}</>
                                                    : `${Math.floor(response.seconds / 60)}:${String(response.seconds % 60).padStart(2, '0')}`}
                                            </button>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default QuestionMatrix;
