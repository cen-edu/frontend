export const CURRENT_ACADEMIC_YEAR = new Date().getFullYear();

export function formatClassLabel(classItem) {
    return `${classItem.academicYear}학년도 ${classItem.grade}학년 ${classItem.name}`;
}
