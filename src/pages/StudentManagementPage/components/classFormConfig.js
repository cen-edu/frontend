export const CURRENT_ACADEMIC_YEAR = String(new Date().getFullYear());

// 어느 반에도 속하지 않은 학생을 가리키는 필터 값이다.
export const UNASSIGNED_CLASS = 'unassigned';

export function formatClassLabel(classItem) {
    return `${classItem.year}학년도 ${classItem.grade}학년 ${classItem.name}`;
}
