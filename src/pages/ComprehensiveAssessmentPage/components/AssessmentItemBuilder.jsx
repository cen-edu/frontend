import CustomSelect from '../../../components/common/CustomSelect/CustomSelect';
import { questionFormats } from '../../../mocks/assessmentCreation';
import { difficultyLabels, difficultyLevels } from '../../../mocks/problemCreation';

const difficultyOptions = difficultyLevels.map((value) => ({ value, label: difficultyLabels[value] }));

function AssessmentItemBuilder({ groups, totalCount, canGenerate, onAddRow, onChangeRow, onRemoveRow, onRemoveUnit, onGenerate }) {
    return (
        <div className="assessment-builder">
            {!groups.length ? (
                <div className="assessment-builder__empty">왼쪽에서 소단원을 선택하면 출제 항목이 추가됩니다.</div>
            ) : (
                <div className="assessment-builder__groups">
                    {groups.map(({ unitId, unit, rows }) => {
                        const subtotalCount = rows.reduce((sum, row) => sum + row.count, 0);
                        return (
                            <section className="assessment-builder__group" key={unitId} aria-labelledby={`assessment-unit-${unitId}`}>
                                <header className="assessment-builder__group-header">
                                    <div>
                                        <span>{unit.majorName} · {unit.middleName}</span>
                                        <h3 id={`assessment-unit-${unitId}`}>{unit.name}</h3>
                                    </div>
                                    <div className="assessment-builder__group-actions">
                                        <span>{subtotalCount}문항</span>
                                        <button type="button" aria-label={`${unit.name} 제외`} onClick={() => onRemoveUnit(unitId)}><i className="bi bi-x-lg" aria-hidden="true" /></button>
                                    </div>
                                </header>
                                <div className="assessment-builder__rows">
                                    {rows.map((row, rowIndex) => (
                                        <div className="assessment-builder__row" key={row.id}>
                                            <span className="assessment-builder__row-number">{rowIndex + 1}</span>
                                            <CustomSelect label={`${unit.name} ${rowIndex + 1}행 문항 유형`} value={row.format} options={questionFormats} onChange={(value) => onChangeRow(unitId, row.id, 'format', value)} width={150} />
                                            <CustomSelect label={`${unit.name} ${rowIndex + 1}행 난이도`} value={row.difficulty} options={difficultyOptions} onChange={(value) => onChangeRow(unitId, row.id, 'difficulty', value)} width={92} />
                                            <div className="assessment-builder__stepper" aria-label={`${unit.name} ${rowIndex + 1}행 문항 수`}>
                                                <button type="button" aria-label="문항 수 줄이기" disabled={row.count <= 1} onClick={() => onChangeRow(unitId, row.id, 'count', row.count - 1)}>−</button>
                                                <span>{row.count}</span>
                                                <button type="button" aria-label="문항 수 늘리기" disabled={row.count >= 10} onClick={() => onChangeRow(unitId, row.id, 'count', row.count + 1)}>+</button>
                                            </div>
                                            <button type="button" className="assessment-builder__remove-row" aria-label={`${unit.name} ${rowIndex + 1}행 삭제`} onClick={() => onRemoveRow(unitId, row.id)}><i className="bi bi-trash3" aria-hidden="true" /></button>
                                        </div>
                                    ))}
                                </div>
                                <button type="button" className="assessment-builder__add-row" onClick={() => onAddRow(unitId)}><i className="bi bi-plus-lg" aria-hidden="true" /> 출제 항목 추가</button>
                            </section>
                        );
                    })}
                </div>
            )}

            <footer className="assessment-builder__footer">
                <div><span>총</span><strong>{totalCount}문항</strong></div>
                <button type="button" className="assessment-button assessment-button--primary" disabled={!canGenerate} onClick={onGenerate}>평가 생성</button>
            </footer>
        </div>
    );
}

export default AssessmentItemBuilder;
