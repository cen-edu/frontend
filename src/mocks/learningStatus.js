import { getClassName, getClassRoster } from './classes';
import { teacherProgressStatusLabels } from './labels';

export const learningFilterOptions = {
    grades: [
        { value: 'all', label: '전체 학년' },
        { value: 'middle-1', label: '1학년' },
    ],
    classes: [
        { value: 'all', label: '전체 반' },
        { value: 'middle-1-1', label: '1반' },
        { value: 'middle-1-2', label: '2반' },
    ],
    terms: [
        { value: 'all', label: '전체 학기' },
        { value: 'first', label: '1학기' },
        { value: 'second', label: '2학기' },
    ],
    studentStatuses: [
        { value: 'all', label: '전체 상태' },
        { value: 'submitted', label: teacherProgressStatusLabels.submitted },
        { value: 'in-progress', label: teacherProgressStatusLabels['in-progress'] },
        { value: 'not-started', label: teacherProgressStatusLabels['not-started'] },
        { value: 'unsubmitted', label: '미제출' },
    ],
};

const classOne = { classId: 'middle-1-1', gradeId: 'middle-1', className: getClassName({ grade: '1', name: '1반' }) };
const classTwo = { classId: 'middle-1-2', gradeId: 'middle-1', className: getClassName({ grade: '1', name: '2반' }) };

const idle = { status: 'not-started', doneUnits: 0, grading: null, score: null, submittedAt: '-' };
const solving = (doneUnits) => ({ status: 'in-progress', doneUnits, grading: null, score: null, submittedAt: '-' });
// 일반 학습은 점수를 두지 않고 제출 여부와 진행 칸 수만 기록한다.
const done = (doneUnits, submittedAt) => ({ status: 'submitted', doneUnits, grading: null, score: null, submittedAt });
const graded = (doneUnits, score, submittedAt) => ({ status: 'submitted', doneUnits, grading: 'done', score, submittedAt });
const awaiting = (doneUnits, submittedAt) => ({ status: 'submitted', doneUnits, grading: 'pending', score: null, submittedAt });

// 학생 표는 반 명단(classes.js)을 기준으로 만들고 학습별 진행 상태만 덮어쓴다.
const withRoster = (classId, progressById) => getClassRoster(classId)
    .filter((student) => progressById[student.id])
    .map((student) => ({ ...student, ...progressById[student.id] }));

