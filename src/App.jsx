import { Routes, Route } from 'react-router-dom';
import './App.css'
import LoginPage from './pages/LoginPage/LoginPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import ClassManagementPage from './pages/StudentManagementPage/ClassManagementPage';
import ClassCreationRoutePage from './pages/StudentManagementPage/ClassCreationRoutePage';
import ClassEditRoutePage from './pages/StudentManagementPage/ClassEditRoutePage';
import StudentListPage from './pages/StudentManagementPage/StudentListPage';
import StudentManagementLayout from './pages/StudentManagementPage/StudentManagementLayout';

function App() {
  return (
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/students/classes/new" element={<ClassCreationRoutePage />} />
        <Route path="/students/classes/:classId/edit" element={<ClassEditRoutePage />} />
        <Route path="/students" element={<StudentManagementLayout />}>
          <Route index element={<StudentListPage />} />
          <Route path="classes" element={<ClassManagementPage />} />
        </Route>
      </Routes>
  )
}

export default App
