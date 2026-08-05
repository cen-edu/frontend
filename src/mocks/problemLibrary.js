import { generateAssessmentProblems } from './assessmentCreation';
import classes, { getClassLabel } from './classes';
import { customStages, libraryTypeLabels } from './labels';
import { generateProblems } from './problemCreation';
import students from './students';

const primeUnit = { id: 'm1s1-prime-factor', name: '소인수분해', majorName: '수와 연산', middleName: '소인수분해' };
const equationUnit = { id: 'm1s1-linear-equation', name: '일차방정식', majorName: '문자와 식', middleName: '일차방정식' };

const practiceProblems = (unit = primeUnit) => generateProblems([
    { unit, counts: { low: 1, mid: 2, high: 1 } },
]);

const assessmentProblems = generateAssessmentProblems([
    { unit: primeUnit, format: 'choice', difficulty: 'low', count: 2 },
    { unit: primeUnit, format: 'short', difficulty: 'mid', count: 1 },
    { unit: primeUnit, format: 'essay', difficulty: 'high', count: 1 },
]);

const customProblems = (studentId) => practiceProblems().slice(0, 3).map((problem, index) => ({
    ...problem,
    id: `student-${studentId}-${problem.id}-${index + 1}`,
    no: index + 1,
    stage: customStages[index],
    sourceQuestionNo: 3,
}));

export const libraryStatusLabels = { draft: '미출제', assigned: '출제됨' };
export { libraryTypeLabels };

const classOneLabel = getClassLabel(classes.find((item) => item.classId === 'middle-1-1'));
const studentName = (id) => students.find((student) => student.id === id)?.name ?? '';

export const libraryWorksheets = [
    {
        id: 'factor-practice', type: 'practice', origin: 'manual', title: '2단원 소인수분해 연습', gradeId: 'middle-1', subjectId: 'math', term: 'second',
        unitSummary: '수와 연산 · 소인수분해 외 1', createdAt: '2026.07.28', problemCount: 4, totalScore: null, problems: practiceProblems(), custom: null,
        assignments: [{ classId: 'middle-1-1', className: classOneLabel, assignedAt: '2026.08.01', dueAt: '2026.08.07 18:00', status: 'ongoing' }],
    },
    {
        id: 'factor-assessment', type: 'assessment', origin: 'manual', title: '2단원 소인수분해 종합 평가', gradeId: 'middle-1', subjectId: 'math', term: 'second',
        unitSummary: '수와 연산 · 소수와 합성수 외 2', createdAt: '2026.07.26', problemCount: 4, totalScore: assessmentProblems.reduce((sum, problem) => sum + problem.maxScore, 0), problems: assessmentProblems, custom: null,
        assignments: [{ classId: 'middle-1-1', className: classOneLabel, assignedAt: '2026.08.04', dueAt: '2026.08.08 18:00', status: 'ongoing' }],
    },
    {
        id: 'linear-equation-practice', type: 'practice', origin: 'manual', title: '일차방정식 개념 확인', gradeId: 'middle-1', subjectId: 'math', term: 'second',
        unitSummary: '문자와 식 · 일차방정식', createdAt: '2026.08.01', problemCount: 4, totalScore: null, problems: practiceProblems(equationUnit), custom: null, assignments: [],
    },
    {
        id: 'factor-custom-11', type: 'practice', origin: 'custom', title: `${studentName(11)} 소인수분해 맞춤 복습`, gradeId: 'middle-1', subjectId: 'math', term: 'second',
        unitSummary: '수와 연산 · 소인수분해', createdAt: '2026.08.03', problemCount: 3, totalScore: null, problems: customProblems(11),
        assignments: [{ classId: 'middle-1-1', className: studentName(11), assignedAt: '2026.08.03', dueAt: '2026.08.07 18:00', status: 'ongoing' }],
        custom: { sourceWorksheetId: 'factor-practice', sourceTitle: '2단원 소인수분해 연습', studentId: 11, studentName: studentName(11), weakConcept: '공통소인수', stageCounts: { retrace: 1, basic: 1, independent: 1 } },
    },
    {
        id: 'factor-custom-13', type: 'practice', origin: 'custom', title: `${studentName(13)} 소인수분해 맞춤 복습`, gradeId: 'middle-1', subjectId: 'math', term: 'second',
        unitSummary: '수와 연산 · 최대공약수', createdAt: '2026.08.03', problemCount: 3, totalScore: null, problems: customProblems(13),
        assignments: [{ classId: 'middle-1-1', className: studentName(13), assignedAt: '2026.08.03', dueAt: '2026.08.07 18:00', status: 'ongoing' }],
        custom: { sourceWorksheetId: 'factor-practice', sourceTitle: '2단원 소인수분해 연습', studentId: 13, studentName: studentName(13), weakConcept: '소인수분해', stageCounts: { retrace: 1, basic: 1, independent: 1 } },
    },
];

let workingLibraryWorksheets = libraryWorksheets;

export const getLibraryWorksheets = () => workingLibraryWorksheets;

export const updateLibraryWorksheet = (worksheetId, updater) => {
    workingLibraryWorksheets = workingLibraryWorksheets.map((worksheet) => worksheet.id === worksheetId ? updater(worksheet) : worksheet);
    return workingLibraryWorksheets.find((worksheet) => worksheet.id === worksheetId);
};

export const removeLibraryWorksheet = (worksheetId) => {
    workingLibraryWorksheets = workingLibraryWorksheets.filter((worksheet) => worksheet.id !== worksheetId);
};

// 실제 연동에서는 출제 시 학습 현황 assignment를 생성하고 이 목록을 서버 응답으로 갱신한다.
