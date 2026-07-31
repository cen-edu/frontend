import CustomSelect from '../../../components/common/CustomSelect/CustomSelect';

function DashboardFilters({ filters, options, onChange }) {
    return (
        <section className="dashboard-filters" aria-label="대시보드 조회 조건">
            <div className="dashboard-filters__context">
                <span className="dashboard-filters__icon" aria-hidden="true"><i className="bi bi-sliders" /></span>
                <div>
                    <strong>조회 조건</strong>
                    <span>선택한 학습지 기준으로 분석해요.</span>
                </div>
            </div>

            <div className="dashboard-filters__controls">
                <CustomSelect label="학년도 선택" value={filters.year} options={options.years} onChange={(value) => onChange('year', value)} width={132} />
                <CustomSelect label="학기 선택" value={filters.term} options={options.terms} onChange={(value) => onChange('term', value)} width={104} />
                <CustomSelect label="반 선택" value={filters.classId} options={options.classes} onChange={(value) => onChange('classId', value)} width={174} />
                <CustomSelect label="학습지 선택" value={filters.worksheet} options={options.worksheets} onChange={(value) => onChange('worksheet', value)} width={236} />
            </div>
        </section>
    );
}

export default DashboardFilters;
