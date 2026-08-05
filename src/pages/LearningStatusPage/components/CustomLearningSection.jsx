import { useState } from 'react';
import AssignmentProgressPanel from './AssignmentProgressPanel';

function CustomLearningDetail({ assignment, statusOptions }) {
    const [status, setStatus] = useState('all');
    const students = assignment.students.filter((student) => {
        if (status === 'unsubmitted') return student.status !== 'submitted';
        return status === 'all' || student.status === status;
    });

    return (
        <AssignmentProgressPanel
            assignment={assignment}
            students={students}
            status={status}
            statusOptions={statusOptions}
            onStatusChange={setStatus}
            titleId={`custom-learning-title-${assignment.id}`}
            className="custom-learning-detail"
        />
    );
}

function CustomLearningSection({ assignments, statusOptions }) {
    if (assignments.length === 0) return null;

    return (
        <section className="custom-learning-list" aria-label="맞춤 학습 현황">
            <div className="custom-learning-list__items">
                {assignments.map((assignment) => <CustomLearningDetail key={assignment.id} assignment={assignment} statusOptions={statusOptions} />)}
            </div>
        </section>
    );
}

export default CustomLearningSection;
