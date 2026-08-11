import { Routes, Route } from 'react-router-dom';
import './App.css'
import LoginPage from './pages/LoginPage/LoginPage';
import SignupPage from './pages/SignupPage/SignupPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import ClassManagementPage from './pages/StudentManagementPage/ClassManagementPage';
import StudentListPage from './pages/StudentManagementPage/StudentListPage';
import StudentManagementLayout from './pages/StudentManagementPage/StudentManagementLayout';
import SectionLayout from './components/SectionLayout/SectionLayout';
import LearningStatusPage from './pages/LearningStatusPage/LearningStatusPage';
import WeaknessAnalysisPage from './pages/WeaknessAnalysisPage/WeaknessAnalysisPage';
import AssessmentResultPage from './pages/AssessmentResultPage/AssessmentResultPage';
import GradingPage from './pages/AssessmentResultPage/GradingPage';
import ProblemCreationPage from './pages/ProblemCreationPage/ProblemCreationPage';
import ComprehensiveAssessmentPage from './pages/ComprehensiveAssessmentPage/ComprehensiveAssessmentPage';
import CustomProblemPage from './pages/CustomProblemPage/CustomProblemPage';
import ProblemLibraryPage from './pages/ProblemLibraryPage/ProblemLibraryPage';
import ProblemLibraryDetailPage from './pages/ProblemLibraryPage/ProblemLibraryDetailPage';
import StudentHomePage from './pages/StudentHomePage/StudentHomePage';
import StudentWorksheetPage from './pages/StudentWorksheetPage/StudentWorksheetPage';
import StudentSolvePage from './pages/StudentSolvePage/StudentSolvePage';
import StudentReviewPage from './pages/StudentReviewPage/StudentReviewPage';
import StudentProfilePage from './pages/StudentProfilePage/StudentProfilePage';

function App() {
  return (
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/problems" element={<SectionLayout section="problems" />}>
          <Route index element={<ProblemCreationPage />} />
          <Route path="comprehensive" element={<ComprehensiveAssessmentPage />} />
          <Route path="custom" element={<CustomProblemPage />} />
          <Route path="library" element={<ProblemLibraryPage />} />
          <Route path="library/:worksheetId" element={<ProblemLibraryDetailPage />} />
        </Route>
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
