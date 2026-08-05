import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import {
    getStudentAssignments,
    studentAssignmentStatusLabels,
} from '../../mocks/studentAssignments';
import students from '../../mocks/students';
import formatRelativeDueDate from '../../utils/formatRelativeDueDate';
import './StudentWorksheetPage.scss';

const gradeOptions = ['1', '2', '3'];
const termOptions = [
    { value: 'first', label: '1학기' },
    { value: 'second', label: '2학기' },
];
const typeOptions = [
    { value: 'all', label: '전체' },
    { value: 'homework', label: '숙제' },
    { value: 'assessment', label: '평가' },
];
const statusOptions = [
    { value: 'all', label: '전체' },
    { value: 'not-started', label: '학습 가능' },
    { value: 'in-progress', label: '풀이 중' },
    { value: 'submitted', label: '학습 완료' },
];

const getResult = (assignment) => {
    if (assignment.status !== 'submitted' || !assignment.resultReady) return '-';
    if (assignment.type === 'assessment') return `${assignment.score}점`;
    return `${assignment.correctUnits}/${assignment.totalUnits}`;
};

const getAssignmentCategory = (assignment) => (
    assignment.type === 'assessment' ? 'assessment' : 'homework'
);

function FilterButtons({ label, options, value, onChange }) {
    return (
        <div className="student-worksheets__filter-group">
            <span className="student-worksheets__filter-label">{label}</span>
            <div className="student-worksheets__filter-options" role="group" aria-label={label}>
                {options.map((option) => {
                    const item = typeof option === 'string'
                        ? { value: option, label: `${option}학년` }
                        : option;

                    return (
                        <button
                            key={item.value}
                            type="button"
                            aria-pressed={value === item.value}
                            className={`student-worksheets__filter-button${value === item.value ? ' student-worksheets__filter-button--active' : ''}`}
                            onClick={() => onChange(item.value)}
                        >
                            {item.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

function StudentWorksheetPage() {
    const [searchParams] = useSearchParams();
    const requestedStudentId = Number(searchParams.get('student'));
    const student = students.find((item) => item.id === requestedStudentId) ?? students[0];
    const assignments = useMemo(() => getStudentAssignments(student.id), [student.id]);
    const [grade, setGrade] = useState(student.grade);
    const [term, setTerm] = useState('second');
    const [type, setType] = useState('all');
    const [status, setStatus] = useState('all');

    const filteredAssignments = assignments.filter((assignment) => (
        assignment.grade === grade
        && assignment.term === term
        && (type === 'all' || getAssignmentCategory(assignment) === type)
        && (status === 'all' || assignment.status === status)
    ));

    return (
        <div className="student-worksheets">
            <Header mode="student" userName={student.name} />
            <main className="student-worksheets__main">
                <div className="student-worksheets__heading">
                    <div>
                        <h1>학습지</h1>
                        <p>학년, 학기와 학습 상태에 따라 배정된 학습지를 확인합니다.</p>
                    </div>
                    <span>총 {filteredAssignments.length}개</span>
                </div>

                <section className="student-worksheets__filters" aria-label="학습지 조회 조건">
                    <FilterButtons label="학년" options={gradeOptions} value={grade} onChange={setGrade} />
                    <FilterButtons label="학기" options={termOptions} value={term} onChange={setTerm} />
                    <FilterButtons label="유형" options={typeOptions} value={type} onChange={setType} />
                    <FilterButtons label="상태" options={statusOptions} value={status} onChange={setStatus} />
                </section>

                <section className="student-worksheets__table-section" aria-label="학습지 목록">
                    <div className="student-worksheets__table-scroll">
                        <table className="student-worksheets__table">
                            <thead>
                                <tr>
                                    <th scope="col">출제일</th>
                                    <th scope="col">상태</th>
                                    <th scope="col">학습지명</th>
                                    <th scope="col">결과</th>
                                    <th scope="col">마감일</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAssignments.map((assignment) => (
                                    <tr key={assignment.id}>
                                        <td>{assignment.assignedAt}</td>
                                        <td>
                                            <span className={`student-worksheets__status student-worksheets__status--${assignment.status}`}>
                                                {studentAssignmentStatusLabels[assignment.status]}
                                            </span>
                                        </td>
                                        <td className="student-worksheets__title">{assignment.title}</td>
                                        <td className="student-worksheets__result">{getResult(assignment)}</td>
                                        <td>{formatRelativeDueDate(assignment.dueAt)}</td>
                                    </tr>
                                ))}
                                {filteredAssignments.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="student-worksheets__empty">
                                            선택한 조건에 해당하는 학습지가 없습니다.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default StudentWorksheetPage;
