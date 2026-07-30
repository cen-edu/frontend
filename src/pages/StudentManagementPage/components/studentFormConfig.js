export const SCHOOL_LEVELS = {
    elementary: { label: '초', years: 6 },
    middle: { label: '중', years: 3 },
    high: { label: '고', years: 3 },
};

export const EMPTY_STUDENT_FORM = {
    name: '',
    attendanceNumber: '',
    studentPhone: '',
    parentPhone: '',
    school: '',
    classStartDate: '',
    birthDate: '',
    email: '',
    address: '',
    homePhone: '',
    note: '',
};

const levelByLabel = { 초: 'elementary', 중: 'middle', 고: 'high' };

export function createGradeOptions(schoolLevel) {
    return Array.from(
        { length: SCHOOL_LEVELS[schoolLevel].years },
        (_, index) => ({ value: String(index + 1), label: `${index + 1}학년` }),
    );
}

export function formatGrade(schoolLevel, gradeYear) {
    return `${SCHOOL_LEVELS[schoolLevel].label}${gradeYear}`;
}

export function parseGrade(grade) {
    return {
        schoolLevel: levelByLabel[grade?.[0]] ?? 'middle',
        gradeYear: grade?.slice(1) || '1',
    };
}
