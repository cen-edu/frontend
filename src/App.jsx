import { Routes, Route } from 'react-router-dom';
import './App.css'
import LoginPage from './pages/LoginPage/LoginPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import ClassManagementPage from './pages/StudentManagementPage/ClassManagementPage';
import StudentListPage from './pages/StudentManagementPage/StudentListPage';
import StudentManagementLayout from './pages/StudentManagementPage/StudentManagementLayout';
import SectionLayout from './components/SectionLayout/SectionLayout';
import FeatureIntro from './components/FeatureIntro/FeatureIntro';
import LearningStatusPage from './pages/LearningStatusPage/LearningStatusPage';
import WeaknessAnalysisPage from './pages/WeaknessAnalysisPage/WeaknessAnalysisPage';
import AssessmentResultPage from './pages/AssessmentResultPage/AssessmentResultPage';
import GradingPage from './pages/AssessmentResultPage/GradingPage';
import ProblemCreationPage from './pages/ProblemCreationPage/ProblemCreationPage';
import ComprehensiveAssessmentPage from './pages/ComprehensiveAssessmentPage/ComprehensiveAssessmentPage';
import CustomProblemPage from './pages/CustomProblemPage/CustomProblemPage';
import ProblemLibraryPage from './pages/ProblemLibraryPage/ProblemLibraryPage';
import ProblemLibraryDetailPage from './pages/ProblemLibraryPage/ProblemLibraryDetailPage';

function App() {
  return (
      <Routes>
        <Route path="/" element={<LoginPage />} />
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
        <Route path="/students" element={<StudentManagementLayout />}>
          <Route index element={<StudentListPage />} />
          <Route path="classes" element={<ClassManagementPage />} />
          <Route path="reports" element={<FeatureIntro title="학생별 학습 리포트" description="학생별 학습 이력, 평가 결과와 취약 개념을 조회합니다." />} />
        </Route>
      </Routes>
  )
}

export default App
