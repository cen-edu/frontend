import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnalysisFilters, useAcademicContextFilters } from '../../../components/common/filters';
import { useDialog } from '../../../components/common/feedback';
import { defaultSupportModes } from '../../../mocks/labels.js';
import {
    useAnalysisAssignmentsQuery,
    useAnalysisStudentsQuery,
    useStudentCustomLearningSessionsQuery,
} from '../../learning/WeaknessAnalysisPage/analysisAssignmentHooks.js';
import { useLearningStatusQuery } from '../../learning/LearningStatusPage/learningStatusHooks.js';
import { adaptAnalysisStudents } from '../../learning/WeaknessAnalysisPage/analysisAdapters.js';
import useSectionFocusMode from '../../../components/SectionLayout/useSectionFocusMode';
import CustomConfigTable from './components/CustomConfigTable';
import StudentWeaknessList from './components/StudentWeaknessList';
import WeaknessSummaryCard from './components/WeaknessSummaryCard';
import CustomGenerationResult from './components/CustomGenerationResult.jsx';
import {
    buildCustomProblemGenerationItems,
    CUSTOM_PROBLEM_MAX_COUNT,
    getCustomGenerationErrorMessage,
    getCustomProblemTotalCount,
} from './customGenerationAdapter.js';
import {
    useCustomProblemGenerationJobQuery,
    useCustomProblemGenerationMutation,
} from './customGenerationHooks.js';
import { adaptReissueProposal, getProposalErrorMessage } from './customProposalAdapters.js';
import { useStudentReissueProposalQuery } from './customProposalHooks.js';
import {
    useWorksheetAssignmentMutation,
    useWorksheetSaveMutation,
} from '../worksheetHooks.js';
import {
    buildCustomWorksheetTitle,
    getCustomDeliveryErrorMessage,
    resolveCustomParentWorksheetId,
} from './customDeliveryAdapter.js';
import './CustomProblemPage.scss';
import './components/CustomProblemComponents.scss';

