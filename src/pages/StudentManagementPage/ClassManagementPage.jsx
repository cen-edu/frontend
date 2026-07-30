import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import initialClasses from '../../mocks/classes';
import ClassSelectionBar from './components/ClassSelectionBar';
import ClassTable from './components/ClassTable';
import ClassToolbar from './components/ClassToolbar';
import './ClassManagementPage.scss';

function ClassManagementPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [classes, setClasses] = useState(() => location.state?.classes ?? initialClasses);
    const [selectedIds, setSelectedIds] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredClasses = useMemo(() => {
        const keyword = searchTerm.trim().toLowerCase();
        return keyword
            ? classes.filter((classItem) => classItem.name.toLowerCase().includes(keyword))
            : classes;
    }, [classes, searchTerm]);

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
        setClasses((current) => {
            const currentIndex = current.findIndex(({ id }) => id === classId);
            const targetIndex = currentIndex + offset;
            if (currentIndex < 0 || targetIndex < 0 || targetIndex >= current.length) return current;
            const next = [...current];
            [next[currentIndex], next[targetIndex]] = [next[targetIndex], next[currentIndex]];
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

    return (
        <section className="class-management" aria-label="반 관리">
            <ClassToolbar
                searchTerm={searchTerm}
                onSearchTermChange={setSearchTerm}
                onOpenCreate={() => navigate('/students/classes/new', { state: { classes } })}
            />
            <ClassTable
                classes={filteredClasses}
                selectedIds={selectedIds}
                onToggleAll={toggleAll}
                onToggleClass={toggleClass}
                onOpenDetail={(classItem) => navigate(`/students/classes/${classItem.id}/edit`, { state: { classes } })}
                onMoveClass={moveClass}
                onReorderClass={reorderClass}
            />
            <ClassSelectionBar
                selectedCount={selectedIds.length}
                onDelete={deleteSelectedClasses}
                onClear={() => setSelectedIds([])}
            />
        </section>
    );
}

export default ClassManagementPage;
