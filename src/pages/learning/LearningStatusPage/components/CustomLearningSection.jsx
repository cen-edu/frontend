import { useState } from 'react';
import { useLearningStatusStudentsQuery } from '../learningStatusHooks';
import AssignmentProgressPanel from './AssignmentProgressPanel';

function CustomLearningDetail({ assignment, statusOptions }) {
    const [status, setStatus] = useState('all');
    const studentsQuery = useLearningStatusStudentsQuery({
        assignmentId: assignment.assignmentId,
        status: status === 'all' ? undefined : status,
    });
    const detailAssignment = { ...assignment, ...studentsQuery.data };

    return (
        <AssignmentProgressPanel
            assignment={detailAssignment}
            students={studentsQuery.data?.students ?? []}
            status={status}
            statusOptions={statusOptions}
            onStatusChange={setStatus}
            titleId={`custom-learning-title-${assignment.assignmentId}`}
            className="custom-learning-detail"
        />
    );
}

function CustomLearningSection({ assignments, statusOptions }) {
    if (assignments.length === 0) return null;

    return (
        <section className="custom-learning-list" aria-label="맞춤 학습 현황">
            <div className="custom-learning-list__items">
                {assignments.map((assignment) => <CustomLearningDetail key={assignment.assignmentId} assignment={assignment} statusOptions={statusOptions} />)}
            </div>
        </section>
    );
}

export default CustomLearningSection;
