import CustomSelect from '../CustomSelect/CustomSelect';
import { curriculumFilterOptions } from '../../../mocks/curriculum';
import './UnitScopeFilter.scss';

function UnitScopeFilter({ gradeId, term, onGradeChange, onTermChange }) {
    return (
        <section className="unit-scope-filter" aria-labelledby="unit-scope-filter-title">
            <div className="unit-scope-filter__heading">
                <h2 id="unit-scope-filter-title">출제 범위</h2>
                <p>학년과 학기를 변경하면 현재 구성이 초기화됩니다.</p>
            </div>
            <div className="unit-scope-filter__controls">
                <div className="unit-scope-filter__field">
                    <span>학년</span>
                    <CustomSelect label="출제 학년 선택" value={gradeId} options={curriculumFilterOptions.grades} onChange={onGradeChange} width={132} />
                </div>
                <span className="unit-scope-filter__separator" aria-hidden="true"><i className="bi bi-chevron-right" /></span>
                <div className="unit-scope-filter__field">
                    <span>학기</span>
                    <CustomSelect label="출제 학기 선택" value={term} options={curriculumFilterOptions.terms} onChange={onTermChange} width={132} />
                </div>
            </div>
        </section>
    );
}

export default UnitScopeFilter;
