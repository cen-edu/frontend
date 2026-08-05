import students from './students';

// 반 데이터. `classId`는 학습 관리·대시보드·취약점 분석이 공통으로 쓰는 식별자이고
// 화면 라벨은 `year`, `grade`, `name`을 조합해 만든다.
const classes = [
    {
        id: 1,
        classId: 'middle-1-1',
        gradeId: 'middle-1',
        year: '2026',
        grade: '1',
        name: '1반',
        studentSummary: '송현우 외 7명',
        studentCount: 8,
        teacher: '이하영 선생님',
        teacherIds: [1],
        studentIds: [1, 4, 7, 11, 12, 13, 14, 15],
    },
    {
        id: 2,
        classId: 'middle-1-2',
        gradeId: 'middle-1',
        year: '2026',
        grade: '1',
        name: '2반',
        studentSummary: '서지민 외 4명',
        studentCount: 5,
        teacher: '이하영 선생님',
        teacherIds: [1],
        studentIds: [16, 17, 18, 19, 20],
    },
    {
        id: 3,
        classId: 'middle-2-2',
        gradeId: 'middle-2',
        year: '2026',
        grade: '2',
        name: '2반',
        studentSummary: '강채원 외 3명',
        studentCount: 4,
        teacher: '이하영 선생님',
        teacherIds: [1],
        studentIds: [2, 5, 8, 9],
    },
];

export const getClassLabel = (classItem) => `${classItem.year}학년도 ${classItem.grade}학년 ${classItem.name}`;
export const getClassName = (classItem) => `중학교 ${classItem.grade}학년 ${classItem.name}`;

// 교사 화면의 학생 표는 모두 이 명단을 쓴다. 출석 순서는 반의 studentIds 순서를 따른다.
export const getClassRoster = (classId) => {
    const classItem = classes.find((item) => item.classId === classId);
    if (!classItem) return [];
    return classItem.studentIds.map((studentId, index) => {
        const student = students.find((item) => item.id === studentId);
        return { id: studentId, number: index + 1, name: student?.name ?? '' };
    });
};

export default classes;
