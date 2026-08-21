import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnalysisFilters, useAcademicContextFilters } from '../../../components/common/filters';
import {
    useAnalysisAssignmentsQuery,
    useAnalysisStudentsQuery,
} from '../../learning/WeaknessAnalysisPage/analysisAssignmentHooks.js';
import { adaptAnalysisStudents } from '../../learning/WeaknessAnalysisPage/analysisAdapters.js';
import useSectionFocusMode from '../../../components/SectionLayout/useSectionFocusMode';
import CustomConfigTable from './components/CustomConfigTable';
import StudentWeaknessList from './components/StudentWeaknessList';
import WeaknessSummaryCard from './components/WeaknessSummaryCard';
import { adaptReissueProposal, getProposalErrorMessage } from './customProposalAdapters.js';
import { useStudentReissueProposalQuery } from './customProposalHooks.js';
import './CustomProblemPage.scss';
import './components/CustomProblemComponents.scss';

function CustomProblemPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const {
        filters: academicFilters,
        options: academicOptions,
        changeFilter: changeAcademicContextFilter,
        query: academicContextsQuery,
    } = useAcademicContextFilters();
    const [assignmentId, setAssignmentId] = useState(searchParams.get('worksheet') ?? '');
    const [selectedStudentId, setSelectedStudentId] = useState(
        searchParams.get('students')?.split(',').filter(Boolean)[0] ?? '',
    );
    const [proposalWork, setProposalWork] = useState({});

    const assignmentQuery = useAnalysisAssignmentsQuery({
        classId: academicFilters.classId,
        semester: academicFilters.semester,
    });
    const assignments = useMemo(() => (assignmentQuery.data?.assignments ?? []).filter(
        (assignment) => assignment.analysisAvailable,
    ), [assignmentQuery.data]);
    const selectedAssignment = assignments.find((assignment) => String(assignment.assignmentId) === assignmentId);
    const studentsQuery = useAnalysisStudentsQuery(selectedAssignment ? assignmentId : '');
    const students = useMemo(() => adaptAnalysisStudents(studentsQuery.data), [studentsQuery.data]);
    const selectedStudent = students.find((student) => student.id === selectedStudentId) ?? null;
    const proposalQuery = useStudentReissueProposalQuery(
        selectedAssignment ? assignmentId : '',
        selectedStudent?.id ?? '',
    );
    const preferredConcept = searchParams.get('concept');
    const proposal = useMemo(() => {
        const adapted = adaptReissueProposal(proposalQuery.data);
        if (preferredConcept) {
            adapted.configs.sort((a, b) => (
                Number(b.conceptId === preferredConcept) - Number(a.conceptId === preferredConcept)
            ));
        }
        return adapted;
    }, [preferredConcept, proposalQuery.data]);
    const workKey = selectedStudent ? `${assignmentId}:${selectedStudent.id}` : '';
    const configs = proposalWork[workKey] ?? proposal.configs;

    useSectionFocusMode(false);

    useEffect(() => {
        if (assignmentQuery.isPending || assignmentQuery.isError) return;
        const nextAssignmentId = selectedAssignment
            ? assignmentId
            : String(assignments[0]?.assignmentId ?? '');

        if (nextAssignmentId === assignmentId) return;
        setAssignmentId(nextAssignmentId);
        setSelectedStudentId('');
        const nextParams = new URLSearchParams(searchParams);
        if (nextAssignmentId) nextParams.set('worksheet', nextAssignmentId);
        else nextParams.delete('worksheet');
        nextParams.delete('students');
        setSearchParams(nextParams, { replace: true });
    }, [assignmentId, assignmentQuery.isError, assignmentQuery.isPending, assignments, searchParams, selectedAssignment, setSearchParams]);

    useEffect(() => {
        if (!selectedAssignment || studentsQuery.isPending || studentsQuery.isError) return;
        const nextStudentId = selectedStudent ? selectedStudentId : students[0]?.id ?? '';

        if (nextStudentId === selectedStudentId) return;
        setSelectedStudentId(nextStudentId);
        const nextParams = new URLSearchParams(searchParams);
        if (nextStudentId) nextParams.set('students', nextStudentId);
        else nextParams.delete('students');
        setSearchParams(nextParams, { replace: true });
    }, [searchParams, selectedAssignment, selectedStudent, selectedStudentId, setSearchParams, students, studentsQuery.isError, studentsQuery.isPending]);

    const changeAcademicFilter = (key, value) => {
        changeAcademicContextFilter(key, value);
        setAssignmentId('');
        setSelectedStudentId('');
        const nextParams = new URLSearchParams(searchParams);
        nextParams.delete('worksheet');
        nextParams.delete('students');
        nextParams.delete('concept');
        setSearchParams(nextParams, { replace: true });
    };

    const changeAssignment = (value) => {
        setAssignmentId(value);
        setSelectedStudentId('');
        const nextParams = new URLSearchParams(searchParams);
        nextParams.set('worksheet', value);
        nextParams.delete('students');
        nextParams.delete('concept');
        setSearchParams(nextParams);
    };

    const selectStudent = (studentId) => {
        setSelectedStudentId(studentId);
        const nextParams = new URLSearchParams(searchParams);
        nextParams.set('students', studentId);
        setSearchParams(nextParams);
    };

    const changeCount = (conceptId, stage, value) => {
        if (!workKey) return;
        setProposalWork((current) => ({
            ...current,
            [workKey]: (current[workKey] ?? proposal.configs).map((config) => (
                config.conceptId === conceptId
                    ? { ...config, counts: { ...config.counts, [stage]: value } }
                    : config
            )),
        }));
    };

    const removeConfig = (conceptId) => {
        if (!workKey) return;
        setProposalWork((current) => ({
            ...current,
            [workKey]: (current[workKey] ?? proposal.configs).filter((config) => config.conceptId !== conceptId),
        }));
    };

    const filterControls = [
        { key: 'academicYear', label: '학년도 선택', value: academicFilters.academicYear, options: academicOptions.academicYears, onChange: (value) => changeAcademicFilter('academicYear', value), width: 132, disabled: academicContextsQuery.isPending || academicContextsQuery.isError || !academicOptions.academicYears.length },
        { key: 'grade', label: '학년 선택', value: academicFilters.grade, options: academicOptions.grades, onChange: (value) => changeAcademicFilter('grade', value), width: 132, disabled: academicContextsQuery.isPending || academicContextsQuery.isError || !academicOptions.grades.length },
        { key: 'classId', label: '반 선택', value: academicFilters.classId, options: academicOptions.classes, onChange: (value) => changeAcademicFilter('classId', value), width: 104, disabled: academicContextsQuery.isPending || academicContextsQuery.isError || !academicOptions.classes.length },
        { key: 'semester', label: '학기 선택', value: academicFilters.semester, options: academicOptions.semesters, onChange: (value) => changeAcademicFilter('semester', value), width: 104, disabled: academicContextsQuery.isPending || academicContextsQuery.isError || !academicOptions.semesters.length },
        { key: 'worksheetId', label: '학습지 선택', value: assignmentId, options: assignments.map((assignment) => ({ value: String(assignment.assignmentId), label: assignment.worksheetTitle })), onChange: changeAssignment, width: 280, disabled: assignmentQuery.isPending || assignmentQuery.isError || !assignments.length },
    ];

    const proposalReason = proposalQuery.isPending
        ? '맞춤 문제 제안을 불러오는 중입니다.'
        : proposalQuery.isError
            ? getProposalErrorMessage(proposalQuery.error)
            : proposal.reason;

    return <section className="custom-problem-page" aria-label="맞춤 문제 생성">
        <AnalysisFilters className="custom-problem-page__filters" controls={filterControls} showContext={false} />
        {!selectedAssignment ? <div className="custom-problem-page__request-state">
            {academicContextsQuery.isPending
                ? '담당 학급을 불러오는 중입니다.'
                : academicContextsQuery.isError
                    ? academicContextsQuery.error?.message || '담당 학급을 불러오지 못했습니다.'
                    : assignmentQuery.isPending
                        ? '맞춤 문제를 만들 학습지를 불러오는 중입니다.'
                        : assignmentQuery.isError
                            ? assignmentQuery.error?.message || '학습지를 불러오지 못했습니다.'
                            : '분석이 완료된 학습지가 없습니다.'}
        </div> : <div className="custom-problem-page__workspace">
            <StudentWeaknessList
                students={students}
                selectedId={selectedStudent?.id}
                proposalCount={proposalQuery.isSuccess ? proposal.configs.length : null}
                isPending={studentsQuery.isPending}
                error={studentsQuery.isError ? studentsQuery.error : null}
                onSelect={selectStudent}
            />
            <div className="custom-problem-page__main">
                <CustomConfigTable
                    configs={configs}
                    reason={proposalReason}
                    isPending={proposalQuery.isPending}
                    isError={proposalQuery.isError}
                    onCountChange={changeCount}
                    onRemove={removeConfig}
                />
            </div>
            <WeaknessSummaryCard
                student={selectedStudent}
                configs={proposal.configs}
                reason={proposalReason}
                isPending={proposalQuery.isPending}
                isError={proposalQuery.isError}
            />
        </div>}
    </section>;
}

export default CustomProblemPage;
