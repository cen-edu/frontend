import AssignmentProgressPanel from './AssignmentProgressPanel';
import CustomLearningSection from './CustomLearningSection';

function StudentProgressTable({
    assignment,
    students,
    status,
    statusOptions,
    onStatusChange,
    customAssignments = [],
}) {
    if (!assignment) {
        return (
            <section className="learning-panel learning-students learning-students--empty">
                <i className="bi bi-inbox" aria-hidden="true" />
                <p>확인할 학습을 선택해 주세요.</p>
            </section>
        );
    }

    return (
        <div className="learning-status__details">
            <AssignmentProgressPanel
                assignment={assignment}
                students={students}
                status={status}
                statusOptions={statusOptions}
                onStatusChange={onStatusChange}
                titleId="student-progress-title"
            />
            <CustomLearningSection assignments={customAssignments} statusOptions={statusOptions} />
        </div>
    );
}

export default StudentProgressTable;
