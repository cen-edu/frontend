import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getAuth } from '../../../api/auth/authStorage.js';
import Header from '../../../components/Header/Header';
import { useStudentAssignmentsQuery } from '../studentAssignmentHooks.js';
import AssignmentBrowser from './components/AssignmentBrowser';
import './StudentHomePage.scss';

function StudentHomePage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const studentQuery = searchParams.get('student');
    const auth = getAuth();
    const { data: assignments = [], isPending, error } = useStudentAssignmentsQuery();
    const [activeFilter, setActiveFilter] = useState('all');
    const visibleAssignments = assignments.filter((assignment) => !['submitted', 'not-submitted'].includes(assignment.status));
    const inProgressCount = visibleAssignments.filter((assignment) => assignment.status === 'in-progress').length;
    const availableCount = visibleAssignments.filter((assignment) => assignment.status === 'not-started').length;

    return (
        <div className="student-home">
            <Header mode="student" userName={auth?.name ?? '학생'} />
            <main className="student-home__main">
                <section className="student-home__summary" aria-label="학습 요약">
                    <div><span>전체 학습</span><strong>{visibleAssignments.length}<small>개</small></strong></div>
                    <div><span>학습 가능</span><strong>{availableCount}<small>개</small></strong></div>
                    <div><span>풀이 중</span><strong>{inProgressCount}<small>개</small></strong></div>
                </section>

                {isPending ? (
                    <section className="student-home__browser" aria-live="polite">학습지를 불러오는 중입니다.</section>
                ) : error ? (
                    <section className="student-home__browser" role="alert">{error.message}</section>
                ) : (
                    <AssignmentBrowser
                        assignments={visibleAssignments}
                        activeFilter={activeFilter}
                        onFilterChange={setActiveFilter}
                        selectedId={null}
                        onSelect={(assignmentId) => navigate(`/student/worksheets/${assignmentId}/solve${studentQuery ? `?student=${encodeURIComponent(studentQuery)}` : ''}`)}
                    />
                )}
            </main>
        </div>
    );
}

export default StudentHomePage;
