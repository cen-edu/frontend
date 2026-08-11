import { useMemo, useState } from 'react';
import initialClasses from '../../../mocks/classes';
import ClassFormModal from './components/ClassFormModal';
import ClassSelectionBar from './components/ClassSelectionBar';
import ClassTable from './components/ClassTable';
import ClassToolbar from './components/ClassToolbar';
import { formatClassLabel } from './classFormConfig';
import './ClassManagementPage.scss';

function ClassManagementPage() {
    const [classes, setClasses] = useState(initialClasses);
    const [selectedIds, setSelectedIds] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [yearFilter, setYearFilter] = useState('all');
    const [gradeFilter, setGradeFilter] = useState('all');
    const [classForm, setClassForm] = useState(null);

    const yearOptions = useMemo(() => [
        { value: 'all', label: '전체 학년도' },
        ...[...new Set(classes.map(({ year }) => year))]
            .sort((first, second) => Number(second) - Number(first))
            .map((year) => ({ value: year, label: `${year}학년도` })),
    ], [classes]);

    const gradeOptions = useMemo(() => [
        { value: 'all', label: '전체 학년' },
        ...[...new Set(classes
            .filter(({ year }) => yearFilter === 'all' || year === yearFilter)
            .map(({ grade }) => grade))]
            .sort((first, second) => Number(first) - Number(second))
            .map((grade) => ({ value: grade, label: `${grade}학년` })),
    ], [classes, yearFilter]);

    const filteredClasses = useMemo(() => {
        const keyword = searchTerm.trim().toLowerCase();
        return classes.filter((classItem) => (yearFilter === 'all' || classItem.year === yearFilter)
            && (gradeFilter === 'all' || classItem.grade === gradeFilter)
            && (!keyword || formatClassLabel(classItem).toLowerCase().includes(keyword)));
    }, [classes, gradeFilter, searchTerm, yearFilter]);

    const changeYearFilter = (year) => {
        setYearFilter(year);
        setGradeFilter('all');
    };

    const toggleAll = () => {
        const visibleIds = filteredClasses.map(({ id }) => id);
        const isAllSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));
        setSelectedIds((current) => isAllSelected
            ? current.filter((id) => !visibleIds.includes(id))
            : [...new Set([...current, ...visibleIds])]);
    };

    const toggleClass = (classId) => {
        setSelectedIds((current) => current.includes(classId)
            ? current.filter((id) => id !== classId)
            : [...current, classId]);
    };

    const deleteSelectedClasses = () => {
        setClasses((current) => current.filter(({ id }) => !selectedIds.includes(id)));
        setSelectedIds([]);
    };

    const moveClass = (classId, offset) => {
        const visibleIds = filteredClasses.map(({ id }) => id);
        const visibleIndex = visibleIds.indexOf(classId);
        const targetId = visibleIds[visibleIndex + offset];
        if (targetId === undefined) return;

        setClasses((current) => {
            const currentIndex = current.findIndex(({ id }) => id === classId);
            if (currentIndex < 0) return current;
            const next = [...current];
            const [movedClass] = next.splice(currentIndex, 1);
            const targetIndex = next.findIndex(({ id }) => id === targetId);
            if (targetIndex < 0) return current;
            next.splice(offset > 0 ? targetIndex + 1 : targetIndex, 0, movedClass);
            return next;
        });
    };

    const reorderClass = (sourceId, targetId, position) => {
        setClasses((current) => {
            const sourceIndex = current.findIndex(({ id }) => id === sourceId);
            if (sourceIndex < 0) return current;

            const next = [...current];
            const [movedClass] = next.splice(sourceIndex, 1);
            const targetIndex = next.findIndex(({ id }) => id === targetId);
            if (targetIndex < 0) return current;
            next.splice(position === 'after' ? targetIndex + 1 : targetIndex, 0, movedClass);
            return next;
        });
    };

    const saveClass = (classItem) => {
        if (classItem.id) {
            setClasses((current) => current.map((item) => item.id === classItem.id ? classItem : item));
        } else {
            setClasses((current) => {
                const nextId = Math.max(...current.map(({ id }) => id), 0) + 1;
                return [...current, { ...classItem, id: nextId }];
            });
        }
        setClassForm(null);
    };

    return (
        <section className="class-management" aria-labelledby="class-management-title">
            <header className="class-management__header">
                <div>
                    <h1 id="class-management-title">반 관리</h1>
                    <p>목록 순서는 수업과 수업 준비 화면에도 동일하게 반영됩니다.</p>
                </div>
                <span className="class-management__count">검색 결과 <strong>{filteredClasses.length}</strong>개</span>
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
            <ClassTable
                classes={filteredClasses}
                selectedIds={selectedIds}
                onToggleAll={toggleAll}
                onToggleClass={toggleClass}
                onOpenDetail={(classItem) => setClassForm({ mode: 'detail', classItem })}
                onMoveClass={moveClass}
                onReorderClass={reorderClass}
            />
            <ClassSelectionBar
                selectedCount={selectedIds.length}
                onDelete={deleteSelectedClasses}
                onClear={() => setSelectedIds([])}
            />
            {classForm && (
                <ClassFormModal
                    initialClass={classForm.classItem}
                    onClose={() => setClassForm(null)}
                    onSave={saveClass}
                />
            )}
        </section>
    );
}

export default ClassManagementPage;
