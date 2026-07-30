import Header from '../../components/Header/Header';
import StudentSidebar from '../../components/StudentSidebar/StudentSidebar';
import './StudentManagementPage.scss';

function StudentManagementPage() {
    return (
        <div className="student-management-page">
            <Header />

            <div className="student-management-page__body">
                <StudentSidebar />
                <main className="student-management-page__content" />
            </div>
        </div>
    );
}

export default StudentManagementPage;
