import CustomSelect from '../../../components/common/CustomSelect/CustomSelect';
import { createGradeOptions, SCHOOL_LEVELS } from './studentFormConfig';

function StudentGradeSelector({ schoolLevel, gradeYear, onSchoolLevelChange, onGradeYearChange }) {
    const selectSchoolLevel = (level) => {
        onSchoolLevelChange(level);
        if (Number(gradeYear) > SCHOOL_LEVELS[level].years) onGradeYearChange('1');
    };

    return (
        <div className="student-form-modal__grade-controls">
            <div className="student-form-modal__level-buttons" aria-label="학교급 선택">
                {Object.entries(SCHOOL_LEVELS).map(([value, option]) => (
                    <button
                        key={value}
                        type="button"
                        className={schoolLevel === value ? 'student-form-modal__level-button--active' : ''}
                        onClick={() => selectSchoolLevel(value)}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
            <CustomSelect
                label="학년 선택"
                value={gradeYear}
                options={createGradeOptions(schoolLevel)}
                onChange={onGradeYearChange}
                width={88}
            />
        </div>
    );
}

export default StudentGradeSelector;
