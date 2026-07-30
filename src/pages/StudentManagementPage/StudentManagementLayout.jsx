import { Outlet } from 'react-router-dom';
import Header from '../../components/Header/Header';
import StudentSidebar from '../../components/StudentSidebar/StudentSidebar';
import './StudentManagementLayout.scss';

function StudentManagementLayout() {
    return (
        <div className="student-management-page">
            <Header />
            <div className="student-management-page__body">
                <StudentSidebar />
                <main className="student-management-page__content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default StudentManagementLayout;
