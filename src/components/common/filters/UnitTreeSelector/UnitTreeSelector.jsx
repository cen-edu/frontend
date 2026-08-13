import { useState } from 'react';
import { CustomCheckbox } from '../../inputs';
import './UnitTreeSelector.scss';

function UnitTreeSelector({ majorUnits, selectedUnitIds, onToggleUnit, onToggleMiddleUnit, isLoading = false, error = null, onRetry }) {
    const [closedIds, setClosedIds] = useState([]);

    const toggleMajor = (majorId) => {
        setClosedIds((current) => current.includes(majorId)
            ? current.filter((id) => id !== majorId)
            : [...current, majorId]);
    };

    if (isLoading) return <div className="unit-tree__empty" role="status">단원을 불러오는 중입니다.</div>;

    if (error) {
        return (
            <div className="unit-tree__empty unit-tree__empty--error" role="alert">
                <span>{error.message || '단원을 불러오지 못했습니다.'}</span>
                {onRetry && <button type="button" onClick={onRetry}>다시 불러오기</button>}
            </div>
        );
    }

    if (!majorUnits.length) return <div className="unit-tree__empty">선택한 범위에 등록된 단원이 없습니다.</div>;

    return (
        <div className="unit-tree">
            {majorUnits.map((major) => {
                const isClosed = closedIds.includes(major.id);
                const majorSmallUnits = major.children.flatMap((middle) => middle.children);
                const selectedCount = majorSmallUnits.filter((unit) => selectedUnitIds.includes(unit.id)).length;
                return (
                    <section className="unit-tree__major" key={major.id}>
                        <button type="button" className="unit-tree__major-toggle" aria-expanded={!isClosed} onClick={() => toggleMajor(major.id)}>
                            <span><i className={`bi bi-chevron-${isClosed ? 'right' : 'down'}`} aria-hidden="true" />{major.name}</span>
                            <span>{selectedCount ? `${selectedCount}개 선택` : '선택 없음'}</span>
                        </button>
                        {!isClosed && (
                            <div className="unit-tree__major-body">
                                {major.children.map((middle) => {
                                    const unitIds = middle.children.map((unit) => unit.id);
                                    const allSelected = unitIds.length > 0 && unitIds.every((id) => selectedUnitIds.includes(id));
                                    return (
                                        <div className="unit-tree__middle" key={middle.id}>
                                            <div className={`unit-tree__middle-header${allSelected ? ' unit-tree__middle-header--selected' : ''}`}>
                                                <CustomCheckbox label={`${middle.name} 소단원 전체 선택`} checked={allSelected} onChange={() => onToggleMiddleUnit(unitIds)} />
                                                <button type="button" aria-pressed={allSelected} onClick={() => onToggleMiddleUnit(unitIds)}>{middle.name}</button>
                                            </div>
                                            <div className="unit-tree__small-list">
                                                {middle.children.map((unit) => {
                                                    const checked = selectedUnitIds.includes(unit.id);
                                                    return (
                                                        <div className={`unit-tree__small${checked ? ' unit-tree__small--selected' : ''}`} key={unit.id}>
                                                            <CustomCheckbox label={`${unit.name} 선택`} checked={checked} onChange={() => onToggleUnit(unit.id)} />
                                                            <button type="button" onClick={() => onToggleUnit(unit.id)}>{unit.name}</button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                );
            })}
        </div>
    );
}

export default UnitTreeSelector;
