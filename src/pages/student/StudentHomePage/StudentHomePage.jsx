import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../../components/Header/Header';
import { getStudentAssignments } from '../../../mocks/studentAssignments';
import students from '../../../mocks/students';
import AssignmentBrowser from './components/AssignmentBrowser';
import './StudentHomePage.scss';

function StudentHomePage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const requestedStudentId = Number(searchParams.get('student'));
    const student = students.find((item) => item.id === requestedStudentId) ?? students[0];
    const assignments = useMemo(() => getStudentAssignments(student.id), [student.id]);
    const [activeFilter, setActiveFilter] = useState('all');
    const visibleAssignments = assignments.filter((assignment) => assignment.status !== 'submitted');
    const inProgressCount = visibleAssignments.filter((assignment) => assignment.status === 'in-progress').length;
    const availableCount = visibleAssignments.filter((assignment) => assignment.status === 'not-started').length;

    return (
        <div className="student-home">
            <Header mode="student" userName={student.name} />
            <main className="student-home__main">
                <section className="student-home__summary" aria-label="학습 요약">
                    <div><span>전체 학습</span><strong>{visibleAssignments.length}<small>개</small></strong></div>
                    <div><span>학습 가능</span><strong>{availableCount}<small>개</small></strong></div>
                    <div><span>풀이 중</span><strong>{inProgressCount}<small>개</small></strong></div>
                </section>

                <AssignmentBrowser
                    assignments={visibleAssignments}
                    activeFilter={activeFilter}
                    onFilterChange={(filter) => {
                        setActiveFilter(filter);
                    }}
                    selectedId={null}
                    onSelect={(assignmentId) => navigate(`/student/worksheets/${assignmentId}/solve?student=${student.id}`)}
                />
            </main>
        </div>
    );
}

export default StudentHomePage;
