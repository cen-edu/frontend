const worksheetTypes = {
    GENERAL_LEARNING: 'practice',
    COMPREHENSIVE_ASSESSMENT: 'assessment',
};

const worksheetOrigins = {
    STANDARD: 'manual',
    CUSTOM: 'custom',
};

const studentStatuses = {
    DELAYED: 'overdue',
    NEEDS_SUPPORT: 'weak',
    GOOD: 'steady',
    INSUFFICIENT_DATA: 'noData',
};

const assignmentStatuses = {
    IN_PROGRESS: 'ongoing',
    COMPLETED: 'completed',
    OVERDUE: 'overdue',
};

const formatNumber = (value) => {
    if (value === null || value === undefined) return null;
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
};

const formatMetric = (value) => {
    const number = formatNumber(value);
    if (number === null) return '-';
    return Number.isInteger(number) ? String(number) : number.toFixed(1);
};

const formatDate = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';
    return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(date);
};

const formatLatestLearning = (value) => {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return new Intl.DateTimeFormat('ko-KR', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).format(date);
};

export const formatCalculatedAt = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return `${new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    }).format(date)} 기준`;
};

export const adaptDashboardSummaries = (data) => {
    const summary = data?.summary;
    if (!summary) return [];

    const threshold = formatMetric(summary.weaknessThresholdRate);
    return [
        {
            // 맞춤 학습은 세지 않는다. 학생마다 나가는 보강이라 함께 세면 25명 반에서
            // 숫자가 수십 개로 불어나 '이번 학기에 무엇을 냈는가' 를 읽을 수 없다.
            id: 'worksheets',
            label: '배정 학습지',
            valueLabel: '이번 학기 누적',
            value: `${summary.assignmentCount ?? 0}개`,
            support: summary.inProgressAssignmentCount > 0
                ? `진행 중 ${summary.inProgressAssignmentCount}개`
                : '진행 중인 학습지 없음',
        },
        {
            id: 'accuracy',
            label: '반 평균 정답률',
            valueLabel: '원본 학습지 기준',
            value: summary.classAccuracyRate === null ? '-' : `${formatMetric(summary.classAccuracyRate)}%`,
            support: `집계 학생 ${summary.aggregatedStudentCount ?? 0}명`,
        },
        {
            id: 'pending',
            label: '미완료 제출',
            valueLabel: '배정 대비',
            value: `${summary.incompleteSubmissionCount ?? 0}건`,
            support: summary.overdueSubmissionCount > 0
                ? `기한 지난 ${summary.overdueSubmissionCount}건`
                : '기한 초과 없음',
            trend: summary.overdueSubmissionCount > 0 ? 'down' : undefined,
        },
        {
            id: 'atRisk',
            label: '취약 학생',
            valueLabel: threshold === '-' ? '기준 정보 부족' : `정답률 ${threshold}% 미만`,
            value: `${summary.weaknessStudentCount ?? 0}명`,
            support: summary.weaknessStudentCount > 0 ? '맞춤 학습 대상' : '해당 학생 없음',
        },
    ];
};

const adaptColumns = (data) => {
    const columns = (data?.worksheetColumns ?? []).map((worksheet, index) => ({
        id: String(worksheet.assignmentId),
        assignmentId: worksheet.assignmentId,
        title: worksheet.worksheetTitle,
        type: worksheetTypes[worksheet.worksheetType] ?? 'practice',
        origin: worksheetOrigins[worksheet.worksheetOrigin] ?? 'manual',
        sourceAssignmentId: worksheet.sourceAssignmentId === null
            || worksheet.sourceAssignmentId === undefined
            ? null
            : String(worksheet.sourceAssignmentId),
        orderLabel: String(index + 1),
        depth: 0,
        sourceInformationMissing: false,
    }));

    // 열 번호도 목록과 같은 규칙으로 매긴다. 맞춤 학습은 원본 번호에 -1, -2 를 붙인다.
    const childCountByParent = new Map();
    return columns.map((column) => {
        if (!column.sourceAssignmentId) return column;
        const parent = columns.find((candidate) => candidate.id === column.sourceAssignmentId);
        if (!parent) return column;
        const order = (childCountByParent.get(parent.id) ?? 0) + 1;
        childCountByParent.set(parent.id, order);
        return { ...column, depth: 1, orderLabel: `${parent.orderLabel}-${order}` };
    });
};

const adaptResult = (column, result) => {
    const backendStatus = result?.status ?? 'NOT_ASSIGNED';
    const completed = backendStatus === 'COMPLETED';
    const grading = backendStatus === 'GRADING_PENDING';
    const value = formatNumber(result?.resultValue);

    return {
        worksheetId: column.id,
        title: column.title,
        type: column.type,
        origin: column.origin,
        orderLabel: column.orderLabel,
        depth: column.depth,
        status: completed || grading ? 'submitted' : backendStatus === 'NOT_ASSIGNED' ? 'unassigned' : backendStatus === 'IN_PROGRESS' ? 'in-progress' : 'not-started',
        accuracy: completed ? value : null,
        score: completed && column.type === 'assessment' ? value : null,
        grading: grading ? 'pending' : null,
        overdue: backendStatus === 'OVERDUE',
    };
};

