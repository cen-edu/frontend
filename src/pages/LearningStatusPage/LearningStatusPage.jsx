import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AssignmentPeriodFilter from '../../components/common/AssignmentPeriodFilter/AssignmentPeriodFilter';
import CustomSelect from '../../components/common/CustomSelect/CustomSelect';
import SearchInput from '../../components/common/SearchInput/SearchInput';
import { learningAssignments, learningFilterOptions } from '../../mocks/learningStatus';
import { getDefaultAssignmentDateRange, isAssignedWithinPeriod } from '../../utils/assignmentPeriod';
import AssignmentList from './components/AssignmentList';
import LearningSummary from './components/LearningSummary';
import StudentProgressTable from './components/StudentProgressTable';
import './LearningStatusPage.scss';
import './components/LearningStatusComponents.scss';

const assignmentTabs = [
    { value: 'all', label: '전체' },
    { value: 'ongoing', label: '진행 중' },
    { value: 'completed', label: '마감' },
];

function LearningStatusPage() {
    const [searchParams] = useSearchParams();
    const requestedWorksheet = searchParams.get('worksheet');
    const requestedAssignment = learningAssignments.find((assignment) =>
        assignment.id === requestedWorksheet || assignment.analysisWorksheetId === requestedWorksheet);
    const initialDateRange = useMemo(getDefaultAssignmentDateRange, []);
    const [gradeId, setGradeId] = useState(requestedAssignment?.gradeId ?? 'all');
    const [classId, setClassId] = useState(requestedAssignment?.classId ?? 'all');
    const [period, setPeriod] = useState('all');
    const [customStartDate, setCustomStartDate] = useState(initialDateRange.startDate);
    const [customEndDate, setCustomEndDate] = useState(initialDateRange.endDate);
    const [assignmentStatus, setAssignmentStatus] = useState('all');
    const [studentStatus, setStudentStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedId, setSelectedId] = useState(requestedAssignment?.id ?? 'linear-equation-quiz');
    const previousAssignmentId = useRef(selectedId);

    const filteredAssignments = useMemo(() => {
        const keyword = searchTerm.trim().toLowerCase();
        return learningAssignments.filter((assignment) =>
            (gradeId === 'all' || assignment.gradeId === gradeId)
                && (classId === 'all' || assignment.classId === classId)
                && isAssignedWithinPeriod(assignment.assignedAt, period, customStartDate, customEndDate)
                && (assignmentStatus === 'all' || assignment.status === assignmentStatus)
                && (!keyword || assignment.title.toLowerCase().includes(keyword)));
    }, [assignmentStatus, classId, customEndDate, customStartDate, gradeId, period, searchTerm]);

    useEffect(() => {
        if (!filteredAssignments.some((assignment) => assignment.id === selectedId)) {
            setSelectedId(filteredAssignments[0]?.id ?? '');
        }
    }, [filteredAssignments, selectedId]);

    useEffect(() => {
        if (previousAssignmentId.current !== selectedId) {
            setStudentStatus('all');
            previousAssignmentId.current = selectedId;
        }
    }, [selectedId]);

    const selectedAssignment = filteredAssignments.find((assignment) => assignment.id === selectedId);
    const visibleStudents = selectedAssignment?.students.filter((student) => {
        if (studentStatus === 'unsubmitted') return student.status !== 'submitted';
        return studentStatus === 'all' || student.status === studentStatus;
    }) ?? [];
    const allStudents = filteredAssignments.flatMap((assignment) => assignment.students);
    const summary = {
        assignments: filteredAssignments.filter((assignment) => assignment.status === 'ongoing').length,
        submitted: allStudents.filter((student) => student.status === 'submitted').length,
        inProgress: allStudents.filter((student) => student.status === 'in-progress').length,
        unsubmitted: allStudents.filter((student) => student.status !== 'submitted').length,
    };

    const selectSummary = (key) => {
        if (key === 'assignments') {
            setAssignmentStatus('ongoing');
            setStudentStatus('all');
            return;
        }
        setAssignmentStatus('all');
        setStudentStatus(key === 'inProgress' ? 'in-progress' : key);
    };

    const activeSummaryKey = assignmentStatus === 'ongoing' && studentStatus === 'all'
        ? 'assignments'
        : ({ submitted: 'submitted', 'in-progress': 'inProgress', unsubmitted: 'unsubmitted' }[studentStatus] ?? '');

    return (
        <section className="learning-status" aria-labelledby="learning-status-title">
            <header className="learning-status__page-header">
                <div>
                    <h1 id="learning-status-title">학습 현황</h1>
                    <p>배정한 학습의 제출 상태와 학생별 진행 상황을 확인합니다.</p>
                </div>
                <span>검색 결과 <strong>{filteredAssignments.length}</strong>개</span>
            </header>
            <div className="learning-status__toolbar">
                <div className="learning-status__filters">
                    <CustomSelect label="학년 선택" value={gradeId} options={learningFilterOptions.grades} onChange={(value) => { setGradeId(value); setClassId('all'); }} width={148} />
                    <CustomSelect label="반 선택" value={classId} options={learningFilterOptions.classes} onChange={setClassId} width={104} />
                    <AssignmentPeriodFilter period={period} startDate={customStartDate} endDate={customEndDate} onPeriodChange={setPeriod} onStartDateChange={setCustomStartDate} onEndDateChange={setCustomEndDate} />
                    <div className="learning-status__tabs" role="group" aria-label="학습 진행 상태">
                        {assignmentTabs.map((tab) => (
                            <button key={tab.value} type="button" className={assignmentStatus === tab.value ? 'learning-status__tab learning-status__tab--active' : 'learning-status__tab'} aria-pressed={assignmentStatus === tab.value} onClick={() => setAssignmentStatus(tab.value)}>{tab.label}</button>
                        ))}
                    </div>
                </div>
                <SearchInput value={searchTerm} placeholder="학습명 검색" onChange={setSearchTerm} />
            </div>

            <LearningSummary summary={summary} activeKey={activeSummaryKey} onSelect={selectSummary} />

            <div className="learning-status__content">
                <AssignmentList assignments={filteredAssignments} selectedId={selectedId} onSelect={setSelectedId} />
                <StudentProgressTable
                    assignment={selectedAssignment}
                    students={visibleStudents}
                    status={studentStatus}
                    statusOptions={learningFilterOptions.studentStatuses}
                    onStatusChange={setStudentStatus}
                />
            </div>
        </section>
    );
}

export default LearningStatusPage;
