import { Routes, Route } from 'react-router-dom';
import './App.css'
import LoginPage from './pages/auth/LoginPage/LoginPage';
import SignupPage from './pages/auth/SignupPage/SignupPage';
import DashboardPage from './pages/dashboard/DashboardPage/DashboardPage';
import ClassManagementPage from './pages/students/ClassManagementPage/ClassManagementPage';
import StudentListPage from './pages/students/StudentListPage/StudentListPage';
import StudentManagementLayout from './pages/students/StudentManagementLayout';
import SectionLayout from './components/SectionLayout/SectionLayout';
import LearningStatusPage from './pages/learning/LearningStatusPage/LearningStatusPage';
import WeaknessAnalysisPage from './pages/learning/WeaknessAnalysisPage/WeaknessAnalysisPage';
import AssessmentResultPage from './pages/learning/AssessmentResultPage/AssessmentResultPage';
import GradingPage from './pages/learning/AssessmentResultPage/GradingPage';
import ProblemCreationPage from './pages/problems/ProblemCreationPage/ProblemCreationPage';
import ComprehensiveAssessmentPage from './pages/problems/ComprehensiveAssessmentPage/ComprehensiveAssessmentPage';
import CustomProblemPage from './pages/problems/CustomProblemPage/CustomProblemPage';
import ProblemLibraryPage from './pages/problems/ProblemLibraryPage/ProblemLibraryPage';
import ProblemLibraryDetailPage from './pages/problems/ProblemLibraryPage/ProblemLibraryDetailPage';
import StudentHomePage from './pages/student/StudentHomePage/StudentHomePage';
import StudentWorksheetPage from './pages/student/StudentWorksheetPage/StudentWorksheetPage';
import StudentSolvePage from './pages/student/StudentSolvePage/StudentSolvePage';
import StudentReviewPage from './pages/student/StudentReviewPage/StudentReviewPage';
import StudentProfilePage from './pages/student/StudentProfilePage/StudentProfilePage';
import TeacherProfilePage from './pages/auth/TeacherProfilePage/TeacherProfilePage';

function App() {
  return (
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profile" element={<TeacherProfilePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/problems" element={<SectionLayout section="problems" />}>
          <Route index element={<ProblemCreationPage />} />
          <Route path="comprehensive" element={<ComprehensiveAssessmentPage />} />
          <Route path="custom" element={<CustomProblemPage />} />
          <Route path="library" element={<ProblemLibraryPage />} />
        </Route>
        <Route path="/problems/library/:worksheetId" element={<ProblemLibraryDetailPage />} />
        <Route path="/learning" element={<SectionLayout section="learning" />}>
          <Route index element={<LearningStatusPage />} />
          <Route path="results" element={<AssessmentResultPage />} />
          <Route path="weaknesses" element={<WeaknessAnalysisPage />} />
          <Route path="weaknesses/students/:id" element={<WeaknessAnalysisPage />} />
        </Route>
        <Route path="/learning/results/:worksheetId/grading" element={<GradingPage />} />
        <Route path="/student" element={<StudentHomePage />} />
        <Route path="/student/profile" element={<StudentProfilePage />} />
        <Route path="/student/worksheets" element={<StudentWorksheetPage />} />
        <Route path="/student/worksheets/:assignmentId/solve" element={<StudentSolvePage />} />
        <Route path="/student/worksheets/:assignmentId/review" element={<StudentReviewPage />} />
        <Route path="/students" element={<StudentManagementLayout />}>
          <Route index element={<StudentListPage />} />
          <Route path="classes" element={<ClassManagementPage />} />
        </Route>
      </Routes>
  )
}

export default App
