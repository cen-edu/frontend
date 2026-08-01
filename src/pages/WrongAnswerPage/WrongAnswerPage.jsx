import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AssignmentPeriodFilter from '../../components/common/AssignmentPeriodFilter/AssignmentPeriodFilter';
import CustomSelect from '../../components/common/CustomSelect/CustomSelect';
import SearchInput from '../../components/common/SearchInput/SearchInput';
import { wrongAnswerFilterOptions, wrongAnswerStudents, wrongAnswerWorksheets } from '../../mocks/wrongAnswer';
import { getDefaultAssignmentDateRange, isAssignedWithinPeriod } from '../../utils/assignmentPeriod';
import AssignReviewModal from './components/AssignReviewModal';
import ExplanationPanel from './components/ExplanationPanel';
import ReviewProgressTable from './components/ReviewProgressTable';
import WrongAnswerWorksheetList from './components/WrongAnswerWorksheetList';
import WrongQuestionList from './components/WrongQuestionList';
import './WrongAnswerPage.scss';
import './components/WrongAnswerComponents.scss';

const statusTabs = [{ value: 'all', label: '전체' }, { value: 'none', label: '미배정' }, { value: 'reviewing', label: '복습 중' }, { value: 'done', label: '완료' }];

function WrongAnswerPage() {
    const [searchParams] = useSearchParams();
    const requestedWorksheetId = searchParams.get('worksheet');
    const requestedStudents = (searchParams.get('students') ?? '').split(',').map(Number).filter(Number.isFinite);
    const requestedConcept = searchParams.get('concept');
    const initialWorksheet = wrongAnswerWorksheets.find((worksheet) => worksheet.id === requestedWorksheetId) ?? wrongAnswerWorksheets[0];
    const [worksheets, setWorksheets] = useState(wrongAnswerWorksheets);
    const initialDateRange = useMemo(getDefaultAssignmentDateRange, []);
    const [classId, setClassId] = useState(initialWorksheet.classId);
    const [period, setPeriod] = useState('all');
    const [customStartDate, setCustomStartDate] = useState(initialDateRange.startDate);
    const [customEndDate, setCustomEndDate] = useState(initialDateRange.endDate);
    const [status, setStatus] = useState('all');
    const [search, setSearch] = useState('');
    const [selectedId, setSelectedId] = useState(initialWorksheet.id);
    const initialItems = initialWorksheet.wrongItems.filter((item) => item.explanationReady && (!requestedConcept || item.conceptId === requestedConcept) && (!requestedStudents.length || item.wrongStudentIds.some((id) => requestedStudents.includes(id))));
    const [selectedItemIds, setSelectedItemIds] = useState(initialItems.map((item) => item.id));
    const [selectedStudentIds, setSelectedStudentIds] = useState([]);
    const [assignOpen, setAssignOpen] = useState(Boolean(requestedWorksheetId && requestedStudents.length && initialItems.length));
    const [panelItemId, setPanelItemId] = useState(null);
    const previousWorksheetId = useRef(selectedId);

    const filteredWorksheets = useMemo(() => worksheets.filter((worksheet) =>
        (classId === 'all' || worksheet.classId === classId)
        && isAssignedWithinPeriod(worksheet.assignedAt, period, customStartDate, customEndDate)
        && (status === 'all' || worksheet.assignStatus === status)
        && (!search.trim() || worksheet.title.toLowerCase().includes(search.trim().toLowerCase()))), [classId, customEndDate, customStartDate, period, search, status, worksheets]);
    useEffect(() => { if (!filteredWorksheets.some((worksheet) => worksheet.id === selectedId)) setSelectedId(filteredWorksheets[0]?.id ?? ''); }, [filteredWorksheets, selectedId]);
    useEffect(() => { if (previousWorksheetId.current !== selectedId) { setSelectedItemIds([]); setSelectedStudentIds([]); setPanelItemId(null); previousWorksheetId.current = selectedId; } }, [selectedId]);

    const worksheet = worksheets.find((item) => item.id === selectedId);
    const selectedItems = worksheet?.wrongItems.filter((item) => selectedItemIds.includes(item.id)) ?? [];
    const panelItem = worksheet?.wrongItems.find((item) => item.id === panelItemId);
    const toggleItem = (itemId) => setSelectedItemIds((current) => current.includes(itemId) ? current.filter((id) => id !== itemId) : [...current, itemId]);
    const toggleAllItems = () => { const ids = worksheet.wrongItems.filter((item) => item.explanationReady).map((item) => item.id); setSelectedItemIds((current) => ids.every((id) => current.includes(id)) ? current.filter((id) => !ids.includes(id)) : [...new Set([...current, ...ids])]); };
    const toggleStudent = (studentId) => setSelectedStudentIds((current) => current.includes(studentId) ? current.filter((id) => id !== studentId) : [...current, studentId]);
    const toggleAllStudents = () => { const ids = worksheet.assignments.filter((assignment) => assignment.status !== 'done').map((assignment) => assignment.studentId); setSelectedStudentIds((current) => ids.every((id) => current.includes(id)) ? current.filter((id) => !ids.includes(id)) : [...new Set([...current, ...ids])]); };

    const assignReview = ({ studentIds, mode, dueAt }) => {
        const newAssignments = studentIds.map((studentId) => ({ studentId, name: wrongAnswerStudents.find((student) => student.id === studentId)?.name ?? '학생', itemNos: selectedItems.map((item) => item.id), mode, viewed: 0, retried: 0, dueAt, status: 'not-started' }));
        setWorksheets((current) => current.map((item) => item.id === worksheet.id ? { ...item, assignStatus: 'reviewing', assignments: [...item.assignments.filter((assignment) => !studentIds.includes(assignment.studentId)), ...newAssignments] } : item));
        setAssignOpen(false); setSelectedItemIds([]);
    };
    const saveExplanation = (itemId, explanation) => setWorksheets((current) => current.map((item) => item.id === worksheet.id ? { ...item, wrongItems: item.wrongItems.map((wrongItem) => wrongItem.id === itemId ? { ...wrongItem, explanation, explanationReady: true } : wrongItem) } : item));

    return (
        <section className="wrong-answer-page" aria-labelledby="wrong-answer-page-title">
            <header className="wrong-answer-page__page-header"><div><h1 id="wrong-answer-page-title">오답 학습</h1><p>해설 검토가 끝난 문항을 선택해 학생에게 다시 배정합니다.</p></div><span>검색 결과 <strong>{filteredWorksheets.length}</strong>건</span></header>
            <div className="wrong-answer-page__toolbar"><div className="wrong-answer-page__filters"><CustomSelect label="반 선택" value={classId} options={wrongAnswerFilterOptions.classes} onChange={setClassId} width={174} /><AssignmentPeriodFilter period={period} startDate={customStartDate} endDate={customEndDate} onPeriodChange={setPeriod} onStartDateChange={setCustomStartDate} onEndDateChange={setCustomEndDate} /><div className="wrong-answer-page__tabs" role="group" aria-label="오답 학습 상태">{statusTabs.map((tab) => <button key={tab.value} type="button" className={`wrong-answer-page__tab${status === tab.value ? ' wrong-answer-page__tab--active' : ''}`} aria-pressed={status === tab.value} onClick={() => setStatus(tab.value)}>{tab.label}</button>)}</div></div><SearchInput value={search} placeholder="학습명 검색" onChange={setSearch} /></div>
            <div className="wrong-answer-page__content"><WrongAnswerWorksheetList worksheets={filteredWorksheets} selectedId={selectedId} onSelect={setSelectedId} />
                {worksheet ? <main className="wrong-answer-detail"><header className="wrong-answer-detail__header"><div><span>{worksheet.className} · {worksheet.type === 'assessment' ? '종합평가' : '일반 학습'}</span><h2>{worksheet.title}</h2></div><span className="wrong-answer-detail__guide"><i className="bi bi-info-circle" aria-hidden="true" /> 해설 검토가 필요한 항목은 배정할 수 없습니다.</span></header><WrongQuestionList worksheet={worksheet} selectedIds={selectedItemIds} onToggle={toggleItem} onSelectAll={toggleAllItems} onOpen={(item) => setPanelItemId(item.id)} onAssign={() => setAssignOpen(true)} /><ReviewProgressTable worksheet={worksheet} selectedIds={selectedStudentIds} onToggle={toggleStudent} onToggleAll={toggleAllStudents} /></main> : <div className="wrong-answer-detail wrong-answer-detail--empty"><i className="bi bi-search" aria-hidden="true" /><p>조건에 맞는 학습이 없습니다.</p></div>}
            </div>
            {assignOpen && worksheet && selectedItems.length > 0 && <AssignReviewModal items={selectedItems} initialStudentIds={requestedStudents} onClose={() => setAssignOpen(false)} onAssign={assignReview} />}
            {panelItem && <ExplanationPanel item={panelItem} onClose={() => setPanelItemId(null)} onSave={saveExplanation} />}
        </section>
    );
}

export default WrongAnswerPage;