export const adaptStudentProgress = (data) => {
    const worksheets = adaptColumns(data);
    const students = (data?.students ?? []).map((student) => {
        const resultsByAssignment = new Map(
            (student.worksheetResults ?? []).map((result) => [String(result.assignmentId), result]),
        );
        const results = worksheets.map((worksheet) => adaptResult(
            worksheet,
            resultsByAssignment.get(worksheet.id),
        ));
        const assignedCount = student.totalAssignmentCount ?? 0;
        const submittedCount = student.completedAssignmentCount ?? 0;

        return {
            id: String(student.studentId),
            name: student.studentName,
            results,
            assignedCount,
            submittedCount,
            participation: assignedCount === 0 ? 0 : Math.round((submittedCount / assignedCount) * 100),
            accuracy: formatNumber(student.averageAccuracyRate),
            lastActivity: formatLatestLearning(student.latestLearningAt),
            status: studentStatuses[student.status] ?? 'noData',
        };
    });

    return { students, worksheets };
};

const average = (values) => {
    if (values.length === 0) return null;
    return Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10;
};

export const adaptAssignments = (data, progressData) => {
    const columns = adaptColumns(progressData);
    const columnOrder = new Map(columns.map((column) => [column.id, column.orderLabel]));
    const valuesByAssignment = new Map();

    (progressData?.students ?? []).forEach((student) => {
        (student.worksheetResults ?? []).forEach((result) => {
            const value = formatNumber(result.resultValue);
            if (result.status !== 'COMPLETED' || value === null) return;
            const id = String(result.assignmentId);
            valuesByAssignment.set(id, [...(valuesByAssignment.get(id) ?? []), value]);
        });
    });

    const rows = (data?.assignments ?? []).map((assignment, index) => {
        const id = String(assignment.assignmentId);
        const type = worksheetTypes[assignment.worksheetType] ?? 'practice';
        const resultAverage = average(valuesByAssignment.get(id) ?? []);

        return {
            id,
            analysisId: id,
            resultId: id,
            title: assignment.worksheetTitle,
            type,
            origin: worksheetOrigins[assignment.worksheetOrigin] ?? 'manual',
            // 맞춤 학습을 원본 아래로 옮길 때 쓴다. 화면에는 노출하지 않는다.
            sourceAssignmentId: assignment.sourceAssignmentId === null
                || assignment.sourceAssignmentId === undefined
                ? null
                : String(assignment.sourceAssignmentId),
            orderLabel: columnOrder.get(id) ?? String(index + 1),
            depth: 0,
            childCount: 0,
            sourceInformationMissing: false,
            resultInformationMissing: false,
            assignedAt: formatDate(assignment.assignedAt),
            // 차수 정렬용 원본 값. 화면에 쓰는 형식은 날짜까지라 같은 날 배정을 구분하지 못한다.
            assignedAtRaw: assignment.assignedAt,
            dueAt: formatDate(assignment.dueAt),
            status: assignmentStatuses[assignment.status] ?? 'ongoing',
            assignedCount: assignment.studentCount ?? 0,
            submittedCount: assignment.submittedStudentCount ?? 0,
            gradingCount: Math.max(0, (assignment.submittedStudentCount ?? 0) - (assignment.gradedStudentCount ?? 0)),
            accuracy: type === 'practice' ? resultAverage : null,
            score: type === 'assessment' ? resultAverage : null,
        };
    });

    return nestCustomLearning(rows);
};

/**
 * 맞춤 학습을 원본 학습지 바로 아래로 옮긴다.
 *
 * 맞춤 학습은 원본에서 파생된 보강이라 목록에서 동급으로 나열하면 몇 번째 학습인지 읽히지 않는다.
 * 원본을 찾지 못한 맞춤(예: 원본이 다른 학기라 목록에 없음)은 제자리에 두어 사라지지 않게 한다.
 */
const nestCustomLearning = (rows) => {
    const parents = rows.filter((row) => row.origin !== 'custom' || !row.sourceAssignmentId);
    const childrenByParent = new Map();

    rows.forEach((row) => {
        if (row.origin !== 'custom' || !row.sourceAssignmentId) return;
        const hasParent = rows.some((candidate) => candidate.id === row.sourceAssignmentId);
        if (!hasParent) return;
        const siblings = childrenByParent.get(row.sourceAssignmentId) ?? [];
        childrenByParent.set(row.sourceAssignmentId, [...siblings, row]);

    });

    const orphans = rows.filter((row) => (
        row.origin === 'custom'
        && row.sourceAssignmentId
        && !rows.some((candidate) => candidate.id === row.sourceAssignmentId)
    ));

    // 번호 순서대로 읽히게 정렬한다. 목록이 최신순인데 번호는 오름차순이라 1 아래 2 가
    // 아니라 2 아래 1 이 오는 상태였다.
    const ordered = [...parents, ...orphans].sort(compareOrderLabel);

    return ordered.flatMap((row) => {
        // 맞춤은 1차, 2차로 이어지는 사슬이다. 깊이를 더하지 않고 형제로 두되 배정한
        // 순서대로 번호를 붙여 1-1 이 1차, 1-2 가 2차가 되게 한다. API 는 최신순으로 준다.
        const children = [...(childrenByParent.get(row.id) ?? [])]
            .sort((left, right) => (
                new Date(left.assignedAtRaw ?? 0) - new Date(right.assignedAtRaw ?? 0)
            ));
        return [
            { ...row, childCount: children.length },
            ...children.map((child, index) => ({
                ...child,
                depth: 1,
                orderLabel: `${row.orderLabel}-${index + 1}`,
                sessionLabel: `${index + 1}차`,
            })),
        ];
    });
};

/** 1, 2, 10 순으로 읽히도록 번호를 숫자로 비교한다. 문자열 정렬이면 10 이 2 앞에 온다. */
const compareOrderLabel = (left, right) => {
    const toNumber = (row) => {
        const parsed = Number.parseInt(row.orderLabel, 10);
        return Number.isNaN(parsed) ? Number.MAX_SAFE_INTEGER : parsed;
    };
    return toNumber(left) - toNumber(right);
};
