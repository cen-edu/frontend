import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classes from '../../../mocks/classes';
import initialStudents from '../../../mocks/students';
import StudentBulkRegistrationModal from './components/StudentBulkRegistrationModal';
import StudentDetailModal from './components/StudentDetailModal';
import StudentRegistrationModal from './components/StudentRegistrationModal';
import StudentSelectionBar from './components/StudentSelectionBar';
import StudentTable from './components/StudentTable';
import StudentToolbar from './components/StudentToolbar';
import { UNASSIGNED_CLASS } from '../shared/studentManagementConstants';
import './StudentListPage.scss';

// 표 영역 안에서 스크롤 없이 보여줄 수 있는 행 수를 계산할 때 쓰는 값. SCSS의 th/td 높이와 같아야 한다.
const ROW_HEIGHT = 54;
const HEAD_HEIGHT = 42;

function StudentListPage() {
    const navigate = useNavigate();
    const [students, setStudents] = useState(initialStudents);
    const [selectedIds, setSelectedIds] = useState([]);
    const [yearFilter, setYearFilter] = useState('all');
    const [gradeFilter, setGradeFilter] = useState('all');
    const [classFilter, setClassFilter] = useState('all');
    const [sortOrder, setSortOrder] = useState('newest');
    const [searchTerm, setSearchTerm] = useState('');
    const [isBulkRegistrationOpen, setIsBulkRegistrationOpen] = useState(false);
    const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
    const [detailStudent, setDetailStudent] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const tableWrapRef = useRef(null);

    // 표 안에 스크롤이 생기지 않도록, 남은 높이에 딱 들어가는 만큼만 한 페이지에 그린다.
    useEffect(() => {
        const tableWrap = tableWrapRef.current;
        if (!tableWrap) return undefined;

        const updatePageSize = () => {
            const rowArea = tableWrap.clientHeight - HEAD_HEIGHT;
            setPageSize(Math.max(1, Math.floor(rowArea / ROW_HEIGHT)));
        };

        // 첫 렌더에는 스타일이 아직 붙지 않아 높이를 덜 잡을 수 있어서 다음 프레임에 한 번 더 잰다.
        updatePageSize();
        const frame = requestAnimationFrame(updatePageSize);
        const observer = new ResizeObserver(updatePageSize);
        observer.observe(tableWrap);

        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
        };
    }, []);

    // 학생의 반은 반 목록의 studentIds에서 거꾸로 찾는다. 어느 반에도 없으면 미배정이다.
    const classByStudentId = useMemo(() => new Map(
        classes.flatMap((classItem) => classItem.studentIds.map((id) => [id, classItem])),
    ), []);

    const getClassLabel = (student) => classByStudentId.get(student.id)?.name ?? null;

    const filteredStudents = useMemo(() => {
        const keyword = searchTerm.trim().toLowerCase();
        const matches = students.filter((student) => {
            const studentClass = classByStudentId.get(student.id);
            return (yearFilter === 'all' || student.registrationYear === yearFilter)
                && (gradeFilter === 'all' || student.grade === gradeFilter)
                && (classFilter === 'all' || (classFilter === UNASSIGNED_CLASS
                    ? !studentClass
                    : String(studentClass?.id) === classFilter))
                && (!keyword || student.name.toLowerCase().includes(keyword));
        });

        return sortOrder === 'name'
            ? [...matches].sort((first, second) => first.name.localeCompare(second.name, 'ko'))
            : matches;
    }, [classByStudentId, classFilter, gradeFilter, searchTerm, sortOrder, students, yearFilter]);

    const totalPages = Math.max(1, Math.ceil(filteredStudents.length / pageSize));
    const currentPage = Math.min(page, totalPages);
    const pagedStudents = filteredStudents.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    // 조건이 바뀌면 결과 개수가 달라지므로 첫 페이지부터 다시 본다.
    const changeFilter = (setFilter) => (value) => {
        setFilter(value);
        setPage(1);
    };

    const visibleIds = pagedStudents.map((student) => student.id);
    const isAllSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));

    const toggleStudent = (studentId) => {
        setSelectedIds((current) => current.includes(studentId)
            ? current.filter((id) => id !== studentId)
            : [...current, studentId]);
    };

    const toggleAll = () => {
        setSelectedIds((current) => isAllSelected
            ? current.filter((id) => !visibleIds.includes(id))
            : [...new Set([...current, ...visibleIds])]);
    };

    const deleteSelectedStudents = () => {
        setStudents((current) => current.filter((student) => !selectedIds.includes(student.id)));
        setSelectedIds([]);
    };

    const registerStudent = (student) => {
        setStudents((current) => {
            const nextId = Math.max(...current.map((item) => item.id), 0) + 1;
            return [{
                id: nextId,
                registrationYear: student.registrationYear,
                grade: student.grade,
                name: student.name,
                studentId: `S${String(Date.now()).slice(-8)}`,
            }, ...current];
        });
        setIsRegistrationOpen(false);
    };

    const saveStudent = (updatedStudent) => {
        setStudents((current) => current.map((student) =>
            student.id === updatedStudent.id ? updatedStudent : student));
        setDetailStudent(null);
    };

    return (
        <section className="student-list" aria-labelledby="student-list-title">
            <header className="student-list__header">
                <div>
                    <h1 id="student-list-title">학생 목록</h1>
                    <p>등록 연도, 학년과 반별로 학생의 기본 정보를 관리합니다.</p>
                </div>
                <span className="student-list__count">검색 결과 <strong>{filteredStudents.length}</strong>명</span>
            </header>

            <StudentToolbar
                sortOrder={sortOrder}
                onSortChange={changeFilter(setSortOrder)}
                yearFilter={yearFilter}
                onYearFilterChange={changeFilter(setYearFilter)}
                students={students}
                gradeFilter={gradeFilter}
                onGradeFilterChange={changeFilter(setGradeFilter)}
                classFilter={classFilter}
                onClassFilterChange={changeFilter(setClassFilter)}
                classes={classes}
                searchTerm={searchTerm}
                onSearchTermChange={changeFilter(setSearchTerm)}
                onOpenBulkRegistration={() => setIsBulkRegistrationOpen(true)}
                onOpenRegistration={() => setIsRegistrationOpen(true)}
            />

            <StudentTable
                wrapRef={tableWrapRef}
                students={pagedStudents}
                selectedIds={selectedIds}
                getClassLabel={getClassLabel}
                onToggleAll={toggleAll}
                onToggleStudent={toggleStudent}
                onOpenDetail={setDetailStudent}
                onOpenStudentApp={(student) => navigate(`/student?student=${student.id}`)}
            />

            <div className="student-list__pagination" aria-label="페이지 이동">
                <button
                    type="button"
                    disabled={currentPage === 1}
                    aria-label="이전 페이지"
                    onClick={() => setPage(currentPage - 1)}
                >
                    <i className="bi bi-chevron-left" />
                </button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                    <button
                        key={pageNumber}
                        type="button"
                        className={pageNumber === currentPage ? 'student-list__pagination-current' : undefined}
                        aria-current={pageNumber === currentPage ? 'page' : undefined}
                        onClick={() => setPage(pageNumber)}
                    >
                        {pageNumber}
                    </button>
                ))}
                <button
                    type="button"
                    disabled={currentPage === totalPages}
                    aria-label="다음 페이지"
                    onClick={() => setPage(currentPage + 1)}
                >
                    <i className="bi bi-chevron-right" />
                </button>
            </div>

            <StudentSelectionBar
                selectedCount={selectedIds.length}
                onDelete={deleteSelectedStudents}
                onClear={() => setSelectedIds([])}
            />

            {isBulkRegistrationOpen && (
                <StudentBulkRegistrationModal
                    onClose={() => setIsBulkRegistrationOpen(false)}
                    onRegister={() => setIsBulkRegistrationOpen(false)}
                />
            )}

            {isRegistrationOpen && (
                <StudentRegistrationModal onClose={() => setIsRegistrationOpen(false)} onRegister={registerStudent} />
            )}
            {detailStudent && (
                <StudentDetailModal student={detailStudent} onClose={() => setDetailStudent(null)} onSave={saveStudent} />
            )}
        </section>
    );
}

export default StudentListPage;
