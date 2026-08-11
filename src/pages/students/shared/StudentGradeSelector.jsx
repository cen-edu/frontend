import { CustomSelect } from '../../../components/common/inputs';
import { GRADE_OPTIONS } from './gradeOptions';

function StudentGradeSelector({ value, onChange }) {
    return (
        <div className="student-form-modal__grade-controls">
            <CustomSelect
                label="학년 선택"
                value={value}
                options={GRADE_OPTIONS}
                onChange={onChange}
                width={112}
            />
        </div>
    );
}

export default StudentGradeSelector;