export const learningAssignments = [
    {
        id: 'factor-assessment',
        analysisWorksheetId: 'factor-assessment',
        sourceWorksheetId: null,
        ...classOne,
        term: 'second',
        title: '2단원 소인수분해 종합 평가',
        subject: '수학',
        type: 'assessment',
        origin: 'manual',
        totalUnits: 10,
        assignedAt: '2026.08.04',
        dueAt: '2026.08.08 18:00',
        status: 'ongoing',
        // 취약점 분석에서 자료 부족으로 분류된 송현우만 아직 시작하지 않았다.
        students: withRoster('middle-1-1', {
            1: idle,
            4: graded(10, 84, '07.30 10:12'),
            7: awaiting(10, '07.30 15:02'),
            11: graded(10, 92, '08.01 09:12'),
            12: awaiting(10, '08.01 09:25'),
            13: graded(10, 52, '08.01 11:40'),
            14: graded(10, 86, '07.31 16:40'),
            15: graded(10, 66, '08.02 13:05'),
        }),
    },
    {
        id: 'factor-practice',
        analysisWorksheetId: 'factor-practice',
        sourceWorksheetId: null,
        ...classOne,
        term: 'second',
        title: '2단원 소인수분해 연습',
        subject: '수학',
        type: 'practice',
        origin: 'manual',
        totalUnits: 10,
        assignedAt: '2026.08.01',
        dueAt: '2026.08.07 18:00',
        status: 'ongoing',
        // 송현우의 진행 칸 수는 학생앱(studentAssignments)의 factor-practice 값과 같아야 한다.
        students: withRoster('middle-1-1', {
            1: solving(7),
            4: done(10, '08.02 09:40'),
            7: done(10, '08.02 11:21'),
            11: done(10, '08.02 16:20'),
            12: done(10, '08.03 10:02'),
            13: done(10, '08.02 17:45'),
            14: done(10, '08.02 14:05'),
            15: done(10, '08.03 09:30'),
        }),
    },
    {
        // 원본 학습지의 취약점 분석에서 파생된 맞춤 학습. sourceWorksheetId 로 원본과 연결하고
        // 학습 목록에는 노출하지 않으며 원본 학습지 상세 하단에 바로 표시한다.
        id: 'factor-custom',
        analysisWorksheetId: 'factor-practice',
        sourceWorksheetId: 'factor-practice',
        ...classOne,
        term: 'second',
        title: '공통소인수 맞춤 학습',
        subject: '수학',
        type: 'practice',
        origin: 'custom',
        assignedAt: '2026.08.03',
        dueAt: '2026.08.07 18:00',
        status: 'ongoing',
        // 맞춤 학습은 학생마다 문항 수가 달라 총 풀이 칸 수를 학생 값으로 저장한다.
        students: withRoster('middle-1-1', {
            1: { ...idle, totalUnits: 12 },
            11: { ...done(9, '08.04 17:20'), totalUnits: 9 },
            13: { ...done(15, '08.04 13:14'), totalUnits: 15 },
            15: { ...done(10, '08.04 14:32'), totalUnits: 10 },
        }),
    },
    {
        id: 'integer-assessment',
        analysisWorksheetId: 'factor-assessment',
        sourceWorksheetId: null,
        ...classOne,
        term: 'second',
        title: '1단원 정수와 유리수 종합 평가',
        subject: '수학',
        type: 'assessment',
        origin: 'manual',
        totalUnits: 10,
        assignedAt: '2026.07.18',
        dueAt: '2026.07.25 18:00',
        status: 'completed',
        students: withRoster('middle-1-1', {
            1: graded(10, 91, '07.25 14:08'),
            4: graded(10, 84, '07.25 13:42'),
            7: graded(10, 88, '07.24 16:03'),
            11: graded(10, 76, '07.25 15:11'),
            12: graded(10, 82, '07.25 10:24'),
            13: graded(10, 69, '07.25 17:36'),
            14: graded(10, 89, '07.24 11:50'),
            15: idle,
        }),
    },
    {
        id: 'integer-practice',
        analysisWorksheetId: 'factor-practice',
        sourceWorksheetId: null,
        ...classOne,
        term: 'second',
        title: '1단원 정수와 유리수 연습',
        subject: '수학',
        type: 'practice',
        origin: 'manual',
        totalUnits: 10,
        assignedAt: '2026.07.24',
        dueAt: '2026.07.31 18:00',
        status: 'completed',
        students: withRoster('middle-1-1', {
            1: done(10, '07.30 16:42'),
            4: done(10, '07.29 10:18'),
            7: done(10, '07.31 09:44'),
            11: done(10, '07.30 18:05'),
            12: done(10, '07.28 15:33'),
            13: done(6, '07.31 17:58'),
            14: done(10, '07.29 20:11'),
            15: done(10, '07.30 13:27'),
        }),
    },
    {
        id: 'equation-practice',
        analysisWorksheetId: 'factor-practice',
        sourceWorksheetId: null,
        ...classOne,
        term: 'first',
        title: '3단원 일차방정식 연습',
        subject: '수학',
        type: 'practice',
        origin: 'manual',
        totalUnits: 10,
        assignedAt: '2026.04.14',
        dueAt: '2026.04.21 18:00',
        status: 'completed',
        students: withRoster('middle-1-1', {
            1: done(9, '04.20 17:10'),
            4: done(10, '04.19 09:31'),
            7: done(10, '04.20 20:05'),
            11: done(8, '04.21 17:44'),
            12: done(10, '04.18 14:12'),
            13: done(7, '04.21 18:02'),
            14: done(10, '04.19 16:27'),
            15: idle,
        }),
    },
    {
        id: 'factor-practice-class2',
        analysisWorksheetId: 'factor-practice',
        sourceWorksheetId: null,
        ...classTwo,
        term: 'second',
        title: '2단원 소인수분해 연습',
        subject: '수학',
        type: 'practice',
        origin: 'manual',
        totalUnits: 10,
        assignedAt: '2026.08.01',
        dueAt: '2026.08.07 18:00',
        status: 'ongoing',
        students: withRoster('middle-1-2', {
            16: done(10, '08.03 09:14'),
            17: done(10, '08.03 11:26'),
            18: done(10, '08.03 16:40'),
            19: done(10, '08.02 15:08'),
            20: idle,
        }),
    },
];
