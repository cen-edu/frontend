import { Fragment } from 'react';
import { CustomSelect } from '../../inputs';
import './AnalysisFilters.scss';

function AnalysisFilters({ filters, options, onChange, badge, controls, showContext = true, className = '' }) {
    return (
        <section className={`analysis-filters${className ? ` ${className}` : ''}`} aria-label="분석 조회 조건">
            {showContext && <div className="analysis-filters__context">
                <span className="analysis-filters__icon" aria-hidden="true"><i className="bi bi-sliders" /></span>
                <div><strong>조회 조건</strong><span>선택한 학습지 기준으로 분석해요.</span></div>
            </div>}
            <div className="analysis-filters__controls">
                {controls ? controls.map((control) => control.render
                    ? <Fragment key={control.key}>{control.render}</Fragment>
                    : <CustomSelect key={control.key} label={control.label} value={control.value} options={control.options} onChange={control.onChange} width={control.width} disabled={control.disabled} />) : <>
                    <CustomSelect label="학년도 선택" value={filters.year} options={options.years} onChange={(value) => onChange('year', value)} width={132} />
                    <CustomSelect label="학기 선택" value={filters.term} options={options.terms} onChange={(value) => onChange('term', value)} width={104} />
                    <CustomSelect label="반 선택" value={filters.classId} options={options.classes} onChange={(value) => onChange('classId', value)} width={174} />
                    <CustomSelect label="학습지 선택" value={filters.worksheet} options={options.worksheets} onChange={(value) => onChange('worksheet', value)} width={252} />
                </>}
                {badge && <span className={`analysis-filters__badge analysis-filters__badge--${badge.tone ?? 'blue'}`}>{badge.label}</span>}
            </div>
        </section>
    );
}

export default AnalysisFilters;
