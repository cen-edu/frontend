import { useMemo, useState } from 'react';
import CustomSelect from '../../../components/common/CustomSelect/CustomSelect';
import students from '../../../mocks/students';
import teachers from '../../../mocks/teachers';
import { GRADE_OPTIONS } from './studentFormConfig';
import { ACADEMIC_YEAR_OPTIONS, CURRENT_ACADEMIC_YEAR } from './classFormConfig';
import './ClassCreationPage.scss';

function SearchField({ label, placeholder, value, onChange }) {
    return (
        <div className="class-creation__search">
            <i className="bi bi-search" aria-hidden="true" />
            <input
                type="search"
                aria-label={label}
                placeholder={placeholder}
                value={value}
                onChange={(event) => onChange(event.target.value)}
            />
            {value && (
                <button type="button" aria-label={`${label} 초기화`} onClick={() => onChange('')}>
                    <i className="bi bi-x-lg" aria-hidden="true" />
                </button>
            )}
        </div>
    );
}

function EmptySelection({ type }) {
    return (
        <div className="class-creation__empty">
            <p>왼쪽 목록에서 {type}을 선택하세요.</p>
        </div>
    );
}

function ClassCreationPage({ onClose, onRegister, initialClass = null, title = '반 만들기', submitLabel = '등록하기' }) {
    const [year, setYear] = useState(initialClass?.year ?? CURRENT_ACADEMIC_YEAR);
    const [grade, setGrade] = useState(initialClass?.grade ?? '1');
    const [className, setClassName] = useState(initialClass?.name ?? '');
    const [studentSearch, setStudentSearch] = useState('');
    const [selectedStudentIds, setSelectedStudentIds] = useState(initialClass?.studentIds ?? []);
    const currentTeacher = teachers[0];

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

        onRegister({
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
        <section className="class-creation" aria-labelledby="class-creation-title">
            <header className="class-creation__header">
                <div>
                    <h1 id="class-creation-title">{title}</h1>
                    <p>학년도와 학년, 반 이름을 입력하고 소속 학생을 선택합니다.</p>
                </div>
                <button type="button" aria-label={`${title} 닫기`} onClick={onClose}>
                    <i className="bi bi-x-lg" aria-hidden="true" />
                </button>
            </header>

            <form className="class-creation__form" onSubmit={handleSubmit}>
                <div className="class-creation__body">
                    <div className="class-creation__details">
                        <div className="class-creation__select-field">
                            <span>학년도</span>
                            <CustomSelect
                                label="반 학년도 선택"
                                value={year}
                                options={ACADEMIC_YEAR_OPTIONS}
                                onChange={setYear}
                                width={152}
                            />
                        </div>
                        <div className="class-creation__select-field">
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
                                width={112}
                            />
                        </div>
                        <label className="class-creation__name-field">
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

                    <div className="class-creation__columns">
                        <div className="class-creation__group">
                            <h3>반 학생</h3>
                            <div className="class-creation__pair">
                                <div className="class-creation__source">
                                    <SearchField
                                        label="학생 이름 검색"
                                        placeholder="학생 이름 검색"
                                        value={studentSearch}
                                        onChange={setStudentSearch}
                                    />
                                    <div className="class-creation__panel">
                                        <div className="class-creation__panel-title">
                                            <strong>{grade}학년 학생</strong>
                                            <span>{availableStudents.length}명</span>
                                        </div>
                                        {availableStudents.length > 0 ? availableStudents.map((student) => (
                                            <button
                                                type="button"
                                                className="class-creation__panel-row"
                                                key={student.id}
                                                aria-label={`${student.name} 추가`}
                                                onClick={() => setSelectedStudentIds((current) => [...current, student.id])}
                                            >
                                                <span>{student.name}</span>
                                                <span className="class-creation__row-action">
                                                    <i className="class-creation__plus-icon" aria-hidden="true" />
                                                </span>
                                            </button>
                                        )) : <div className="class-creation__all-added">추가할 수 있는 {grade}학년 학생이 없습니다.</div>}
                                    </div>
                                </div>

                                <div className="class-creation__panel class-creation__panel--selected">
                                    <div className="class-creation__panel-title">
                                        <strong>선택된 학생</strong>
                                        {selectedStudents.length > 0 && <span>{selectedStudents.length}명</span>}
                                    </div>
                                    {selectedStudents.length === 0 ? <EmptySelection type="학생" /> : selectedStudents.map((student) => (
                                        <button
                                            type="button"
                                            className="class-creation__panel-row class-creation__panel-row--remove"
                                            key={student.id}
                                            aria-label={`${student.name} 제외`}
                                            onClick={() => setSelectedStudentIds((current) => current.filter((id) => id !== student.id))}
                                        >
                                            <span>{student.name}<em>{student.grade}학년</em></span>
                                            <span className="class-creation__row-action">
                                                <i className="class-creation__minus-icon" aria-hidden="true" />
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <footer className="class-creation__footer">
                    <button type="submit" disabled={!className.trim()}>{submitLabel}</button>
                </footer>
            </form>
        </section>
    );
}

export default ClassCreationPage;
