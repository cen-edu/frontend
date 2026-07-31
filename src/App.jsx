import { Routes, Route } from 'react-router-dom';
import './App.css'
import LoginPage from './pages/LoginPage/LoginPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import ClassManagementPage from './pages/StudentManagementPage/ClassManagementPage';
import ClassCreationRoutePage from './pages/StudentManagementPage/ClassCreationRoutePage';
import ClassEditRoutePage from './pages/StudentManagementPage/ClassEditRoutePage';
import StudentListPage from './pages/StudentManagementPage/StudentListPage';
import StudentManagementLayout from './pages/StudentManagementPage/StudentManagementLayout';
import SectionLayout from './components/SectionLayout/SectionLayout';
import FeatureIntro from './components/FeatureIntro/FeatureIntro';

function App() {
  return (
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/problems" element={<SectionLayout section="problems" />}>
          <Route index element={<FeatureIntro title="문제 생성" description="학년, 과목, 단원, 문항 수, 유형과 난이도를 선택해 문제를 생성합니다." />} />
          <Route path="comprehensive" element={<FeatureIntro title="종합평가 생성" description="여러 단원과 난이도를 조합해 10~20문항의 종합평가를 구성합니다." />} />
          <Route path="custom" element={<FeatureIntro title="맞춤 문제 생성" description="학생과 반의 취약점 분석 결과를 바탕으로 맞춤 문제를 만들고 검토합니다." />} />
          <Route path="library" element={<FeatureIntro title="문제 보관함" description="생성한 문제와 평가를 조회하고 수정하거나 출제합니다." />} />
        </Route>
        <Route path="/learning" element={<SectionLayout section="learning" />}>
          <Route index element={<FeatureIntro title="학습 현황" description="반과 학생별 문제 풀이, 제출 여부와 학습 진행 상황을 확인합니다." />} />
          <Route path="results" element={<FeatureIntro title="평가 결과" description="종합평가 채점 결과와 문항별 성취도를 확인합니다." />} />
          <Route path="wrong-answers" element={<FeatureIntro title="오답 학습" description="오답 문항의 해설과 관련 개념, 학생별 복습 이력을 관리합니다." />} />
          <Route path="weaknesses" element={<FeatureIntro title="취약점 분석" description="반과 학생의 취약 단원 및 개념을 분석하고 맞춤 출제로 연결합니다." />} />
        </Route>
        <Route path="/students/classes/:classId/edit" element={<ClassEditRoutePage />} />
        <Route path="/students" element={<StudentManagementLayout />}>
          <Route index element={<StudentListPage />} />
          <Route path="classes" element={<ClassManagementPage />} />
          <Route path="classes/new" element={<ClassCreationRoutePage />} />
          <Route path="reports" element={<FeatureIntro title="학생별 학습 리포트" description="학생을 선택해 학습 이력, 평가 결과와 취약 개념을 한눈에 확인합니다." />} />
        </Route>
      </Routes>
  )
}

export default App
