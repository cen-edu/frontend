import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CustomSelect, SearchInput } from '../../../components/common/inputs';
import { teacherProgressStatusLabels } from '../../../mocks/labels';
import AssignmentList from './components/AssignmentList';
import LearningSummary from './components/LearningSummary';
import StudentProgressTable from './components/StudentProgressTable';
import {
    useLearningStatusQuery,
    useLearningStatusStudentsQuery,
} from './learningStatusHooks';
import { getDerivedCustomAssignments } from './learningStatusUtils';
import './LearningStatusPage.scss';
import './components/LearningStatusComponents.scss';

const assignmentTabs = [
    { value: 'all', label: '전체' },
    { value: 'ongoing', label: '진행 중' },
    { value: 'completed', label: '마감' },
];

const gradeOptions = [
    { value: 'all', label: '전체 학년' },
    { value: '1', label: '1학년' },
    { value: '2', label: '2학년' },
    { value: '3', label: '3학년' },
];

const semesterOptions = [
    { value: 'all', label: '전체 학기' },
    { value: 'first', label: '1학기' },
    { value: 'second', label: '2학기' },
    { value: 'common', label: '공통' },
];

const studentStatusOptions = [
    { value: 'all', label: '전체 상태' },
    { value: 'submitted', label: teacherProgressStatusLabels.submitted },
    { value: 'in-progress', label: teacherProgressStatusLabels['in-progress'] },
    { value: 'not-started', label: teacherProgressStatusLabels['not-started'] },
    { value: 'not-submitted', label: teacherProgressStatusLabels['not-submitted'] },
];

const EMPTY_SUMMARY = {
    assignments: 0,
    submitted: 0,
    inProgress: 0,
    unsubmitted: 0,
};

function useDebouncedValue(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => setDebouncedValue(value), delay);
        return () => window.clearTimeout(timeoutId);
    }, [delay, value]);

    return debouncedValue;
}

