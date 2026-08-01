import { useMemo, useState } from 'react';
import initialStudents from '../../mocks/students';
import StudentBulkRegistrationModal from './components/StudentBulkRegistrationModal';
import StudentDetailModal from './components/StudentDetailModal';
import StudentRegistrationModal from './components/StudentRegistrationModal';
import StudentSelectionBar from './components/StudentSelectionBar';
import StudentTable from './components/StudentTable';
import StudentToolbar from './components/StudentToolbar';
import './StudentListPage.scss';

function StudentListPage() {
    const [students, setStudents] = useState(initialStudents);
    const [selectedIds, setSelectedIds] = useState([]);
    const [yearFilter, setYearFilter] = useState('all');
    const [gradeFilter, setGradeFilter] = useState('all');
    const [sortOrder, setSortOrder] = useState('newest');
    const [searchTerm, setSearchTerm] = useState('');
    const [isBulkRegistrationOpen, setIsBulkRegistrationOpen] = useState(false);
    const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
    const [detailStudent, setDetailStudent] = useState(null);

    const filteredStudents = useMemo(() => {
        const keyword = searchTerm.trim().toLowerCase();
        const matches = students.filter((student) => {
            return (yearFilter === 'all' || student.registrationYear === yearFilter)
                && (gradeFilter === 'all' || student.grade === gradeFilter)
                && (!keyword || student.name.toLowerCase().includes(keyword));
        });

        return sortOrder === 'name'
            ? [...matches].sort((first, second) => first.name.localeCompare(second.name, 'ko'))
            : matches;
    }, [gradeFilter, searchTerm, sortOrder, students, yearFilter]);

    const visibleIds = filteredStudents.map((student) => student.id);
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
                phone: student.studentPhone || '-',
                studentId: `S${String(Date.now()).slice(-8)}`,
                attendanceNumber: student.attendanceNumber,
                parentPhone: student.parentPhone,
                birthDate: student.birthDate,
                email: student.email,
                address: student.address,
                homePhone: student.homePhone,
                note: student.note,
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
                    <p>등록 연도와 학년별로 학생의 기본 정보를 관리합니다.</p>
                </div>
                <span className="student-list__count">검색 결과 <strong>{filteredStudents.length}</strong>명</span>
            </header>

            <StudentToolbar
                sortOrder={sortOrder}
                onSortChange={setSortOrder}
                yearFilter={yearFilter}
                onYearFilterChange={setYearFilter}
                students={students}
                gradeFilter={gradeFilter}
                onGradeFilterChange={setGradeFilter}
                searchTerm={searchTerm}
                onSearchTermChange={setSearchTerm}
                onOpenBulkRegistration={() => setIsBulkRegistrationOpen(true)}
                onOpenRegistration={() => setIsRegistrationOpen(true)}
            />

            <StudentTable
                students={filteredStudents}
                selectedIds={selectedIds}
                onToggleAll={toggleAll}
                onToggleStudent={toggleStudent}
                onOpenDetail={setDetailStudent}
            />

            <div className="student-list__pagination" aria-label="페이지 이동">
                <button type="button" disabled aria-label="이전 페이지"><i className="bi bi-chevron-left" /></button>
                <button type="button" className="student-list__pagination-current" aria-current="page">1</button>
                <button type="button" disabled aria-label="다음 페이지"><i className="bi bi-chevron-right" /></button>
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
