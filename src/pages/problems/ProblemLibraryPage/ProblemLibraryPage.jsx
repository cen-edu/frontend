import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CustomSelect, SearchInput } from '../../../components/common/inputs';
import { libraryTypeLabels } from '../../../mocks/labels';
import AssignWorksheetModal from './components/AssignWorksheetModal';
import LibraryTable from './components/LibraryTable';
import {
    useDeleteWorksheetMutation,
    useProblemLibraryQuery,
} from './problemLibraryHooks.js';
import './ProblemLibraryPage.scss';
import './components/LibraryComponents.scss';

const tabs = [
    { value: 'all', label: '전체' },
    ...Object.entries(libraryTypeLabels).map(([value, label]) => ({ value, label })),
];
const gradeOptions = [{ value: 'all', label: '전체 학년' }, { value: 'middle-1', label: '1학년' }, { value: 'middle-2', label: '2학년' }, { value: 'middle-3', label: '3학년' }];
const termOptions = [{ value: 'all', label: '전체 학기' }, { value: 'first', label: '1학기' }, { value: 'second', label: '2학기' }, { value: 'common', label: '공통' }];
const statusOptions = [{ value: 'all', label: '전체 출제 상태' }, { value: 'draft', label: '미출제' }, { value: 'assigned', label: '출제됨' }];

function ProblemLibraryPage() {
    const navigate = useNavigate();
    const [tab, setTab] = useState('all');
    const [gradeId, setGradeId] = useState('all');
    const [term, setTerm] = useState('all');
    const [status, setStatus] = useState('all');
    const [search, setSearch] = useState('');
    const [assignTarget, setAssignTarget] = useState(null);
    const [notice, setNotice] = useState('');
    const [localAssignmentCounts, setLocalAssignmentCounts] = useState({});
    const worksheetsQuery = useProblemLibraryQuery({ tab, gradeId, semester: term, q: search });
    const deleteWorksheetMutation = useDeleteWorksheetMutation();
    const worksheets = useMemo(() => (worksheetsQuery.data ?? []).map((worksheet) => ({
            ...worksheet,
            assignmentCount: localAssignmentCounts[worksheet.id] ?? worksheet.assignmentCount,
        })), [localAssignmentCounts, worksheetsQuery.data]);

    const filtered = useMemo(() => {
        return worksheets.filter((worksheet) => {
            const assignmentState = worksheet.assignmentCount > 0 ? 'assigned' : 'draft';
            return status === 'all' || status === assignmentState;
        });
    }, [status, worksheets]);

    const duplicate = (worksheet) => navigate(`${worksheet.type === 'assessment' ? '/problems/comprehensive' : '/problems'}?from=${worksheet.id}`);
    const assign = () => {
        setLocalAssignmentCounts((current) => ({
            ...current,
            [assignTarget.id]: (current[assignTarget.id] ?? assignTarget.assignmentCount) + 1,
        }));
        setNotice(`${assignTarget.title}을 출제했습니다.`);
        setAssignTarget(null);
    };
    const remove = (worksheet) => {
        const confirmed = window.confirm(
            `${worksheet.title}을 삭제하시겠습니까?\n삭제한 학습지는 복구할 수 없습니다.`,
        );

        if (!confirmed) return;

        setNotice('');
        deleteWorksheetMutation.mutate(worksheet.id, {
            onError: (mutationError) => {
                window.alert(
                    mutationError?.message || '학습지를 삭제하지 못했습니다.',
                );
            },
        });
    };

    const emptyContent = worksheetsQuery.isPending
        ? <div className="problem-library-page__empty"><i className="bi bi-arrow-repeat" aria-hidden="true" /><p>학습지 목록을 불러오는 중입니다.</p></div>
        : worksheetsQuery.isError
            ? <div className="problem-library-page__empty"><i className="bi bi-exclamation-circle" aria-hidden="true" /><p>학습지 목록을 불러오지 못했습니다.</p><span>{worksheetsQuery.error?.message}</span><button type="button" onClick={() => worksheetsQuery.refetch()}>다시 시도</button></div>
            : <div className="problem-library-page__empty"><i className="bi bi-archive" aria-hidden="true" /><p>저장된 학습지가 없습니다.</p><span>문제 생성에서 만든 학습지가 여기에 보관됩니다.</span><Link to="/problems">문제 생성으로 이동</Link></div>;

    return <section className="problem-library-page" aria-labelledby="problem-library-title">
        <header className="problem-library-page__page-header"><div><h1 id="problem-library-title">문제 보관함</h1><p>생성한 학습지와 평가를 조회하고 출제하거나 복제해 재구성합니다.</p></div><span>검색 결과 <strong>{filtered.length}</strong>건</span></header>
        <div className="problem-library-page__toolbar"><div className="problem-library-page__tabs" role="tablist" aria-label="학습지 유형">{tabs.map((item) => <button type="button" role="tab" aria-selected={tab === item.value} className={`problem-library-page__tab${tab === item.value ? ' problem-library-page__tab--active' : ''}`} key={item.value} onClick={() => setTab(item.value)}>{item.label}</button>)}</div><div className="problem-library-page__filters"><CustomSelect label="학년 선택" value={gradeId} options={gradeOptions} onChange={setGradeId} width={120} /><CustomSelect label="학기 선택" value={term} options={termOptions} onChange={setTerm} width={112} /><CustomSelect label="출제 상태 선택" value={status} options={statusOptions} onChange={setStatus} width={140} /><SearchInput value={search} onChange={setSearch} placeholder="학습지 제목 검색" label="학습지 제목 검색" width={210} /></div></div>
        {notice && <p className="problem-library-page__notice" role="status"><i className="bi bi-check-circle-fill" aria-hidden="true" /> {notice}</p>}
        <section className="problem-library-page__content" aria-label="보관된 학습지">{filtered.length ? <LibraryTable key={`${tab}-${gradeId}-${term}-${status}-${search.trim()}`} worksheets={filtered} allWorksheets={worksheets} defaultExpandAll={tab === 'custom' || Boolean(search.trim())} onOpen={(id) => navigate(`/problems/library/${id}`)} onAssign={setAssignTarget} onDuplicate={duplicate} onDelete={remove} deleteDisabled={deleteWorksheetMutation.isPending} /> : emptyContent}</section>
        {assignTarget && <AssignWorksheetModal worksheet={assignTarget} onClose={() => setAssignTarget(null)} onAssign={assign} />}
    </section>;
}

export default ProblemLibraryPage;