function LearningStatusPage() {
    const [searchParams] = useSearchParams();
    const requestedWorksheet = searchParams.get('worksheet');
    const [grade, setGrade] = useState('all');
    const [classId, setClassId] = useState('all');
    const [semester, setSemester] = useState('all');
    const [assignmentStatus, setAssignmentStatus] = useState('all');
    const [studentStatus, setStudentStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedId, setSelectedId] = useState('');
    const previousAssignmentId = useRef(selectedId);
    const appliedRequestedWorksheet = useRef(null);
    const debouncedSearchTerm = useDebouncedValue(searchTerm, 300);

    // 전체 응답은 필터 옵션과 원본-맞춤 배포 관계를 위한 기준 데이터로 캐시에 유지한다.
    const allAssignmentsQuery = useLearningStatusQuery();
    const listQuery = useLearningStatusQuery({
        grade: grade === 'all' ? undefined : grade,
        classId: classId === 'all' ? undefined : classId,
        semester: semester === 'all' ? undefined : semester,
        q: debouncedSearchTerm,
    });

    const allAssignments = allAssignmentsQuery.data?.assignments ?? [];
    const filteredAssignments = listQuery.data?.assignments ?? [];
    const listAssignments = useMemo(() => filteredAssignments.filter((assignment) => (
        assignment.origin !== 'custom'
        && (assignmentStatus === 'all' || assignment.status === assignmentStatus)
    )), [assignmentStatus, filteredAssignments]);

    const classOptions = useMemo(() => {
        const optionsById = new Map();
        allAssignments.forEach((assignment) => {
            const differentGrade = grade !== 'all' && String(assignment.grade) !== grade;
            if (assignment.classId === null || differentGrade) return;
            optionsById.set(String(assignment.classId), assignment.className ?? '미지정 반');
        });
        return [
            { value: 'all', label: '전체 반' },
            ...Array.from(optionsById, ([value, label]) => ({ value, label }))
                .sort((a, b) => a.label.localeCompare(b.label, 'ko')),
        ];
    }, [allAssignments, grade]);

    useEffect(() => {
        const shouldApplyRequestedWorksheet = requestedWorksheet
            && appliedRequestedWorksheet.current !== requestedWorksheet
            && allAssignments.length > 0;
        const requestedAssignment = shouldApplyRequestedWorksheet
            ? allAssignments.find((assignment) => (
                String(assignment.assignmentId) === requestedWorksheet
                || String(assignment.worksheetId) === requestedWorksheet
            ))
            : null;
        if (shouldApplyRequestedWorksheet) appliedRequestedWorksheet.current = requestedWorksheet;
        const requestedId = requestedAssignment?.origin === 'custom'
            ? requestedAssignment.sourceAssignmentId
            : requestedAssignment?.assignmentId;
        const nextAssignment = listAssignments.find((assignment) => (
            String(assignment.assignmentId) === String(requestedId)
        )) ?? listAssignments.find((assignment) => (
            String(assignment.assignmentId) === String(selectedId)
        )) ?? listAssignments[0];
        const nextId = nextAssignment ? String(nextAssignment.assignmentId) : '';
        if (nextId !== selectedId) setSelectedId(nextId);
    }, [allAssignments, listAssignments, requestedWorksheet, selectedId]);

    useEffect(() => {
        if (previousAssignmentId.current !== selectedId) {
            setStudentStatus('all');
            previousAssignmentId.current = selectedId;
        }
    }, [selectedId]);

    const selectedAssignment = listAssignments.find((assignment) => (
        String(assignment.assignmentId) === selectedId
    ));
    const studentsQuery = useLearningStatusStudentsQuery({
        assignmentId: selectedAssignment?.assignmentId,
        status: studentStatus === 'all' ? undefined : studentStatus,
    });
    const selectedAssignmentDetail = selectedAssignment
        ? { ...selectedAssignment, ...studentsQuery.data }
        : null;
    const derivedCustoms = getDerivedCustomAssignments(
        allAssignments,
        selectedAssignment?.assignmentId,
    ).map((assignment) => {
        const sourceAssignment = allAssignments.find((candidate) => (
            String(candidate.assignmentId) === String(assignment.sourceAssignmentId)
        ));
        return {
            ...assignment,
            analysisWorksheetId: sourceAssignment?.worksheetId,
        };
    });

    const selectSummary = (key) => {
        if (key === 'assignments') {
            setAssignmentStatus('ongoing');
            setStudentStatus('all');
            return;
        }
        setAssignmentStatus('all');
        setStudentStatus(key === 'inProgress' ? 'in-progress' : key === 'unsubmitted' ? 'not-submitted' : key);
    };

    const activeSummaryKey = assignmentStatus === 'ongoing' && studentStatus === 'all'
        ? 'assignments'
        : ({ submitted: 'submitted', 'in-progress': 'inProgress', 'not-submitted': 'unsubmitted' }[studentStatus] ?? '');
    const listError = listQuery.error || allAssignmentsQuery.error;

    return (
        <section className="learning-status" aria-labelledby="learning-status-title">
            <header className="learning-status__page-header">
                <div>
                    <h1 id="learning-status-title">학습 현황</h1>
                    <p>배정한 학습의 제출 상태와 학생별 진행 상황을 확인합니다.</p>
                </div>
                <span>검색 결과 <strong>{listQuery.isPending ? '-' : listAssignments.length}</strong>개</span>
            </header>
            <div className="learning-status__toolbar">
                <div className="learning-status__filters">
                    <CustomSelect label="학년 선택" value={grade} options={gradeOptions} onChange={(value) => { setGrade(value); setClassId('all'); }} width={148} />
                    <CustomSelect label="반 선택" value={classId} options={classOptions} onChange={setClassId} width={104} />
                    <CustomSelect label="학기 선택" value={semester} options={semesterOptions} onChange={setSemester} width={112} />
                    <div className="learning-status__tabs" role="group" aria-label="학습 진행 상태">
                        {assignmentTabs.map((tab) => (
                            <button key={tab.value} type="button" className={assignmentStatus === tab.value ? 'learning-status__tab learning-status__tab--active' : 'learning-status__tab'} aria-pressed={assignmentStatus === tab.value} onClick={() => setAssignmentStatus(tab.value)}>{tab.label}</button>
                        ))}
                    </div>
                </div>
                <SearchInput value={searchTerm} placeholder="학습명 검색" onChange={(value) => setSearchTerm(value.slice(0, 100))} />
            </div>

            <LearningSummary summary={listQuery.data?.summary ?? EMPTY_SUMMARY} activeKey={activeSummaryKey} onSelect={selectSummary} />

            {listError && (
                <div className="learning-status__error" role="alert">
                    <p>{listError.message}</p>
                    <button type="button" onClick={() => { allAssignmentsQuery.refetch(); listQuery.refetch(); }}>다시 불러오기</button>
                </div>
            )}

            {!listError && (
                <div className="learning-status__content">
                    <AssignmentList assignments={listAssignments} selectedId={selectedId} onSelect={setSelectedId} />
                    <StudentProgressTable
                        assignment={selectedAssignmentDetail}
                        students={studentsQuery.data?.students ?? []}
                        status={studentStatus}
                        statusOptions={studentStatusOptions}
                        onStatusChange={setStudentStatus}
                        customAssignments={derivedCustoms}
                    />
                </div>
            )}
        </section>
    );
}

export default LearningStatusPage;
