import CustomSelect from '../../../components/common/CustomSelect/CustomSelect';

function getConceptResult(worksheet, student, conceptId) {
    const questionSteps = worksheet.questions.flatMap((question) => question.steps.filter((step) => step.conceptId === conceptId).map((step) => ({ no: question.no, step })));
    const attempts = questionSteps.map(({ no, step }) => student.responses.find((response) => response.no === no)?.steps.find((item) => item.order === step.order)).filter((item) => item?.input);
    return { correct: attempts.filter((item) => item.correct).length, attempts: attempts.length, inputs: attempts.filter((item) => !item.correct).map((item) => item.input) };
}
function ConceptMatrix({ worksheet, sortBy, onSortChange, onSelect }) {
    const hasManyConcepts = worksheet.concepts.length > 6;

    return <section className="diagnosis-card matrix-card">
        <div className="diagnosis-card__heading">
            <div>
                <span>CONCEPT MATRIX</span>
                <h2>개념별 성취</h2>
                {hasManyConcepts && <small className="matrix-card__description">{worksheet.concepts.length}개 개념 · 표를 좌우로 이동해 확인하세요.</small>}
            </div>
            <CustomSelect label="학생 정렬" value={sortBy} onChange={onSortChange} width={132} options={[{ value: 'score-asc', label: '득점률 낮은순' }, { value: 'score-desc', label: '득점률 높은순' }, { value: 'name', label: '이름순' }]} />
        </div>
        <div className="matrix-table__wrap" tabIndex={hasManyConcepts ? 0 : undefined} aria-label={hasManyConcepts ? `${worksheet.concepts.length}개 개념별 성취표, 좌우로 스크롤 가능` : undefined}>
            <table className="matrix-table matrix-table--concepts" style={{ '--concept-count': worksheet.concepts.length }}>
                <thead>
                    <tr>
                        <th>학생</th>
                        {worksheet.concepts.map((concept) => <th key={concept.id}><button type="button" onClick={() => onSelect({ type: 'concept', conceptId: concept.id })}>{concept.label}</button></th>)}
                    </tr>
                </thead>
                <tbody>
                    {worksheet.students.map((student) => <tr key={student.id}>
                        <th>{student.name}</th>
                        {worksheet.concepts.map((concept) => {
                            const result = getConceptResult(worksheet, student, concept.id);
                            const rate = result.attempts ? result.correct / result.attempts : null;
                            return <td key={concept.id}><span className={`matrix-cell matrix-cell--${rate === null ? 'empty' : rate < .5 ? 'weak' : rate < 1 ? 'partial' : 'full'}`}><strong>{rate === null ? '—' : `${result.correct}/${result.attempts}`}</strong></span></td>;
                        })}
                    </tr>)}
                </tbody>
            </table>
        </div>
    </section>;
}
export default ConceptMatrix;
