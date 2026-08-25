import { useDeferredValue, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTeacherAccount } from '../../../api/teachers/teacherAccountApi';
import ClassFormModal from './components/ClassFormModal';
import ClassSelectionBar from './components/ClassSelectionBar';
import ClassTable from './components/ClassTable';
import ClassToolbar from './components/ClassToolbar';
import {
    useClassesQuery,
    useDeleteClassesMutation,
    useUpdateClassOrderMutation,
} from './classHooks';
import { useDialog } from '../../../components/common/feedback';
import './ClassManagementPage.scss';

const ALL_FILTER = 'all';

const sortClasses = (classes) => [...classes].sort((first, second) => (
    first.displayOrder - second.displayOrder
));

const reorderClassIds = (classes, sourceId, targetId, position) => {
    const orderedIds = sortClasses(classes).map(({ id }) => id);
    const sourceIndex = orderedIds.indexOf(sourceId);
    if (sourceIndex < 0) return orderedIds;

    const nextIds = [...orderedIds];
    nextIds.splice(sourceIndex, 1);
    const targetIndex = nextIds.indexOf(targetId);
    if (targetIndex < 0) return orderedIds;

    nextIds.splice(position === 'after' ? targetIndex + 1 : targetIndex, 0, sourceId);
    return nextIds;
};