function CustomProblemPage() {
    const { alert } = useDialog();
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
    const [generationRequest, setGenerationRequest] = useState(null);
    const [generationJobId, setGenerationJobId] = useState(null);
    const [savedWorksheet, setSavedWorksheet] = useState(null);
    const [assignedAssignment, setAssignedAssignment] = useState(null);

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
    const customSessionsQuery = useStudentCustomLearningSessionsQuery(
        selectedAssignment ? assignmentId : '',
        selectedStudent?.id ?? '',
    );
    const learningStatusQuery = useLearningStatusQuery();
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
    const generationMutation = useCustomProblemGenerationMutation();
    const generationJobQuery = useCustomProblemGenerationJobQuery(generationJobId);
    const saveMutation = useWorksheetSaveMutation();
    const assignmentMutation = useWorksheetAssignmentMutation();
    const totalCount = getCustomProblemTotalCount(configs);
    const canGenerate = proposalQuery.isSuccess
        && Boolean(selectedAssignment && selectedStudent)
        && totalCount > 0
        && totalCount <= CUSTOM_PROBLEM_MAX_COUNT;
    const generationError = generationMutation.isError
        ? getCustomGenerationErrorMessage(generationMutation.error)
        : totalCount > CUSTOM_PROBLEM_MAX_COUNT
            ? `맞춤 문제는 한 번에 최대 ${CUSTOM_PROBLEM_MAX_COUNT}문항까지 생성할 수 있습니다.`
            : '';
    const parentWorksheetId = useMemo(() => resolveCustomParentWorksheetId({
        sourceAssignmentId: assignmentId,
        sessions: customSessionsQuery.data?.sessions,
        learningStatusAssignments: learningStatusQuery.data?.assignments,
    }), [assignmentId, customSessionsQuery.data?.sessions, learningStatusQuery.data?.assignments]);
    const deliveryContextPending = customSessionsQuery.isPending || learningStatusQuery.isPending;
    const deliveryDisabledReason = deliveryContextPending
        ? '맞춤 학습 회차 정보를 확인하고 있습니다.'
        : customSessionsQuery.isError
            ? customSessionsQuery.error?.message || '학생의 맞춤 학습 회차를 불러오지 못했습니다.'
            : learningStatusQuery.isError
                ? learningStatusQuery.error?.message || '원본 학습지 정보를 불러오지 못했습니다.'
                : parentWorksheetId == null
                    ? '원본 또는 직전 맞춤 학습지 정보를 찾지 못했습니다.'
                    : '';
    const deliveryError = saveMutation.isError || assignmentMutation.isError
        ? getCustomDeliveryErrorMessage(
            assignmentMutation.error ?? saveMutation.error,
            Boolean(savedWorksheet),
        )
        : '';

    useSectionFocusMode(Boolean(generationJobId));

    const resetGenerationAttempt = () => {
        generationMutation.reset();
        setGenerationRequest(null);
    };

    const resetDelivery = () => {
        saveMutation.reset();
        assignmentMutation.reset();
        setSavedWorksheet(null);
        setAssignedAssignment(null);
    };

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
        if (generationMutation.isPending) return;
        resetGenerationAttempt();
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
        if (generationMutation.isPending) return;
        resetGenerationAttempt();
        setAssignmentId(value);
        setSelectedStudentId('');
        const nextParams = new URLSearchParams(searchParams);
        nextParams.set('worksheet', value);
        nextParams.delete('students');
        nextParams.delete('concept');
        setSearchParams(nextParams);
    };

    const selectStudent = (studentId) => {
        if (generationMutation.isPending) return;
        resetGenerationAttempt();
        setSelectedStudentId(studentId);
        const nextParams = new URLSearchParams(searchParams);
        nextParams.set('students', studentId);
        setSearchParams(nextParams);
    };

    const changeCount = (conceptId, stage, value) => {
        if (!workKey) return;
        resetGenerationAttempt();
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
        resetGenerationAttempt();
        setProposalWork((current) => ({
            ...current,
            [workKey]: (current[workKey] ?? proposal.configs).filter((config) => config.conceptId !== conceptId),
        }));
    };

    const submitGenerationRequest = (request) => {
        generationMutation.mutate(request, {
            onSuccess: (startedJob) => setGenerationJobId(startedJob.jobId),
        });
    };

    const createProblems = () => {
        if (!canGenerate) return;

        resetDelivery();
        const request = {
            clientRequestId: crypto.randomUUID(),
            sourceAssignmentId: assignmentId,
            studentId: selectedStudent.id,
            items: buildCustomProblemGenerationItems(configs),
        };
        setGenerationRequest(request);
        submitGenerationRequest(request);
    };

    const requestGeneration = () => {
        if (generationRequest) submitGenerationRequest(generationRequest);
        else createProblems();
    };

    const closeGenerationResult = () => {
        if (saveMutation.isPending || assignmentMutation.isPending) return;
        setGenerationJobId(null);
        resetGenerationAttempt();
        resetDelivery();
    };

    const saveAndAssign = async ({ title, dueAt, problems }) => {
        if (deliveryDisabledReason || assignedAssignment || saveMutation.isPending || assignmentMutation.isPending) return;

        let worksheet = savedWorksheet;

        try {
            if (!worksheet) {
                worksheet = await saveMutation.mutateAsync({
                    title,
                    type: 'practice',
                    gradeId: academicFilters.grade,
                    semester: academicFilters.semester,
                    problems,
                    supports: Object.fromEntries(problems.map((problem) => [
                        problem.id,
                        defaultSupportModes.custom,
                    ])),
                    origin: 'custom',
                    sourceAssignmentId: assignmentId,
                    parentWorksheetId,
                });
                setSavedWorksheet(worksheet);
            }

            const assignment = await assignmentMutation.mutateAsync({
                worksheetId: worksheet.worksheetId,
                classId: null,
                studentId: selectedStudent.id,
                dueAt,
            });
            setAssignedAssignment(assignment);
            await alert({
                title: '맞춤 학습 배정 완료',
                message: `${selectedStudent.name} 학생에게 맞춤 학습을 배정했습니다.`,
                tone: 'success',
            });
        } catch {
            // 각 mutation의 오류 상태를 배정 영역에 표시하고, 저장 성공 시 재시도에는 저장 결과를 재사용한다.
        }
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
        {generationJobId ? <CustomGenerationResult
            job={generationJobQuery.data ?? generationMutation.data}
            configs={configs}
            student={selectedStudent}
            isPending={generationJobQuery.isPending}
            error={generationJobQuery.isError ? generationJobQuery.error : null}
            initialWorksheetTitle={buildCustomWorksheetTitle({
                sourceTitle: selectedAssignment?.worksheetTitle,
                studentName: selectedStudent?.name,
            })}
            assignment={assignedAssignment}
            isSaving={saveMutation.isPending}
            isAssigning={assignmentMutation.isPending}
            assignmentError={deliveryError}
            assignmentDisabledReason={deliveryDisabledReason}
            onAssign={saveAndAssign}
            onRetry={generationJobQuery.refetch}
            onBack={closeGenerationResult}
        /> : <>
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
                disabled={generationMutation.isPending}
                onSelect={selectStudent}
            />
            <div className="custom-problem-page__main">
                <CustomConfigTable
                    configs={configs}
                    reason={proposalReason}
                    isPending={proposalQuery.isPending}
                    isError={proposalQuery.isError}
                    canGenerate={canGenerate}
                    isGenerating={generationMutation.isPending}
                    generationError={generationError}
                    isRetry={generationMutation.isError && Boolean(generationRequest)}
                    onCountChange={changeCount}
                    onRemove={removeConfig}
                    onGenerate={requestGeneration}
                />
            </div>
            <WeaknessSummaryCard
                student={selectedStudent}
                configs={proposal.configs}
                reason={proposalReason}
                isPending={proposalQuery.isPending}
                isError={proposalQuery.isError}
            />
        </div>}</>}
    </section>;
}

export default CustomProblemPage;
