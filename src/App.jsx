import { Routes, Route } from 'react-router-dom';
import './App.css'
import LoginPage from './pages/LoginPage/LoginPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import StudentManagementPage from './pages/StudentManagementPage/StudentManagementPage';

function App() {
  return (
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/students" element={<StudentManagementPage />} />
        <Route path="/students/classes" element={<StudentManagementPage />} />
      </Routes>
  )
}

export default App
