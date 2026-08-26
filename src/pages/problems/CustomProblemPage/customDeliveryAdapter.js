const toTime = (value) => {
    const time = value ? new Date(value).getTime() : 0;
    return Number.isNaN(time) ? 0 : time;
};

const getLatestSession = (sessions = []) => sessions.reduce((latest, session) => {
    if (!latest) return session;
    if (session.sessionNumber !== latest.sessionNumber) {
        return session.sessionNumber > latest.sessionNumber ? session : latest;
    }
    return toTime(session.assignedAt) > toTime(latest.assignedAt) ? session : latest;
}, null);

export const resolveCustomParentWorksheetId = ({
    sourceAssignmentId,
    sessions,
    learningStatusAssignments,
}) => {
    const latestSession = getLatestSession(sessions);
    const parentAssignmentId = latestSession?.customAssignmentId ?? sourceAssignmentId;
    const parentAssignment = (learningStatusAssignments ?? []).find((assignment) => (
        String(assignment.assignmentId) === String(parentAssignmentId)
    ));

    return parentAssignment?.worksheetId ?? null;
};

export const buildCustomWorksheetTitle = ({ sourceTitle, studentName }) => (
    `${sourceTitle ?? '원 학습지'} · ${studentName ?? '학생'} 맞춤 학습`.slice(0, 100)
);

export const getCustomDeliveryErrorMessage = (error, worksheetSaved) => {
    const messages = {
        INVALID_INPUT_VALUE: '학습지 이름과 제출 기한을 다시 확인해 주세요.',
        WORKSHEET_DUE_IN_PAST: '제출 기한은 현재보다 미래로 설정해 주세요.',
        WORKSHEET_NOT_FOUND: '원본 또는 저장된 학습지를 찾을 수 없습니다.',
        WORKSHEET_PARENT_MISMATCH: '맞춤 학습 회차 연결 정보가 변경되었습니다. 문제를 다시 생성해 주세요.',
        WORKSHEET_DUPLICATE_ASSIGNMENT: '이미 이 학생에게 배정된 맞춤 학습지입니다.',
        WORKSHEET_SPEC_MISMATCH: '생성된 문항 구성과 학습지 정보가 일치하지 않습니다.',
        PROBLEM_AUTHORING_SESSION_NOT_FOUND: '생성된 문항 세션을 찾을 수 없습니다. 문제를 다시 생성해 주세요.',
    };
    const message = messages[error?.code] ?? error?.message ?? '맞춤 학습지를 저장하고 배정하지 못했습니다.';

    return worksheetSaved
        ? `맞춤 학습지는 저장되었습니다. ${message}`
        : message;
};
