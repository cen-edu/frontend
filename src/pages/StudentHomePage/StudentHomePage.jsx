import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { getStudentAssignments } from '../../mocks/studentAssignments';
import students from '../../mocks/students';
import AssignmentBrowser from './components/AssignmentBrowser';
import './StudentHomePage.scss';

function StudentHomePage() {
    const [searchParams] = useSearchParams();
    const requestedStudentId = Number(searchParams.get('student'));
    const student = students.find((item) => item.id === requestedStudentId) ?? students[0];
    const assignments = useMemo(() => getStudentAssignments(student.id), [student.id]);
    const [activeFilter, setActiveFilter] = useState('all');
    const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
    const activeAssignments = assignments.filter((assignment) => assignment.status !== 'submitted');
    const completedAssignments = assignments.filter((assignment) => assignment.status === 'submitted');
    const inProgressCount = activeAssignments.filter((assignment) => assignment.status === 'in-progress').length;

    return (
        <div className="student-home">
            <Header mode="student" userName={student.name} />
            <main className="student-home__main">
                <section className="student-home__summary" aria-label="학습 요약">
                    <div><span>진행 중</span><strong>{inProgressCount}<small>개</small></strong></div>
                    <div><span>시작 전</span><strong>{activeAssignments.length - inProgressCount}<small>개</small></strong></div>
                    <div><span>완료한 학습</span><strong>{completedAssignments.length}<small>개</small></strong></div>
                </section>

                <AssignmentBrowser
                    assignments={assignments}
                    activeFilter={activeFilter}
                    onFilterChange={(filter) => {
                        setActiveFilter(filter);
                        setSelectedAssignmentId(null);
                    }}
                    selectedId={selectedAssignmentId}
                    onSelect={setSelectedAssignmentId}
                />
            </main>
        </div>
    );
}

export default StudentHomePage;
