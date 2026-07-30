import { useMemo, useState } from 'react';
import students from '../../../mocks/students';
import teachers from '../../../mocks/teachers';
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
            <p>
                왼쪽의 <i className="class-creation__plus-icon class-creation__plus-icon--muted" aria-hidden="true" /> 를 눌러<br />
                {type}을 선택하세요.
            </p>
        </div>
    );
}

function ClassCreationPage({ onClose, onRegister, initialClass = null, title = '반 만들기', submitLabel = '등록하기' }) {
    const [className, setClassName] = useState(initialClass?.name ?? '');
    const [teacherSearch, setTeacherSearch] = useState('');
    const [studentSearch, setStudentSearch] = useState('');
    const [selectedTeacherIds, setSelectedTeacherIds] = useState(initialClass?.teacherIds ?? []);
    const [selectedStudentIds, setSelectedStudentIds] = useState(initialClass?.studentIds ?? []);

    const availableTeachers = useMemo(() => {
        const keyword = teacherSearch.trim().toLowerCase();
        return teachers.filter((teacher) => !selectedTeacherIds.includes(teacher.id)
            && (!keyword || teacher.name.toLowerCase().includes(keyword)));
    }, [selectedTeacherIds, teacherSearch]);

    const availableStudents = useMemo(() => {
        const keyword = studentSearch.trim().toLowerCase();
        return students.filter((student) => !selectedStudentIds.includes(student.id)
            && (!keyword || student.name.toLowerCase().includes(keyword)));
    }, [selectedStudentIds, studentSearch]);

    const selectedTeachers = teachers.filter(({ id }) => selectedTeacherIds.includes(id));
    const selectedStudents = students.filter(({ id }) => selectedStudentIds.includes(id));

    const groupStudents = (studentList) => studentList.reduce((groups, student) => {
        const groupName = student.grade;
        if (!groups[groupName]) groups[groupName] = [];
        groups[groupName].push(student);
        return groups;
    }, {});

    const availableStudentGroups = groupStudents(availableStudents);
    const selectedStudentGroups = groupStudents(selectedStudents);

    const addAllTeachers = () => setSelectedTeacherIds((current) => [
        ...new Set([...current, ...availableTeachers.map(({ id }) => id)]),
    ]);

    const addStudentGroup = (groupStudentsList) => setSelectedStudentIds((current) => [
        ...new Set([...current, ...groupStudentsList.map(({ id }) => id)]),
    ]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const trimmedName = className.trim();
        if (!trimmedName) return;

        onRegister({
            ...initialClass,
            name: trimmedName,
            studentSummary: selectedStudents.length === 0
                ? '등록된 학생 없음'
                : selectedStudents.length === 1
                    ? selectedStudents[0].name
                    : `${selectedStudents[0].name} 외 ${selectedStudents.length - 1}명`,
            studentCount: selectedStudents.length,
            teacher: selectedTeachers.length > 0
                ? selectedTeachers.map(({ name }) => name).join(', ')
                : '담당 선생님 없음',
            teacherIds: selectedTeacherIds,
            studentIds: selectedStudentIds,
        });
    };

    return (
        <section className="class-creation" aria-labelledby="class-creation-title">
            <header className="class-creation__header">
                <h2 id="class-creation-title">{title}</h2>
                <button type="button" aria-label={`${title} 닫기`} onClick={onClose}>
                    <i className="bi bi-x-lg" aria-hidden="true" />
                </button>
            </header>

            <form className="class-creation__form" onSubmit={handleSubmit}>
                <div className="class-creation__body">
                    <label className="class-creation__name-field">
                        <span>반 이름</span>
                        <input
                            type="text"
                            placeholder="반 이름을 입력해주세요."
                            maxLength={30}
                            value={className}
                            autoFocus
                            onChange={(event) => setClassName(event.target.value)}
                        />
                    </label>

                    <div className="class-creation__columns">
                        <div className="class-creation__group">
                            <h3>반 선생님</h3>
                            <div className="class-creation__pair">
                                <div className="class-creation__source">
                                    <SearchField
                                        label="선생님 이름 검색"
                                        placeholder="선생님 이름 검색"
                                        value={teacherSearch}
                                        onChange={setTeacherSearch}
                                    />
                                    <div className="class-creation__panel">
                                        {availableTeachers.length > 0 ? (
                                            <>
                                                <button
                                                    type="button"
                                                    className="class-creation__panel-row class-creation__panel-row--summary"
                                                    aria-label="검색된 선생님 모두 추가"
                                                    onClick={addAllTeachers}
                                                >
                                                    <span><strong>전체</strong> <em>{availableTeachers.length}명</em></span>
                                                    <span className="class-creation__row-action">
                                                        <i className="class-creation__plus-icon" aria-hidden="true" />
                                                    </span>
                                                </button>
                                                {availableTeachers.map((teacher) => (
                                                    <button
                                                        type="button"
                                                        className="class-creation__panel-row"
                                                        key={teacher.id}
                                                        aria-label={`${teacher.name} 추가`}
                                                        onClick={() => setSelectedTeacherIds((current) => [...current, teacher.id])}
                                                    >
                                                        <span>{teacher.name}</span>
                                                        <span className="class-creation__row-action">
                                                            <i className="class-creation__plus-icon" aria-hidden="true" />
                                                        </span>
                                                    </button>
                                                ))}
                                            </>
                                        ) : (
                                            <div className="class-creation__all-added">모든 선생님을 추가하였습니다.</div>
                                        )}
                                    </div>
                                </div>

                                <div className="class-creation__panel class-creation__panel--selected">
                                    <div className="class-creation__panel-title">
                                        <strong>선택된 선생님</strong>
                                        {selectedTeachers.length > 0 && <span>{selectedTeachers.length}명</span>}
                                    </div>
                                    {selectedTeachers.length === 0 ? <EmptySelection type="선생님" /> : selectedTeachers.map((teacher) => (
                                        <button
                                            type="button"
                                            className="class-creation__panel-row class-creation__panel-row--remove"
                                            key={teacher.id}
                                            aria-label={`${teacher.name} 제외`}
                                            onClick={() => setSelectedTeacherIds((current) => current.filter((id) => id !== teacher.id))}
                                        >
                                            <span>{teacher.name}</span>
                                            <span className="class-creation__row-action">
                                                <i className="class-creation__minus-icon" aria-hidden="true" />
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

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
                                        {Object.entries(availableStudentGroups).length > 0 ? Object.entries(availableStudentGroups).map(([grade, gradeStudents]) => (
                                            <div className="class-creation__student-group" key={grade}>
                                                <button
                                                    type="button"
                                                    className="class-creation__panel-row class-creation__panel-row--summary"
                                                    aria-label={`${grade} 학생 모두 추가`}
                                                    onClick={() => addStudentGroup(gradeStudents)}
                                                >
                                                    <span><i className="bi bi-caret-down-fill" aria-hidden="true" /> <strong>{grade}</strong> <em>{gradeStudents.length}명</em></span>
                                                    <span className="class-creation__row-action">
                                                        <i className="class-creation__plus-icon" aria-hidden="true" />
                                                    </span>
                                                </button>
                                                {gradeStudents.map((student) => (
                                                    <button
                                                        type="button"
                                                        className="class-creation__panel-row class-creation__panel-row--indented"
                                                        key={student.id}
                                                        aria-label={`${student.name} 추가`}
                                                        onClick={() => setSelectedStudentIds((current) => [...current, student.id])}
                                                    >
                                                        <span>{student.name}</span>
                                                        <span className="class-creation__row-action">
                                                            <i className="class-creation__plus-icon" aria-hidden="true" />
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        )) : <div className="class-creation__all-added">모든 학생을 추가하였습니다.</div>}
                                    </div>
                                </div>

                                <div className="class-creation__panel class-creation__panel--selected">
                                    <div className="class-creation__panel-title">
                                        <strong>선택된 학생</strong>
                                        {selectedStudents.length > 0 && <span>{selectedStudents.length}명</span>}
                                    </div>
                                    {selectedStudents.length === 0 ? <EmptySelection type="학생" /> : Object.entries(selectedStudentGroups).map(([grade, gradeStudents]) => (
                                        <div className="class-creation__student-group" key={grade}>
                                            <button
                                                type="button"
                                                className="class-creation__panel-row class-creation__panel-row--summary class-creation__panel-row--remove"
                                                aria-label={`${grade} 학생 모두 제외`}
                                                onClick={() => setSelectedStudentIds((current) => current.filter((id) => !gradeStudents.some((student) => student.id === id)))}
                                            >
                                                <span><i className="bi bi-caret-down-fill" aria-hidden="true" /> <strong>{grade}</strong> <em>{gradeStudents.length}명</em></span>
                                                <span className="class-creation__row-action">
                                                    <i className="class-creation__minus-icon" aria-hidden="true" />
                                                </span>
                                            </button>
                                            {gradeStudents.map((student) => (
                                                <button
                                                    type="button"
                                                    className="class-creation__panel-row class-creation__panel-row--indented class-creation__panel-row--remove"
                                                    key={student.id}
                                                    aria-label={`${student.name} 제외`}
                                                    onClick={() => setSelectedStudentIds((current) => current.filter((id) => id !== student.id))}
                                                >
                                                    <span>{student.name}</span>
                                                    <span className="class-creation__row-action">
                                                        <i className="class-creation__minus-icon" aria-hidden="true" />
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
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
