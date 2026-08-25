import { useMemo, useState } from 'react';
import StudentSelectionBar from './components/StudentSelectionBar';
import StudentTable from './components/StudentTable';
import StudentToolbar from './components/StudentToolbar';
import StudentBulkRegistrationModal from './components/StudentBulkRegistrationModal';
import {
    useStudentsQuery,
    useCreateStudentMutation,
    useCreateStudentsBulkMutation,
    useDeleteStudentsMutation,
    useResetStudentPasswordMutation,
    useStudentDetailQuery,
} from './studentHooks.js';
import './StudentListPage.scss';
import StudentRegistrationModal from './components/StudentRegistrationModal';
import StudentDetailModal from './components/StudentDetailModal';
import { useDialog } from '../../../components/common/feedback';


const PAGE_SIZE = 10;

function StudentListPage() {
    const { alert, confirm } = useDialog();
    const [selectedIds, setSelectedIds] = useState([]);
    const [yearFilter, setYearFilter] = useState('all');
    const [gradeFilter, setGradeFilter] = useState('all');
    const [classFilter, setClassFilter] = useState('all');
    const [sortOrder, setSortOrder] = useState('newest');
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [isBulkRegistrationOpen, setIsBulkRegistrationOpen] = useState(false);
    const [bulkRegistrationError, setBulkRegistrationError] = useState('');
    const [detailStudentId, setDetailStudentId] = useState(null);

    const queryParams = {
        registrationYear: yearFilter === 'all' ? undefined : Number(yearFilter),
        grade: gradeFilter === 'all' ? undefined : Number(gradeFilter),
        classId: classFilter === 'all' ? undefined : Number(classFilter),
        keyword: searchTerm.trim() || undefined,
        // 최신 등록순은 서버 기본값을 사용한다. 이름순 enum 값은 백엔드 StudentSort와 맞춰야 한다.
        sort: sortOrder === 'newest' ? undefined : sortOrder,
        page: page - 1,
        size: PAGE_SIZE,
    };

    const { data, isPending, isError, error } = useStudentsQuery(queryParams);
    const students = data?.students ?? [];
    const totalElements = data?.totalElements ?? 0;
    const totalPages = data?.totalPages ?? 0;
    const currentPage = (data?.page ?? page - 1) + 1;
    const studentDetailQuery = useStudentDetailQuery(detailStudentId);
    const resetStudentPasswordMutation = useResetStudentPasswordMutation();

    // 별도 반 목록 API가 연결되기 전에는 현재 조회 결과에 포함된 반만 필터 옵션으로 노출한다.
    const classes = useMemo(() => {
        const classMap = new Map();

        students.forEach((student) => {
            student.classes?.forEach((classItem) => classMap.set(classItem.id, classItem));
        });

        return [...classMap.values()];
    }, [students]);

    const getClassLabel = (student) => student.classes
        ?.map(({ name }) => name)
        .join(', ') || null;

    // 조건이 바뀌면 결과 개수가 달라지므로 첫 페이지부터 다시 본다.
    const changeFilter = (setFilter) => (value) => {
        setFilter(value);
        setPage(1);
        setSelectedIds([]);
    };

    const visibleIds = students.map((student) => student.id);
    const isAllSelected = visibleIds.length > 0
        && visibleIds.every((id) => selectedIds.includes(id));

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

    const emptyMessage = isPending
        ? '학생 목록을 불러오는 중입니다.'
        : isError
            ? error?.message || '학생 목록을 불러오지 못했습니다.'
            : '검색 조건에 맞는 학생이 없습니다.';

    const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
    const createStudentMutation = useCreateStudentMutation();
    const createStudentsBulkMutation = useCreateStudentsBulkMutation();

    const handleOpenBulkRegistration = () => {
        setBulkRegistrationError('');
        setIsBulkRegistrationOpen(true);
    };

    const handleCloseBulkRegistration = () => {
        if (createStudentsBulkMutation.isPending) return;

        setBulkRegistrationError('');
        setIsBulkRegistrationOpen(false);
    };

    const handleBulkRegister = async (file) => {
        setBulkRegistrationError('');

        try {
            const result = await createStudentsBulkMutation.mutateAsync(file);

            setIsBulkRegistrationOpen(false);
            setPage(1);
            setSelectedIds([]);
            alert({
                title: '학생 일괄 등록 완료',
                message: `${result.createdCount}명의 학생을 등록했습니다.`,
                tone: 'success',
            });
        } catch (mutationError) {
            setBulkRegistrationError(
                mutationError?.message || '학생 일괄 등록에 실패했습니다.',
            );
        }
    };

    const handleRegisterStudent = (values) => {
        createStudentMutation.mutate({
            name: values.name.trim(),
            registrationYear: Number(values.registrationYear),
            grade: Number(values.grade),
        }, {
            onSuccess: (student) => {
                setIsRegistrationOpen(false);
                setPage(1);
                setSelectedIds([]);

                alert({
                    title: '학생 등록 완료',
                    message: `${student.name} 학생이 등록되었습니다.\n로그인 아이디: ${student.loginId}`,
                    tone: 'success',
                });
            },
            onError: (mutationError) => {
                alert({
                    title: '학생을 등록하지 못했습니다',
                    message: mutationError?.message || '학생을 등록하지 못했습니다.',
                    tone: 'danger',
                });
            },
        });
    };

    const deleteStudentsMutation = useDeleteStudentsMutation();

    const handleDeleteStudents = async () => {
        const selectedCount = selectedIds.length;

        if (selectedCount === 0) return;

        const confirmed = await confirm({
            title: '학생 삭제',
            message: `선택한 학생 ${selectedCount}명을 삭제하시겠습니까?\n삭제한 학생은 복구할 수 없습니다.`,
            confirmText: '삭제하기',
            tone: 'danger',
        });

        if (!confirmed) return;

        deleteStudentsMutation.mutate(selectedIds, {
            onSuccess: () => {
                setSelectedIds([]);

                // 현재 페이지의 학생을 전부 삭제했다면 이전 페이지로 이동
                if (selectedCount === students.length && page > 1) {
                    setPage((current) => current - 1);
                }

                alert({
                    title: '학생 삭제 완료',
                    message: `학생 ${selectedCount}명이 삭제되었습니다.`,
                    tone: 'success',
                });
            },
            onError: (mutationError) => {
                setSelectedIds([]);
                alert({
                    title: '학생을 삭제하지 못했습니다',
                    message: mutationError?.message
                        || '일부 학생을 삭제하지 못했습니다. 학생 목록을 확인해주세요.',
                    tone: 'danger',
                });
            },
        });
    };

    const handleCloseDetail = () => {
        if (resetStudentPasswordMutation.isPending) return;

        setDetailStudentId(null);
        resetStudentPasswordMutation.reset();
    };

    const handleResetPassword = async () => {
        if (!detailStudentId) return;

        const confirmed = await confirm({
            title: '학생 비밀번호 초기화',
            message: '이 학생의 비밀번호를 초기화하시겠습니까?',
            confirmText: '초기화하기',
            tone: 'warning',
        });

        if (!confirmed) return;

        resetStudentPasswordMutation.mutate(detailStudentId);
    };

    return (
        <section className="student-list" aria-labelledby="student-list-title">
            <header className="student-list__header">
                <div>
                    <h1 id="student-list-title">학생 목록</h1>
                    <p>등록 연도, 학년과 반별로 학생의 기본 정보를 관리합니다.</p>
                </div>
                <span className="student-list__count">검색 결과 <strong>{totalElements}</strong>명</span>
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
                onOpenBulkRegistration={handleOpenBulkRegistration}
                onOpenRegistration={() => setIsRegistrationOpen(true)}
            />

            <StudentTable
                students={students}
                selectedIds={selectedIds}
                getClassLabel={getClassLabel}
                onToggleAll={toggleAll}
                onToggleStudent={toggleStudent}
                onOpenDetail={(student) => setDetailStudentId(student.id)}
                emptyMessage={emptyMessage}
            />

            <div className="student-list__pagination" aria-label="페이지 이동">
                <button
                    type="button"
                    disabled={data?.first ?? currentPage <= 1}
                    aria-label="이전 페이지"
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
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
                    disabled={data?.last ?? true}
                    aria-label="다음 페이지"
                    onClick={() => setPage((current) => current + 1)}
                >
                    <i className="bi bi-chevron-right" />
                </button>
            </div>

            <StudentSelectionBar
                selectedCount={selectedIds.length}
                onDelete={handleDeleteStudents}
                onClear={() => setSelectedIds([])}
                deleteDisabled={deleteStudentsMutation.isPending}
            />

            {isBulkRegistrationOpen && (
                <StudentBulkRegistrationModal
                    onClose={handleCloseBulkRegistration}
                    onRegister={handleBulkRegister}
                    onErrorClear={() => setBulkRegistrationError('')}
                    isPending={createStudentsBulkMutation.isPending}
                    error={bulkRegistrationError}
                />
            )}

            {isRegistrationOpen && (
                <StudentRegistrationModal
                    onClose={() => {
                        if (!createStudentMutation.isPending) {
                            setIsRegistrationOpen(false);
                        }
                    }}
                    onRegister={handleRegisterStudent}
                    isPending={createStudentMutation.isPending}
                />
            )}

            {detailStudentId && (
                <StudentDetailModal
                    student={studentDetailQuery.data}
                    isPending={studentDetailQuery.isPending}
                    error={studentDetailQuery.error}
                    onRetry={() => studentDetailQuery.refetch()}
                    onClose={handleCloseDetail}
                    onResetPassword={handleResetPassword}
                    isPasswordResetPending={resetStudentPasswordMutation.isPending}
                    isPasswordResetSuccess={resetStudentPasswordMutation.isSuccess}
                    passwordResetError={resetStudentPasswordMutation.error}
                />
            )}
        </section>
    );
}

export default StudentListPage;