function ClassManagementPage() {
    const { confirm } = useDialog();
    const [selectedIds, setSelectedIds] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [yearFilter, setYearFilter] = useState(ALL_FILTER);
    const [gradeFilter, setGradeFilter] = useState(ALL_FILTER);
    const [classForm, setClassForm] = useState(null);
    const [operationError, setOperationError] = useState('');
    const deferredSearchTerm = useDeferredValue(searchTerm);

    const allClassesQuery = useClassesQuery();
    const classesQuery = useClassesQuery({
        academicYear: yearFilter === ALL_FILTER ? undefined : yearFilter,
        grade: gradeFilter === ALL_FILTER ? undefined : gradeFilter,
        keyword: deferredSearchTerm,
    });
    const accountQuery = useQuery({
        queryKey: ['teacher', 'account'],
        queryFn: ({ signal }) => getTeacherAccount({ signal }),
    });
    const deleteMutation = useDeleteClassesMutation();
    const orderMutation = useUpdateClassOrderMutation();

    const allClasses = useMemo(
        () => sortClasses(allClassesQuery.data ?? []),
        [allClassesQuery.data],
    );
    const classes = useMemo(
        () => sortClasses(classesQuery.data ?? []),
        [classesQuery.data],
    );

    const yearOptions = useMemo(() => [
        { value: ALL_FILTER, label: '전체 학년도' },
        ...[...new Set(allClasses.map(({ academicYear }) => String(academicYear)))]
            .sort((first, second) => Number(second) - Number(first))
            .map((academicYear) => ({
                value: academicYear,
                label: `${academicYear}학년도`,
            })),
    ], [allClasses]);

    const gradeOptions = useMemo(() => [
        { value: ALL_FILTER, label: '전체 학년' },
        ...[...new Set(allClasses
            .filter(({ academicYear }) => (
                yearFilter === ALL_FILTER || String(academicYear) === yearFilter
            ))
            .map(({ grade }) => String(grade)))]
            .sort((first, second) => Number(first) - Number(second))
            .map((grade) => ({ value: grade, label: `${grade}학년` })),
    ], [allClasses, yearFilter]);

    const changeYearFilter = (academicYear) => {
        setYearFilter(academicYear);
        setGradeFilter(ALL_FILTER);
    };

    const toggleAll = () => {
        const visibleIds = classes.map(({ id }) => id);
        const isAllSelected = visibleIds.length > 0
            && visibleIds.every((id) => selectedIds.includes(id));

        setSelectedIds((current) => (
            isAllSelected
                ? current.filter((id) => !visibleIds.includes(id))
                : [...new Set([...current, ...visibleIds])]
        ));
    };

    const toggleClass = (classId) => {
        setSelectedIds((current) => (
            current.includes(classId)
                ? current.filter((id) => id !== classId)
                : [...current, classId]
        ));
    };

    const deleteSelectedClasses = async () => {
        const confirmed = await confirm({
            title: '반 삭제',
            message: `선택한 반 ${selectedIds.length}개를 삭제하시겠습니까?`,
            confirmText: '삭제하기',
            tone: 'danger',
        });
        if (!confirmed) return;

        setOperationError('');
        deleteMutation.mutate(
            { classIds: selectedIds },
            {
                onSuccess: () => setSelectedIds([]),
                onError: (error) => setOperationError(
                    error?.message || '선택한 반을 삭제하지 못했습니다.',
                ),
            },
        );
    };

    const reorderClasses = (sourceId, targetId, position) => {
        if (orderMutation.isPending || allClassesQuery.isFetching || deleteMutation.isPending) return;

        setOperationError('');
        orderMutation.mutate(
            { classIds: reorderClassIds(allClasses, sourceId, targetId, position) },
            {
                onError: (error) => setOperationError(
                    error?.message || '반 순서를 변경하지 못했습니다.',
                ),
            },
        );
    };

    const moveClass = (classId, offset) => {
        const visibleIndex = classes.findIndex(({ id }) => id === classId);
        const targetClass = classes[visibleIndex + offset];
        if (!targetClass) return;

        reorderClasses(classId, targetClass.id, offset > 0 ? 'after' : 'before');
    };

    const listError = classesQuery.error || allClassesQuery.error;
    const isListPending = classesQuery.isPending || allClassesQuery.isPending;
    const isOrderUnavailable = orderMutation.isPending
        || allClassesQuery.isFetching
        || deleteMutation.isPending;

    return (
        <section className="class-management" aria-labelledby="class-management-title">
            <header className="class-management__header">
                <div>
                    <h1 id="class-management-title">반 관리</h1>
                    <p>목록 순서는 수업과 수업 준비 화면에도 동일하게 반영됩니다.</p>
                </div>
                <span className="class-management__count">
                    검색 결과 <strong>{classesQuery.isPending ? '-' : classes.length}</strong>개
                </span>
            </header>

            <ClassToolbar
                yearFilter={yearFilter}
                yearOptions={yearOptions}
                onYearFilterChange={changeYearFilter}
                gradeFilter={gradeFilter}
                gradeOptions={gradeOptions}
                onGradeFilterChange={setGradeFilter}
                searchTerm={searchTerm}
                onSearchTermChange={setSearchTerm}
                onOpenCreate={() => setClassForm({ mode: 'create' })}
            />

            {isListPending && (
                <div className="class-management__request-state" role="status">
                    반 목록을 불러오는 중입니다.
                </div>
            )}
            {listError && (
                <div className="class-management__request-state class-management__request-state--error" role="alert">
                    <span>{listError?.message || '반 목록을 불러오지 못했습니다.'}</span>
                    <button
                        type="button"
                        onClick={() => {
                            allClassesQuery.refetch();
                            classesQuery.refetch();
                        }}
                        disabled={allClassesQuery.isFetching || classesQuery.isFetching}
                    >
                        다시 불러오기
                    </button>
                </div>
            )}
            {!isListPending && !listError && (
                <ClassTable
                    classes={classes}
                    selectedIds={selectedIds}
                    teacherName={accountQuery.data?.name}
                    onToggleAll={toggleAll}
                    onToggleClass={toggleClass}
                    onOpenDetail={(classItem) => setClassForm({ mode: 'detail', classItem })}
                    onMoveClass={moveClass}
                    onReorderClass={reorderClasses}
                    reorderDisabled={isOrderUnavailable}
                />
            )}

            {operationError && (
                <p className="class-management__operation-error" role="alert">{operationError}</p>
            )}

            <ClassSelectionBar
                selectedCount={selectedIds.length}
                onDelete={deleteSelectedClasses}
                onClear={() => setSelectedIds([])}
                isDeleting={deleteMutation.isPending}
            />

            {classForm && (
                <ClassFormModal
                    initialClass={classForm.classItem}
                    onClose={() => setClassForm(null)}
                    onSaved={() => setClassForm(null)}
                />
            )}
        </section>
    );
}

export default ClassManagementPage;
