import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import AssessmentGradingView from './AssessmentGradingView';
import PracticeGradingView from './PracticeGradingView';
import { mergeStudentDetail } from './gradingAdapters.js';
import {
    gradingQueryKeys,
    useAutoGradingProgressQuery,
    useGradingScoreTableQuery,
    useGradingStudentDetailQuery,
    usePatchGradingAnswerMutation,
    useStartAutoGradingMutation,
} from './gradingHooks.js';
import './GradingPage.scss';

const deriveRubricChecks = (answer, question) => {
    if (answer?.rubricChecks?.length === question.rubric.length) return answer.rubricChecks;
    return question.rubric.map(() => false);
};

const isComplete = (student) => student.gradingComplete === true;

function GradingPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { worksheetId: worksheetIdParam } = useParams();
    const [searchParams] = useSearchParams();
    const assignmentId = Number(worksheetIdParam);
    const scoreTableQuery = useGradingScoreTableQuery(assignmentId);
    const scoreTable = scoreTableQuery.data;
    const requestedStudentId = Number(searchParams.get('student'));
    const firstPendingIndex = scoreTable?.students.findIndex((student) => !isComplete(student)) ?? -1;
    const requestedIndex = scoreTable?.students.findIndex((student) => student.id === requestedStudentId) ?? -1;
    const [studentIndex, setStudentIndex] = useState(0);
    const initializedAssignmentRef = useRef(null);
    const wasAutoGradingRef = useRef(false);
    const selectedStudent = scoreTable?.students[studentIndex];
    const detailQuery = useGradingStudentDetailQuery(assignmentId, selectedStudent?.assignmentStudentId);
    const adaptedWorksheet = scoreTable && detailQuery.data
        ? mergeStudentDetail(scoreTable, detailQuery.data)
        : null;
    const student = adaptedWorksheet?.currentStudent;
    const worksheet = adaptedWorksheet && student ? {
        ...adaptedWorksheet,
        students: adaptedWorksheet.students.map((candidate) => (
            candidate.id === student.id ? student : candidate
        )),
    } : null;
    const isPractice = worksheet?.type === 'practice';
    const patchMutation = usePatchGradingAnswerMutation();
    const autoMutation = useStartAutoGradingMutation();
    const progressQuery = useAutoGradingProgressQuery(assignmentId, Number.isFinite(assignmentId));

    useEffect(() => {
        if (!scoreTable?.students.length) return;
        if (initializedAssignmentRef.current === assignmentId) return;
        const nextIndex = requestedIndex >= 0
            ? requestedIndex
            : firstPendingIndex >= 0 ? firstPendingIndex : 0;
        initializedAssignmentRef.current = assignmentId;
        setStudentIndex(nextIndex);
    }, [assignmentId, firstPendingIndex, requestedIndex, scoreTable]);

    useEffect(() => {
        if (progressQuery.data?.running) {
            wasAutoGradingRef.current = true;
            return;
        }
        if (!progressQuery.data || !wasAutoGradingRef.current) return;
        wasAutoGradingRef.current = false;
        queryClient.invalidateQueries({ queryKey: gradingQueryKeys.scoreTable(assignmentId) });
        queryClient.invalidateQueries({ queryKey: gradingQueryKeys.students(assignmentId) });
    }, [assignmentId, progressQuery.data, queryClient]);

    const updateScore = (questionNo, score, selectedRubricChecks) => {
        const answer = student.answers.find((entry) => entry.no === questionNo);
        if (!answer?.submissionAnswerId) return;
        const question = worksheet.questions.find((entry) => entry.no === questionNo);
        const payload = selectedRubricChecks
            ? {
                rubricChecks: question.rubric.map((item, index) => ({
                    rubricItemId: item.id,
                    satisfied: selectedRubricChecks[index] === true,
                })),
            }
            : { finalScore: score };
        patchMutation.mutate({
            assignmentId,
            assignmentStudentId: student.id,
            submissionAnswerId: answer.submissionAnswerId,
            payload,
        });
    };

    const resetScore = (questionNo) => {
        const answer = student.answers.find((entry) => entry.no === questionNo);
        if (!answer?.submissionAnswerId) return;
        patchMutation.mutate({
            assignmentId,
            assignmentStudentId: student.id,
            submissionAnswerId: answer.submissionAnswerId,
            payload: { resetToAuto: true },
        });
    };

    const toggleRubric = (question, rubricIndex) => {
        const answer = student.answers.find((candidate) => candidate.no === question.no);
        const currentChecks = deriveRubricChecks(answer, question);
        const nextChecks = currentChecks.map((checked, index) => index === rubricIndex ? !checked : checked);
        updateScore(question.no, null, nextChecks);
    };

    // 일반 학습은 점수 대신 풀이 칸 하나의 정답 여부만 바꾼다.
    const markBlank = (questionNo, blankId, correct) => {
        const answer = student.answers.find((entry) => entry.no === questionNo);
        const blank = answer?.blanks.find((entry) => entry.blankId === blankId);
        if (!blank?.submissionAnswerId) return;
        patchMutation.mutate({
            assignmentId,
            assignmentStudentId: student.id,
            submissionAnswerId: blank.submissionAnswerId,
            payload: { finalScore: correct ? 1 : 0 },
        });
    };

    const resetBlank = (questionNo, blankId) => {
        const answer = student.answers.find((entry) => entry.no === questionNo);
        const blank = answer?.blanks.find((entry) => entry.blankId === blankId);
        if (!blank?.submissionAnswerId) return;
        patchMutation.mutate({
            assignmentId,
            assignmentStudentId: student.id,
            submissionAnswerId: blank.submissionAnswerId,
            payload: { resetToAuto: true },
        });
    };

    if (!worksheet || !student) {
        const message = scoreTableQuery.isPending || detailQuery.isPending
            ? '채점 정보를 불러오는 중입니다.'
            : scoreTableQuery.error?.message || detailQuery.error?.message || '채점할 학습을 찾을 수 없습니다.';
        return <main className="grading-page grading-page--missing"><div><p>{message}</p><button type="button" onClick={() => navigate('/learning/results')}>평가 결과로 돌아가기</button></div></main>;
    }

    const completedStudents = worksheet.students.filter(isComplete).length;
    const moveStudent = (nextIndex) => {
        setStudentIndex(Math.min(Math.max(nextIndex, 0), worksheet.students.length - 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const completeGrading = () => {
        if (studentIndex < worksheet.students.length - 1) {
            moveStudent(studentIndex + 1);
            return;
        }
        navigate('/learning/results');
    };

    const selectStudent = (studentId) => moveStudent(worksheet.students.findIndex((candidate) => candidate.id === studentId));
    const startSelectedAutoGrading = (selections) => {
        const targets = Object.entries(selections).map(([assignmentStudentId, questionNos]) => ({
            assignmentStudentId: Number(assignmentStudentId),
            worksheetItemIds: questionNos.map((questionNo) => (
                worksheet.questions.find((question) => question.no === questionNo)?.worksheetItemId
            )).filter(Boolean),
        }));
        wasAutoGradingRef.current = true;
        autoMutation.mutate({ assignmentId, targets });
    };
    const autoGrading = autoMutation.isPending || progressQuery.data?.running === true;

    // 일반 학습·종합 평가 모두 학생이 보는 화면 그대로 문항을 하나씩 넘겨 보면서 채점한다.
    if (isPractice) {
        return (
            <PracticeGradingView
                worksheet={worksheet}
                student={student}
                completedCount={completedStudents}
                isComplete={isComplete}
                onSelectStudent={selectStudent}
                onMark={markBlank}
                onReset={resetBlank}
                onComplete={completeGrading}
                onExit={() => navigate('/learning/results')}
                onAutoGrade={startSelectedAutoGrading}
                isAutoGrading={autoGrading}
                errorMessage={patchMutation.error?.message || autoMutation.error?.message}
            />
        );
    }

    return (
        <AssessmentGradingView
            worksheet={worksheet}
            student={student}
            completedCount={completedStudents}
            isComplete={isComplete}
            deriveRubricChecks={deriveRubricChecks}
            onSelectStudent={selectStudent}
            onScore={updateScore}
            onReset={resetScore}
            onRubric={toggleRubric}
            onComplete={completeGrading}
            onExit={() => navigate('/learning/results')}
            onAutoGrade={startSelectedAutoGrading}
            isAutoGrading={autoGrading}
            errorMessage={patchMutation.error?.message || autoMutation.error?.message}
        />
    );
}

export default GradingPage;
