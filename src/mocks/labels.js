// 학생 화면과 교사 화면이 함께 쓰는 도메인 상수와 라벨.
// 같은 값을 페이지나 mock에서 다시 선언하지 않고 이 파일에서만 관리한다.

export const difficultyLevels = ['low', 'mid', 'high'];
export const difficultyLabels = { low: '하', mid: '중', high: '상' };

export const questionFormats = [
    { value: 'choice', label: '5지선다 객관식' },
    { value: 'short', label: '주관식' },
    { value: 'essay', label: '서술형' },
];
export const formatLabels = { choice: '객관식', short: '주관식', essay: '서술형' };
export const defaultScores = { choice: 5, short: 3, essay: 5 };

export const worksheetTypeLabels = { practice: '일반 학습', assessment: '종합 평가' };
export const customLearningLabel = '맞춤 학습';
export const libraryTypeLabels = { ...worksheetTypeLabels, custom: '맞춤 문제' };

// 맞춤 출제(origin: 'custom')는 유형(type)이 아니라 출제 방식이라 라벨을 따로 고른다.
export const getWorksheetTypeLabel = (worksheet) => (
    worksheet.origin === 'custom' ? customLearningLabel : worksheetTypeLabels[worksheet.type]
);

export const customStages = ['retrace', 'basic', 'independent'];
export const customStageLabels = { retrace: '복습', basic: '유사', independent: '응용' };
// 단계 순서를 함께 보여주는 표 머리글·요약에서만 사용한다.
export const customStageStepLabels = { retrace: '① 복습', basic: '② 유사', independent: '③ 응용' };

// 학습 진행 상태 키는 학생·교사 화면이 공유하고, 라벨만 보는 사람 기준으로 나눈다.
export const assignmentStatuses = ['not-started', 'in-progress', 'submitted'];
export const studentAssignmentStatusLabels = {
    'not-started': '학습 가능',
    'in-progress': '풀이 중',
    submitted: '학습 완료',
};
export const teacherProgressStatusLabels = {
    'not-started': '미시작',
    'in-progress': '풀이 중',
    submitted: '제출 완료',
    unassigned: '미배정',
};
