import CustomSelect from '../CustomSelect/CustomSelect';
import { assignmentPeriodOptions, isValidAssignmentDateRange } from '../../../utils/assignmentPeriod';
import './AssignmentPeriodFilter.scss';

function AssignmentPeriodFilter({ period, startDate, endDate, onPeriodChange, onStartDateChange, onEndDateChange, selectWidth = 116 }) {
    const isRangeValid = isValidAssignmentDateRange(startDate, endDate);

    return (
        <div className="assignment-period-filter">
            <CustomSelect label="배정일 기간" value={period} options={assignmentPeriodOptions} onChange={onPeriodChange} width={selectWidth} />
            {period === 'custom' && (
                <div className="assignment-period-filter__range">
                    <label>
                        <span className="assignment-period-filter__sr-only">배정 시작일</span>
                        <input type="date" value={startDate} max={endDate || undefined} onChange={(event) => onStartDateChange(event.target.value)} />
                    </label>
                    <span aria-hidden="true">~</span>
                    <label>
                        <span className="assignment-period-filter__sr-only">배정 종료일</span>
                        <input type="date" value={endDate} min={startDate || undefined} onChange={(event) => onEndDateChange(event.target.value)} />
                    </label>
                    {!isRangeValid && <span className="assignment-period-filter__error" role="alert">시작일과 종료일을 확인해 주세요.</span>}
                </div>
            )}
        </div>
    );
}

export default AssignmentPeriodFilter;
