import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CustomSelect, SearchInput } from '../../../components/common/inputs';
import { libraryTypeLabels } from '../../../mocks/labels';
import { getLibraryWorksheets, removeLibraryWorksheet, updateLibraryWorksheet } from '../../../mocks/problemLibrary';
import AssignWorksheetModal from './components/AssignWorksheetModal';
import DeleteWorksheetModal from './components/DeleteWorksheetModal';
import LibraryTable from './components/LibraryTable';
import './ProblemLibraryPage.scss';
import './components/LibraryComponents.scss';

const tabs = [
    { value: 'all', label: '전체' },
    ...Object.entries(libraryTypeLabels).map(([value, label]) => ({ value, label })),
];
const gradeOptions = [{ value: 'all', label: '전체 학년' }, { value: 'middle-1', label: '1학년' }, { value: 'middle-2', label: '2학년' }, { value: 'middle-3', label: '3학년' }];
const termOptions = [{ value: 'all', label: '전체 학기' }, { value: 'first', label: '1학기' }, { value: 'second', label: '2학기' }];
const statusOptions = [{ value: 'all', label: '전체 출제 상태' }, { value: 'draft', label: '미출제' }, { value: 'assigned', label: '출제됨' }];

function ProblemLibraryPage() {
    const navigate = useNavigate();
    const [worksheets, setWorksheets] = useState(getLibraryWorksheets);
    const [tab, setTab] = useState('all');
    const [gradeId, setGradeId] = useState('all');
    const [term, setTerm] = useState('all');
    const [status, setStatus] = useState('all');
    const [search, setSearch] = useState('');
    const [assignTarget, setAssignTarget] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [notice, setNotice] = useState('');

    const filtered = useMemo(() => {
        const sourceWorksheets = new Map(worksheets.filter((worksheet) => worksheet.origin !== 'custom').map((worksheet) => [worksheet.id, worksheet]));
        const normalizedSearch = search.trim().toLowerCase();

        return worksheets.filter((worksheet) => {
            const sourceWorksheet = sourceWorksheets.get(worksheet.custom?.sourceWorksheetId);
            const sourceType = worksheet.origin === 'custom'
                ? sourceWorksheet?.type ?? worksheet.custom?.sourceType
                : worksheet.type;
            const assignmentState = worksheet.assignments.length ? 'assigned' : 'draft';
            const matchesTab = tab === 'all' || (tab === 'custom' ? worksheet.origin === 'custom' : sourceType === tab);
            const matchesSearch = worksheet.title.toLowerCase().includes(normalizedSearch)
                || (worksheet.origin === 'custom' && sourceWorksheet?.title.toLowerCase().includes(normalizedSearch));
            return matchesTab && (gradeId === 'all' || worksheet.gradeId === gradeId) && (term === 'all' || worksheet.term === term) && (status === 'all' || status === assignmentState) && matchesSearch;
        });
    }, [gradeId, search, status, tab, term, worksheets]);

    const duplicate = (worksheet) => navigate(`${worksheet.type === 'assessment' ? '/problems/comprehensive' : '/problems'}?from=${worksheet.id}`);
    const assign = (assignment) => {
        const today = new Date().toISOString().slice(0, 10).replaceAll('-', '.');
        updateLibraryWorksheet(assignTarget.id, (item) => ({ ...item, assignments: [...item.assignments, { ...assignment, assignedAt: today, status: 'ongoing' }] }));
        setWorksheets(getLibraryWorksheets());
        setNotice(`${assignTarget.title}을 출제했습니다.`);
        setAssignTarget(null);
    };
    const remove = () => { removeLibraryWorksheet(deleteTarget.id); setWorksheets(getLibraryWorksheets()); setNotice(`${deleteTarget.title}을 삭제했습니다.`); setDeleteTarget(null); };

    return <section className="problem-library-page" aria-labelledby="problem-library-title">
        <header className="problem-library-page__page-header"><div><h1 id="problem-library-title">문제 보관함</h1><p>생성한 학습지와 평가를 조회하고 출제하거나 복제해 재구성합니다.</p></div><span>검색 결과 <strong>{filtered.length}</strong>건</span></header>
        <div className="problem-library-page__toolbar"><div className="problem-library-page__tabs" role="tablist" aria-label="학습지 유형">{tabs.map((item) => <button type="button" role="tab" aria-selected={tab === item.value} className={`problem-library-page__tab${tab === item.value ? ' problem-library-page__tab--active' : ''}`} key={item.value} onClick={() => setTab(item.value)}>{item.label}</button>)}</div><div className="problem-library-page__filters"><CustomSelect label="학년 선택" value={gradeId} options={gradeOptions} onChange={setGradeId} width={120} /><CustomSelect label="학기 선택" value={term} options={termOptions} onChange={setTerm} width={112} /><CustomSelect label="출제 상태 선택" value={status} options={statusOptions} onChange={setStatus} width={140} /><SearchInput value={search} onChange={setSearch} placeholder="학습지 제목 검색" label="학습지 제목 검색" width={210} /></div></div>
        {notice && <p className="problem-library-page__notice" role="status"><i className="bi bi-check-circle-fill" aria-hidden="true" /> {notice}</p>}
        <section className="problem-library-page__content" aria-label="보관된 학습지">{filtered.length ? <LibraryTable key={`${tab}-${gradeId}-${term}-${status}-${search.trim()}`} worksheets={filtered} allWorksheets={worksheets} defaultExpandAll={tab === 'custom' || Boolean(search.trim())} onOpen={(id) => navigate(`/problems/library/${id}`)} onAssign={setAssignTarget} onDuplicate={duplicate} onDelete={setDeleteTarget} /> : <div className="problem-library-page__empty"><i className="bi bi-archive" aria-hidden="true" /><p>저장된 학습지가 없습니다.</p><span>문제 생성에서 만든 학습지가 여기에 보관됩니다.</span><Link to="/problems">문제 생성으로 이동</Link></div>}</section>
        {assignTarget && <AssignWorksheetModal worksheet={assignTarget} onClose={() => setAssignTarget(null)} onAssign={assign} />}
        {deleteTarget && <DeleteWorksheetModal worksheet={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={remove} />}
    </section>;
}

export default ProblemLibraryPage;
