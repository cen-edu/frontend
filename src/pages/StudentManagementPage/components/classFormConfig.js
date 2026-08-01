export const CURRENT_ACADEMIC_YEAR = String(new Date().getFullYear());

export const ACADEMIC_YEAR_OPTIONS = Array.from({ length: 5 }, (_, index) => {
    const year = String(Number(CURRENT_ACADEMIC_YEAR) + 1 - index);
    return { value: year, label: `${year}학년도` };
});

export function formatClassLabel(classItem) {
    return `${classItem.year}학년도 ${classItem.grade}학년 ${classItem.name}`;
}
