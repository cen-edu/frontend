import { useEffect, useMemo, useState } from 'react';
import CustomSelect from '../../components/common/CustomSelect/CustomSelect';
import { learningAssignments, learningFilterOptions } from '../../mocks/learningStatus';
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
    const [classId, setClassId] = useState('all');
    const [period, setPeriod] = useState('this-week');
    const [assignmentStatus, setAssignmentStatus] = useState('all');
    const [studentStatus, setStudentStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedId, setSelectedId] = useState('linear-equation-quiz');
    const [remindedIds, setRemindedIds] = useState([]);

    const filteredAssignments = useMemo(() => {
        const keyword = searchTerm.trim().toLowerCase();
        return learningAssignments.filter((assignment) =>
            (classId === 'all' || assignment.classId === classId)
            && (period === 'this-month' || assignment.period === period)
            && (assignmentStatus === 'all' || assignment.status === assignmentStatus)
            && (!keyword || assignment.title.toLowerCase().includes(keyword)));
    }, [assignmentStatus, classId, period, searchTerm]);

    useEffect(() => {
        if (!filteredAssignments.some((assignment) => assignment.id === selectedId)) {
            setSelectedId(filteredAssignments[0]?.id ?? '');
        }
    }, [filteredAssignments, selectedId]);

    useEffect(() => {
        setStudentStatus('all');
        setRemindedIds([]);
    }, [selectedId]);

    const selectedAssignment = filteredAssignments.find((assignment) => assignment.id === selectedId);
    const visibleStudents = selectedAssignment?.students.filter((student) =>
        studentStatus === 'all' || student.status === studentStatus) ?? [];
    const allStudents = filteredAssignments.flatMap((assignment) => assignment.students);
    const summary = {
        assignments: filteredAssignments.filter((assignment) => assignment.status === 'ongoing').length,
        submitted: allStudents.filter((student) => student.status === 'submitted').length,
        inProgress: allStudents.filter((student) => student.status === 'in-progress').length,
        notStarted: allStudents.filter((student) => student.status === 'not-started').length,
    };

    const sendReminder = (studentId) => {
        setRemindedIds((current) => current.includes(studentId) ? current : [...current, studentId]);
    };

    return (
        <section className="learning-status" aria-labelledby="learning-status-title">
            <div className="learning-status__heading">
                <div>
                    <span className="learning-status__eyebrow">LEARNING STATUS</span>
                    <h1 id="learning-status-title">학습 현황</h1>
                    <p>반과 학생별 제출 여부, 풀이 진행 상황과 채점 결과를 확인하세요.</p>
                </div>
                <span className="learning-status__updated"><i className="bi bi-arrow-clockwise" aria-hidden="true" /> 오늘 11:30 업데이트</span>
            </div>

            <div className="learning-status__toolbar">
                <div className="learning-status__filters">
                    <CustomSelect label="반 선택" value={classId} options={learningFilterOptions.classes} onChange={setClassId} width={158} />
                    <CustomSelect label="기간 선택" value={period} options={learningFilterOptions.periods} onChange={setPeriod} width={116} />
                    <div className="learning-status__tabs" role="group" aria-label="학습 진행 상태">
                        {assignmentTabs.map((tab) => (
                            <button key={tab.value} type="button" className={assignmentStatus === tab.value ? 'learning-status__tab learning-status__tab--active' : 'learning-status__tab'} aria-pressed={assignmentStatus === tab.value} onClick={() => setAssignmentStatus(tab.value)}>{tab.label}</button>
                        ))}
                    </div>
                </div>
                <label className="learning-status__search">
                    <span className="learning-status__sr-only">학습명 검색</span>
                    <input type="search" value={searchTerm} placeholder="학습명 검색" onChange={(event) => setSearchTerm(event.target.value)} />
                    <i className="bi bi-search" aria-hidden="true" />
                </label>
            </div>

            <LearningSummary summary={summary} />

            <div className="learning-status__content">
                <AssignmentList assignments={filteredAssignments} selectedId={selectedId} onSelect={setSelectedId} />
                <StudentProgressTable
                    assignment={selectedAssignment}
                    students={visibleStudents}
                    status={studentStatus}
                    statusOptions={learningFilterOptions.studentStatuses}
                    onStatusChange={setStudentStatus}
                    remindedIds={remindedIds}
                    onRemind={sendReminder}
                />
            </div>
        </section>
    );
}

export default LearningStatusPage;
