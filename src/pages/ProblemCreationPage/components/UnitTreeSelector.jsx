import { useState } from 'react';
import CustomCheckbox from '../../../components/common/CustomCheckbox/CustomCheckbox';

function UnitTreeSelector({ majorUnits, selectedIds, onToggle, onToggleMiddle }) {
    const [closedIds, setClosedIds] = useState([]);

    const toggleMajor = (majorId) => {
        setClosedIds((current) => current.includes(majorId)
            ? current.filter((id) => id !== majorId)
            : [...current, majorId]);
    };

    if (!majorUnits.length) {
        return <div className="unit-tree__empty">선택한 범위에 등록된 단원이 없습니다.</div>;
    }

    return (
        <div className="unit-tree">
            {majorUnits.map((major) => {
                const isClosed = closedIds.includes(major.id);
                const majorSmallUnits = major.middleUnits.flatMap((middle) => middle.smallUnits);
                const selectedCount = majorSmallUnits.filter((unit) => selectedIds.includes(unit.id)).length;
                return (
                    <section className="unit-tree__major" key={major.id}>
                        <button
                            type="button"
                            className="unit-tree__major-toggle"
                            aria-expanded={!isClosed}
                            onClick={() => toggleMajor(major.id)}
                        >
                            <span><i className={`bi bi-chevron-${isClosed ? 'right' : 'down'}`} aria-hidden="true" />{major.name}</span>
                            <span>{selectedCount ? `${selectedCount}개 선택` : '선택 없음'}</span>
                        </button>
                        {!isClosed && (
                            <div className="unit-tree__major-body">
                                {major.middleUnits.map((middle) => {
                                    const unitIds = middle.smallUnits.map((unit) => unit.id);
                                    const allSelected = unitIds.length > 0 && unitIds.every((id) => selectedIds.includes(id));
                                    return (
                                        <div className="unit-tree__middle" key={middle.id}>
                                            <div className={`unit-tree__middle-header${allSelected ? ' unit-tree__middle-header--selected' : ''}`}>
                                                <CustomCheckbox
                                                    label={`${middle.name} 소단원 전체 선택`}
                                                    checked={allSelected}
                                                    onChange={() => onToggleMiddle(unitIds)}
                                                />
                                                <button
                                                    type="button"
                                                    aria-pressed={allSelected}
                                                    onClick={() => onToggleMiddle(unitIds)}
                                                >
                                                    {middle.name}
                                                </button>
                                            </div>
                                            <div className="unit-tree__small-list">
                                                {middle.smallUnits.map((unit) => {
                                                    const checked = selectedIds.includes(unit.id);
                                                    return (
                                                        <div className={`unit-tree__small${checked ? ' unit-tree__small--selected' : ''}`} key={unit.id}>
                                                            <CustomCheckbox label={`${unit.name} 선택`} checked={checked} onChange={() => onToggle(unit.id)} />
                                                            <button type="button" onClick={() => onToggle(unit.id)}>{unit.name}</button>
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
