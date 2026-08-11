export const CURRENT_ACADEMIC_YEAR = String(new Date().getFullYear());

export function formatClassLabel(classItem) {
    return `${classItem.year}학년도 ${classItem.grade}학년 ${classItem.name}`;
}
