import { useMemo, useState } from 'react';
import CustomSelect from '../../../../components/common/CustomSelect/CustomSelect';
import students from '../../../../mocks/students';
import teachers from '../../../../mocks/teachers';
import StudentFormModal from '../../shared/StudentFormModal';
import { GRADE_OPTIONS } from '../../shared/gradeOptions';
import { CURRENT_ACADEMIC_YEAR } from '../classFormConfig';
import './ClassFormModal.scss';

function SearchField({ value, onChange }) {
    return (
        <div className="class-form-modal__search">
            <i className="bi bi-search" aria-hidden="true" />
            <input
                type="search"
                aria-label="학생 이름 검색"
                placeholder="학생 이름 검색"
                value={value}
                onChange={(event) => onChange(event.target.value)}
            />
            {value && (
                <button type="button" aria-label="학생 이름 검색 초기화" onClick={() => onChange('')}>
                    <i className="bi bi-x-lg" aria-hidden="true" />
                </button>
            )}
        </div>
    );
}

function ClassFormModal({ initialClass = null, onClose, onSave }) {
    const year = initialClass?.year ?? CURRENT_ACADEMIC_YEAR;
    const [grade, setGrade] = useState(initialClass?.grade ?? '1');
    const [className, setClassName] = useState(initialClass?.name ?? '');
    const [studentSearch, setStudentSearch] = useState('');
    const [selectedStudentIds, setSelectedStudentIds] = useState(initialClass?.studentIds ?? []);
    const currentTeacher = teachers[0];
    const isDetail = Boolean(initialClass);

    const availableStudents = useMemo(() => {
        const keyword = studentSearch.trim().toLowerCase();
        return students.filter((student) => student.grade === grade
            && !selectedStudentIds.includes(student.id)
            && (!keyword || student.name.toLowerCase().includes(keyword)));
    }, [grade, selectedStudentIds, studentSearch]);

    const selectedStudents = students.filter(({ id }) => selectedStudentIds.includes(id));

    const handleSubmit = (event) => {
        event.preventDefault();
        const trimmedName = className.trim();
        if (!trimmedName) return;

        onSave({
            ...initialClass,
            year,
            grade,
            name: trimmedName,
            studentSummary: selectedStudents.length === 0
                ? '등록된 학생 없음'
                : selectedStudents.length === 1
                    ? selectedStudents[0].name
                    : `${selectedStudents[0].name} 외 ${selectedStudents.length - 1}명`,
            studentCount: selectedStudents.length,
            teacher: currentTeacher.name,
            teacherIds: [currentTeacher.id],
            studentIds: selectedStudentIds,
        });
    };

    return (
        <StudentFormModal
            title={isDetail ? '반 상세 정보' : '반 만들기'}
            closeLabel={isDetail ? '반 상세 정보 창 닫기' : '반 만들기 창 닫기'}
            onClose={onClose}
            width={920}
        >
            <form className="class-form-modal" onSubmit={handleSubmit}>
                <div className="class-form-modal__fields">
                    <label className="class-form-modal__name-field">
                        <span>학년도</span>
                        <input
                            className="class-form-modal__readonly"
                            value={`${year}학년도`}
                            readOnly
                            aria-readonly="true"
                        />
                    </label>
                    <div className="class-form-modal__select-field">
                        <span>학년</span>
                        <CustomSelect
                            label="반 학년 선택"
                            value={grade}
                            options={GRADE_OPTIONS}
                            onChange={(nextGrade) => {
                                setGrade(nextGrade);
                                setStudentSearch('');
                                if (!initialClass) setSelectedStudentIds([]);
                            }}
                            width="100%"
                        />
                    </div>
                    <label className="class-form-modal__name-field">
                        <span>반 이름</span>
                        <input
                            type="text"
                            placeholder="예: 1반"
                            maxLength={30}
                            value={className}
                            autoFocus
                            onChange={(event) => setClassName(event.target.value)}
                        />
                    </label>
                </div>

                <section className="class-form-modal__students" aria-labelledby="class-form-students-title">
                    <h3 id="class-form-students-title">반 학생</h3>
                    <div className="class-form-modal__pair">
                        <div className="class-form-modal__source">
                            <SearchField value={studentSearch} onChange={setStudentSearch} />
                            <div className="class-form-modal__panel">
                                <div className="class-form-modal__panel-title">
                                    <strong>{grade}학년 학생</strong>
                                    <span>{availableStudents.length}명</span>
                                </div>
                                {availableStudents.length > 0 ? availableStudents.map((student) => (
                                    <button
                                        type="button"
                                        className="class-form-modal__panel-row"
                                        key={student.id}
                                        aria-label={`${student.name} 추가`}
                                        onClick={() => setSelectedStudentIds((current) => [...current, student.id])}
                                    >
                                        <span>{student.name}</span>
                                        <i className="bi bi-plus-lg" aria-hidden="true" />
                                    </button>
                                )) : <div className="class-form-modal__empty">추가할 수 있는 {grade}학년 학생이 없습니다.</div>}
                            </div>
                        </div>

                        <div className="class-form-modal__panel class-form-modal__panel--selected">
                            <div className="class-form-modal__panel-title">
                                <strong>선택된 학생</strong>
                                <span>{selectedStudents.length}명</span>
                            </div>
                            {selectedStudents.length > 0 ? selectedStudents.map((student) => (
                                <button
                                    type="button"
                                    className="class-form-modal__panel-row class-form-modal__panel-row--remove"
                                    key={student.id}
                                    aria-label={`${student.name} 제외`}
                                    onClick={() => setSelectedStudentIds((current) => current.filter((id) => id !== student.id))}
                                >
                                    <span>{student.name}<em>{student.grade}학년</em></span>
                                    <i className="bi bi-dash-lg" aria-hidden="true" />
                                </button>
                            )) : <div className="class-form-modal__empty">왼쪽 목록에서 학생을 선택하세요.</div>}
                        </div>
                    </div>
                </section>

                <footer className="student-form-modal__footer">
                    <button
                        type="submit"
                        className="student-form-modal__primary-button"
                        disabled={!className.trim()}
                    >
                        {isDetail ? '저장하기' : '등록하기'}
                    </button>
                </footer>
            </form>
        </StudentFormModal>
    );
}

export default ClassFormModal;
