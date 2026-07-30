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
    const [schoolLevel, setSchoolLevel] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortOrder, setSortOrder] = useState('newest');
    const [searchTerm, setSearchTerm] = useState('');
    const [isBulkRegistrationOpen, setIsBulkRegistrationOpen] = useState(false);
    const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
    const [detailStudent, setDetailStudent] = useState(null);

    const filteredStudents = useMemo(() => {
        const keyword = searchTerm.trim().toLowerCase();
        const matches = students.filter((student) => {
            const level = student.grade.startsWith('초') ? 'elementary' : student.grade.startsWith('중') ? 'middle' : 'high';
            return (schoolLevel === 'all' || schoolLevel === level)
                && (statusFilter === 'all' || student.status === statusFilter)
                && (!keyword || student.name.toLowerCase().includes(keyword));
        });

        return sortOrder === 'name'
            ? [...matches].sort((first, second) => first.name.localeCompare(second.name, 'ko'))
            : matches;
    }, [schoolLevel, searchTerm, sortOrder, statusFilter, students]);

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

    const changeSelectedStatus = (status) => {
        setStudents((current) => current.map((student) =>
            selectedIds.includes(student.id) ? { ...student, status } : student));
        setSelectedIds([]);
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
                grade: student.grade,
                status: 'active',
                name: student.name,
                phone: student.studentPhone || '-',
                studentId: `S${String(Date.now()).slice(-8)}`,
                attendanceNumber: student.attendanceNumber,
                parentPhone: student.parentPhone,
                school: student.school,
                classStartDate: student.classStartDate,
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
        <section className="student-list" aria-label="학생 목록">
            <StudentToolbar
                sortOrder={sortOrder}
                onSortChange={setSortOrder}
                schoolLevel={schoolLevel}
                onSchoolLevelChange={setSchoolLevel}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
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
                onChangeStatus={changeSelectedStatus}
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
