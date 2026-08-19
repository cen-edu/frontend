import { CustomSelect } from '../../inputs';
import './UnitScopeFilter.scss';

const gradeOptions = [
    { value: 'middle-1', label: '1학년' },
    { value: 'middle-2', label: '2학년' },
    { value: 'middle-3', label: '3학년' },
];

const termOptions = [
    { value: 'first', label: '1학기' },
    { value: 'second', label: '2학기' },
    { value: 'common', label: '공통' },
];

function UnitScopeFilter({ gradeId, term, onGradeChange, onTermChange, disabled = false }) {
    return (
        <section className="unit-scope-filter" aria-labelledby="unit-scope-filter-title">
            <div className="unit-scope-filter__heading">
                <h2 id="unit-scope-filter-title">출제 범위</h2>
                <p>학년과 학기를 변경하면 현재 구성이 초기화됩니다.</p>
            </div>
            <div className="unit-scope-filter__controls">
                <div className="unit-scope-filter__field">
                    <span>학년</span>
                    <CustomSelect label="출제 학년 선택" value={gradeId} options={gradeOptions} onChange={onGradeChange} width={132} disabled={disabled} />
                </div>
                <span className="unit-scope-filter__separator" aria-hidden="true"><i className="bi bi-chevron-right" /></span>
                <div className="unit-scope-filter__field">
                    <span>학기</span>
                    <CustomSelect label="출제 학기 선택" value={term} options={termOptions} onChange={onTermChange} width={132} disabled={disabled} />
                </div>
            </div>
        </section>
    );
}

export default UnitScopeFilter;
