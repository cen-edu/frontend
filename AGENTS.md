# 프로젝트 작업 지침

## 지침 유지관리

- 작업을 마친 뒤, 이후 다른 작업이나 다른 채팅의 에이전트가 참고해야 할 프로젝트 규칙, 공통 구현 방식, 주의사항이 새로 생겼다면 `AGENTS.md`에 명시적으로 추가하거나 기존 내용을 업데이트한다.
- 일회성 작업 내용이나 특정 작업의 진행 상황은 기록하지 않고, 이후 작업에도 반복해서 적용되는 정보만 남긴다.
- `src/pages/students` 내부의 페이지나 컴포넌트 역할, 데이터 흐름 또는 파일 구조가 변경되면 해당 폴더의 `README.md` 명세도 함께 업데이트한다.

## 검증

- 검증과 테스트는 사용자가 직접 진행하므로 에이전트는 어떤 형태의 확인 작업도 따로 실행하지 않는다.
- 개발 서버 실행이나 접속, 브라우저 미리보기 조작, 화면 캡처, 콘솔·네트워크 확인, DOM이나 computed style 조회를 하지 않는다.
- 빌드, 린트, 테스트 명령도 사용자가 명시적으로 요청한 경우에만 실행한다.
- 코드 수정을 마치면 변경한 파일과 내용만 설명하고, 동작을 확인했다는 식의 검증 결과를 보고하지 않는다.

## 기술 스택 및 패키지 관리

- 프로젝트는 React와 Vite 기반이며, 별도 요청이 없다면 TypeScript로 전환하지 않고 기존 `JavaScript/JSX` 구성을 유지한다.
- 패키지 관리는 `npm`을 사용하고 기존 `package-lock.json`을 유지한다.
- 새로운 패키지를 추가하기 전에 현재 설치된 의존성으로 구현할 수 있는지 먼저 확인한다.
- 백엔드 API 통신은 `src/api/httpClient.js`의 Axios 인스턴스를 사용하고 페이지나 컴포넌트에서 Axios 인스턴스를 별도로 만들지 않는다.
- 서버 데이터 조회와 변경 상태는 `@tanstack/react-query`를 사용하며 전역 기본 설정은 `src/api/queryClient.js`에서만 관리한다. 모달, 탭, 체크박스처럼 서버와 무관한 UI 상태는 React Query에 저장하지 않는다.
- React Query의 query function에서 받은 `signal`은 Axios 요청 옵션에 전달해 사용하지 않는 요청을 취소할 수 있게 한다.
- 교사용 분석 API는 `src/api/analysis/analysisApi.js`의 `/teacher/analysis` 기본 경로와 `analysisApi` 요청 함수를 재사용한다. 공통 `httpClient`가 이미 `response.data.data`를 반환하므로 분석 API 함수에서 응답을 다시 해제하거나 별도 Axios 인스턴스를 만들지 않는다. 분석 응답의 비율은 백분율 값 그대로 표시하고, 시간은 밀리초에서 초·분으로 변환하며, `null`과 빈 배열은 오류가 아닌 데이터 없음 상태로 처리한다. 공통 enum은 `src/api/analysis/analysisConstants.js`에서 관리한다.
- 일반 학습(`worksheetType: 'GENERAL_LEARNING'`)의 학급 분석은 `/learning-assessment-insights`와 `/learning-assessment-achievement`를 독립 React Query로 병렬 조회한다. 난이도 응답 `LOW | MID | HIGH`는 소문자로 변환하지 않고 API enum 그대로 유지하며 화면 라벨만 별도로 매핑한다. `accuracyRate: null`과 `gradedCount: 0`은 0%가 아니라 데이터 없음·미채점 상태로 표시한다.
- 종합평가(`worksheetType: 'COMPREHENSIVE_ASSESSMENT'`)의 학급 분석은 `/comprehensive-assessment-insights`, `/item-achievement`, `/score-time-distribution`을 독립 React Query로 병렬 조회한다. 학생별 문항 결과는 배열 순서가 아니라 `worksheetItemId`로 결합하고, `NOT_GRADED`와 `FAILED`를 구분해 표시한다. 득점률이나 총 풀이 시간이 `null`인 학생은 산점도에서 제외하고 자료 부족 인원으로 안내하며 중앙값은 API 값을 사용한다.
- 취약점 분석의 학생 상세 공통 영역은 `/assignments/{assignmentId}/students/{studentId}/summary`와 `/items`를 독립 React Query로 병렬 조회한다. 문항과 답안 단위는 각각 `itemNumber`, `displayOrder` 순으로 표시하며 `assignmentStudentId`를 학생 ID로 사용하지 않는다. 비율과 시간의 `null`은 0으로 바꾸지 않고, 빈 취약 소분류와 빈 문항·답안 단위 배열은 정상적인 데이터 없음 상태로 처리한다.
- 취약점 분석의 학생 상세 성취는 일반 학습이면 `/learning-assessment-performance`, 종합평가면 `/comprehensive-assessment-performance`를 조회하고 `/custom-learning-sessions`를 함께 독립 React Query로 병렬 조회한다. 난이도 `LOW | MID | HIGH`는 API enum 그대로 유지하고 화면 라벨만 매핑하며, `referenceOnly`는 참고 데이터 스타일로 표시한다. 맞춤 학습 회차는 API가 반환한 최신순을 유지하고 `IN_PROGRESS | RESOLVED | UNRESOLVED`, `REVIEW | SIMILAR | ADVANCED`를 화면 라벨로만 변환한다. 비율 `null`, 미완료 날짜, 빈 회차·소분류 배열은 0으로 바꾸거나 오류로 처리하지 않는다.
- 취약점 분석의 AI 학생 보고서는 학생 상세 진입과 재시도 시 `/assignments/{assignmentId}/students/{studentId}/report`에 POST한 뒤 GET 결과를 조회한다. POST가 `GENERATING`이면 응답의 `retryAfterMs` 간격으로 `PENDING | GENERATING` 동안만 폴링하고 `READY | FAILED`에서 중지하며, 학생 변경·페이지 이탈 시 이전 GET 요청을 취소한다. 보고서 문장은 `READY`일 때만 표시하고 문항 메시지는 배열 순서가 아니라 `worksheetItemId`로 문항 결과와 결합한다. `ANALYSIS_REPORT_NOT_GRADED`는 생성 실패가 아닌 조건 미충족 안내로 처리하며 재시도는 기존 보고서 캐시를 제거하고 POST부터 다시 시작한다.
- 클라이언트에서 사용하는 환경 변수는 `VITE_` 접두사를 사용하되 비밀번호, API Secret, 서명 키 같은 민감 정보는 Vite 환경 변수에 저장하지 않는다.

## 컴포넌트 및 스타일

- 새 화면을 만들거나 기존 화면을 크게 개편하기 전에 루트의 `DESIGN_SYSTEM.md`를 읽고 정보 위계, 색상, 타이포그래피, 표면, 데이터 표현, 반응형 및 접근성 기준을 적용한다.
- 작은 수정에서는 기존 화면의 시각 언어를 유지하며, 요청 범위 밖의 화면을 디자인 시스템 적용을 이유로 함께 재설계하지 않는다.
- 화면이나 기능을 구현하기 전에 한 파일에 상태 관리, 데이터 처리, 레이아웃, 반복 UI 등 여러 책임이 집중되거나 파일이 지나치게 길어질 가능성이 있는지 먼저 검토한다.
- 책임이 명확히 나뉘거나 여러 곳에서 재사용될 UI는 작업 시작 단계부터 하위 컴포넌트, 공통 컴포넌트, 유틸리티 또는 데이터 파일로 분리해 설계한다.
- 단순히 줄 수를 줄이기 위해 의미 없는 작은 컴포넌트를 만들지 않고, 변경 이유와 책임의 경계가 분명한 경우에만 분리한다.
- 컴포넌트의 스타일은 해당 컴포넌트와 같은 폴더의 `SCSS` 파일에 작성한다.
- CSS 클래스는 기존 코드와 동일하게 BEM 형식을 사용한다.
- 여러 화면에서 반복되는 UI는 공통 컴포넌트로 분리하고, 페이지마다 같은 UI나 스타일을 중복 구현하지 않는다.
- 공통 상단 영역은 `src/components/Header/Header.jsx`를 재사용한다.
- 교사 마이페이지는 `/profile` 경로를 사용하고 공통 `Header`의 교사 프로필 링크로 진입한다. 이름·이메일은 `GET /api/teacher/account`, 비밀번호 변경은 `PATCH /api/teacher/account/password`, 회원 탈퇴는 `DELETE /api/teacher/account`를 사용한다. 회원 탈퇴 성공 후에는 인증 정보를 지우고 로그인 화면으로 이동하며 로그아웃도 함께 제공한다.
- 학생앱 메인 화면은 독립 경로 `/student`를 사용한다. 학생 관리 화면에서는 학생앱으로 이동하는 진입 UI를 제공하지 않는다. 공통 `Header`의 `mode="student"`를 사용해 학생 메뉴를 제공하며, 교사 계정이 학생 화면에 진입한 경우에만 교사 화면 복귀 동작을 표시하고 학생 계정으로 로그인한 경우에는 표시하지 않는다.
- 학생앱 마이페이지는 `/student/profile` 경로를 사용하고 공통 `Header`의 학생 이름 링크로 진입한다. 이동 시 기존 `student` 쿼리를 유지하며 이름·학년·아이디 조회, 비밀번호 변경, 로그아웃 기능을 제공한다.
- 학생앱 화면은 교사용 업무 화면과 구분해 전체 텍스트에 기존 `학교안심 분필` 글꼴을 사용한다.
- 학생앱은 태블릿 사용을 기준으로 탭·버튼·카드의 주요 문구를 16px 이상으로 표시하고, 상태 배지와 진행률 같은 보조 정보도 14px 이상을 유지한다. 주요 터치 영역은 최소 50px 높이로 제공한다.
- 학생앱 메인의 배정 학습지는 완료된 학습지를 제외하고 `전체 / 숙제 / 평가` 탭으로 분류한다. 숙제에는 일반 학습과 `origin: 'custom'` 맞춤 학습을 포함하고, 평가는 `type: 'assessment'`인 종합평가를 포함한다. 홈의 학습 상태 문구는 `학습 가능 / 풀이 중`만 사용한다.
- 학생앱의 주관식·서술형 답안은 `src/pages/student/StudentSolvePage/HandwritingAnswer`의 Canvas 필기 UI를 사용하고, 문항별 획 좌표·압력·도구 정보를 `handwritingStorage.js`를 통해 IndexedDB에 임시 저장한다. 서버 연동 시에는 이 원본 획 데이터로 제출 이미지를 생성하며, 페이지별 필기 구현을 중복하지 않는다. 문항 이탈 시 원본 획을 `handwritingRecognition.js`의 iinkTS 수식 인식에 전달해 얻은 LaTeX를 답안의 `rawLatex`로 함께 저장한다.
- 학생앱의 일반 학습 풀이는 왼쪽 문항 탐색을 사용하지 않고 중앙의 `steps[].segments[]` 풀이 단계마다 한 줄 `HandwritingAnswer`를 제공한다. 일반 학습 필기는 입력 중 자동 저장하지 않고 `다음 학습`을 눌렀을 때 현재 단계의 획 데이터를 IndexedDB에 저장한 뒤 이동한다. 종합평가도 왼쪽 문항 탐색 없이 같은 2열 레이아웃에서 중앙 문제별 전체 답안 영역과 오른쪽 지원 영역을 표시한다.
- 학생앱의 일반 학습과 종합평가 풀이 화면 우측 지원 영역은 문항별 `supportMode: 'chat'|'concept'`에 따라 학생 모드 `ConceptChatPanel` 또는 `PracticeConceptView`를 표시한다. 챗봇에는 해당 문항의 숫자형 `subUnitId`를 전달한다.
- 학생앱의 `origin: 'custom'` 맞춤 학습은 일반 학습과 같은 단계별 필기 구조를 사용하되 문제를 `stage: 'retrace'|'basic'|'independent'`로 저장하고 화면에서는 복습/유사/응용으로 표시한다. 오른쪽 개념 설명 대신 학생 모드의 공통 `ConceptChatPanel`을 표시하며, 교사용 맞춤 문제 생성 화면의 챗봇 미표시 규칙과 구분한다.
- 학생앱 학습지 목록의 `결과` 컬럼은 값이 아니라 진입 버튼으로 둔다. 미제출은 `-`, 제출했지만 `resultReady`가 `false`이면 `채점 중` 표시, 채점이 끝나면 파란 `확인` 버튼을 보여 주고 점수와 정답 문항 수는 채점 결과 화면에서만 표시한다. `확인` 버튼은 표 안의 보조 동작이라 학생앱의 최소 50px 터치 영역 대신 `채점 중` 표시와 같은 크기(높이 40px)로 맞춘다.
- 학생앱 채점 결과 화면은 학습 화면과 같은 문제 카드를 재사용해 채점된 풀이를 보여 주고, 우측 보조 영역에는 개념 설명 대신 학생 모드 `ConceptChatPanel`을 배치해 해설을 봐도 모를 때 질문할 수 있게 한다. 문항 이동은 상단 `ReviewResultStrip`과 하단 이전/다음 버튼으로 제공한다. 결과 스트립의 문항 버튼과 필기 입력 칸의 정오 표시는 아이콘 없이 색으로만 구분하고, 판정은 각각 `aria-label`과 화면 낭독기용 텍스트로 함께 전달한다. 해설은 접기 없이 항상 펼쳐 둔다.
- 학생앱 채점 결과와 해설 데이터는 `src/mocks/studentWorksheetReview.js`에서만 만든다. 문항 판정은 `assessmentResult.js`의 `getPracticeQuestionResult`, 오답 필기 인식값은 같은 파일의 `practiceWrongInputs`를 재사용하고 화면에서 다시 집계하지 않는다.
- 문항 해설 문구는 문제 데이터의 `explanation` 필드에 저장하고, 정답 표기와 단계별 풀이는 `steps[].segments[]`의 정답에서 파생한다.
- 필기 입력 칸을 학생 입력이나 채점 결과로 바꿔 그릴 때는 `PracticeProblemView`의 `renderBlank`를 사용하고 문제 카드를 다시 구현하지 않는다.
- 아이콘은 새 이미지나 아이콘 라이브러리를 추가하기 전에 기존 Bootstrap Icons의 `bi` 클래스를 우선 사용한다.
- 기본 글꼴은 `src/index.css`에 설정된 Pretendard 구성을 유지한다.
- 일반 업무·학습 화면의 기본 배경은 `src/index.css`의 `--app-canvas-background-*` 변수를 사용하는 옅은 캔버스 점 패턴으로 통일한다. 로그인·회원가입처럼 별도 콘셉트가 명시된 화면은 자체 배경을 유지한다.
- 화면 개발용 더미 데이터는 페이지 컴포넌트 안에 직접 선언하지 않고 `src/mocks`에서 관리한다.
- 학생 화면과 교사 화면이 함께 쓰는 도메인 상수와 라벨은 `src/mocks/labels.js`에서만 관리한다. 학습지 유형, 난이도, 문항 유형과 기본 배점, 맞춤 단계, 진행 상태 라벨, 문항별 정오 판정 라벨을 페이지나 다른 mock에서 다시 선언하지 않고 여기에서 가져오거나 재수출한다.
- 학습지 유형 라벨은 `종합 평가`처럼 띄어 쓰고, 맞춤 출제는 유형이 아니라 출제 방식이므로 `getWorksheetTypeLabel`로 `맞춤 학습`을 구분해 표시한다.
- 진행 상태 키는 `not-started | in-progress | submitted`로 통일하고, 라벨만 보는 사람 기준으로 나눠 학생은 `studentAssignmentStatusLabels`(학습 가능/풀이 중/학습 완료), 교사는 `teacherProgressStatusLabels`(미시작/풀이 중/제출 완료/미배정)를 사용한다.
- 맞춤 학습 단계 라벨은 `복습 / 유사 / 응용`을 사용하고, 단계 순서를 함께 보여주는 표 머리글과 회차 요약에서만 `customStageStepLabels`의 `① ② ③` 표기를 쓴다.
- 학생 명단은 `src/mocks/students.js`, 반과 반별 출석 순서는 `src/mocks/classes.js`가 단일 기준이다. 교사 화면의 학생 표는 `getClassRoster(classId)`로 명단을 만들고 학습별 진행 상태만 덮어쓰며, mock마다 별도의 학생 이름이나 id를 만들지 않는다.
- 학습지 id, 학기, 배정일, 마감일, 문항 수는 학생앱(`studentAssignments`, `studentWorksheetSolving`)의 값을 기준으로 교사 mock을 맞춘다. 같은 학습지에 다른 id를 쓰지 않고, 학생이 미제출인 학습지는 평가 결과의 채점 대상 명단에서도 제외한다.
- 진행 단위 `totalUnits`는 종합 평가에서는 문항 수, 일반 학습과 맞춤 학습에서는 필기 입력 칸 수를 뜻한다. 일반 학습 결과의 정답 문항 수는 `correctUnits`와 `totalQuestions`로 따로 저장한다.
- 학생 문제 풀이 중 진행률은 서버에 마지막으로 저장된 `doneUnits`가 아니라 현재 `answersByItem`을 기준으로 계산한다. 종합평가는 답변이 있는 문항 수, 일반 학습과 맞춤 학습은 답변이 있는 필기 입력 칸 수를 사용해 마지막 문제나 학습 단계에서도 입력 즉시 완료 상태를 반영한다.
- 학생 관리의 학생 `grade` 값은 `1|2|3` 문자열로 통일하고 학교급, 학교명, 출석번호 필드를 사용하지 않는다.
- 학생 관리의 학생 등록 연도는 `registrationYear` 4자리 문자열로 저장한다. 신규 개별 등록 시 현재 연도를 자동 적용하고 수정할 수 없게 표시하며, 학생 데이터에는 활성·비활성 상태와 수업 시작일을 두지 않는다.
- 학생 관리의 반 데이터는 `year`, `grade`, 축약 반 이름 `name`을 별도 필드로 저장하고 화면 라벨은 `년도학년도 학년학년 반이름`으로 조합한다. 학기는 반 데이터에 저장하지 않는다.
- 클릭 가능한 버튼에는 비활성 상태를 제외하고 배경색, 테두리색 또는 글자색이 변하는 명확한 hover 피드백을 제공한다.
- 학습 관리 화면의 상태 배지·보조 정보는 최소 11px, 탭·표·버튼·일반 본문은 12px 이상을 유지해 한눈에 읽을 수 있는 가독성을 확보한다.
- 교사용 대시보드의 상단 요약 카드는 Ant Design의 `Row`, `Col`, `Card`, `Statistic`과 페이지 전용 SCSS를 사용한다.
- 힌트는 종합 평가에서만 사용하는 개념이므로 맞춤 학습 데이터와 화면에는 힌트 필드나 표시를 두지 않는다.
- 맞춤 학습 결과는 학생별 회차 배열 `student.customSessions[]`(`sourceWorksheetId`, `conceptId`, `assignedAt`, `completedAt`, `problems[{ no, stage, difficulty, correct }]`)로 저장한다. `correct: null`은 미풀이를 뜻하고, 해소 판정은 미풀이가 있으면 `pending`, ③ 응용 문항을 모두 맞히면 `resolved`, 아니면 `unresolved`로 파생한다.
- 맞춤 학습 결과는 상단 학습지 필터를 늘리지 않고, 원 학습지 개인 분석 화면 안의 `CustomLearningResult` 섹션(전후 비교·단계별 결과·회차 선택)과 학급 분석의 `PrescriptionTable`에서 조회한다. 맞춤 학습지를 취약점 분석의 학습지 선택 항목으로 따로 두지 않고, 학습 현황의 맞춤 학습 배포는 `analysisWorksheetId`로 원 학습지를 가리킨다.
- 취약점 분석 개인 뷰의 영역별 결과는 막대(`ResultBreakdown`), 난이도별 결과는 Recharts `RadarChart`(`DifficultyRadar`)로 표시하고 같은 행에 나란히 배치한다. 두 표현에 같은 집계 기준을 중복해 넣지 않는다.
- 취약점 분석에서 학습지를 선택하면 `/api/teacher/analysis/assignments/{assignmentId}/overview`와 `/students`를 서로 독립된 React Query로 병렬 조회한다. 학급 요약과 좌측 학생 목록은 이 응답을 사용하고, 응답 enum 및 시간·상태 변환은 `WeaknessAnalysisPage/analysisAdapters.js`에서 관리한다. 한 요청이 실패해도 다른 요청의 성공 데이터는 표시하며, `ANALYSIS_ASSIGNMENT_ACCESS_DENIED`와 `ANALYSIS_ASSIGNMENT_NOT_FOUND`는 선택을 해제하고 배정 목록을 갱신한 뒤 재선택을 안내한다.
- 학생과 학급을 함께 표시하는 그래프의 범례는 공통 클래스 `analysis-legend`를 사용하고, 학생은 `#4f806b`, 학급은 `#8da2b5`로 통일한다.
- 교사용 대시보드의 학생 성취 분포 그래프는 Recharts의 `ScatterChart`를 사용하며, X축은 학기 학습 참여율, Y축은 학기 누적 정답률로 표현한다.
- 학습지 유형 데이터는 `practice`(일반 학습), `assessment`(종합평가)로 통일하고, 맞춤 출제 여부는 `origin: 'custom'`으로 구분한다.
- 단원 트리(학년>과목>학기>대>중>소)와 소단원 개념 요약은 `src/mocks/curriculum.js`에서 관리한다.
- 단계형 문제는 `steps[].segments[]` 구조를 사용하고 각 step에는 분석용 `conceptId`를 둔다. segment는 `{type:'text', value}` 또는 `{type:'blank', id, answer}`로 저장하며 문제 생성 미리보기, 학생 풀이, 취약점 분석, 문항 해설이 이 구조를 공유한다.
- 학기 값은 문제 만들기와 학습 관리 모두 `term: 'first'|'second'`로 저장하고 숫자형 문자열이나 `semesterId`를 별도로 사용하지 않는다.
- 문제 난이도 값은 `low|mid|high`로 저장하고 화면 라벨은 `difficultyLabels`의 하/중/상을 사용한다.
- 취약점 분석의 문항 영역 값은 `concept|calculation|reasoning|problemSolving`으로 저장하고 화면에서는 개념/계산/추론/문제해결로 표시한다.
- 취약점 분석의 정답 결과는 독립 정답, 힌트 후 정답, 오답, 채점 대기로 구분한다. 학급 평균과 영역·난이도 집계에서는 `insufficient` 상태 학생과 채점 대기 응답을 제외하되 참여 학생 수에는 자료 부족 학생을 포함한다.
- 평가 문항 유형은 학생 풀이 화면을 포함해 모두 `format: 'choice'|'short'|'essay'`를 사용하고, 유형 라벨과 기본 배점은 `src/mocks/labels.js`의 `questionFormats`, `formatLabels`, `defaultScores`를 사용한다. 학생 화면에서도 난이도는 `low|mid|high`로 저장하고 배점은 `maxScore`에 둔다.
- 종합 평가의 총점은 교사가 문항별로 입력한 `maxScore`의 합계로 계산하며 100점으로 강제하지 않는다. 문항별 결과 색상은 만점이면 초록, 0점이면 빨강, 그 사이의 부분 점수는 노랑으로 표시하고 채점 대기는 중립색을 사용한다.
- 종합평가의 총 문항 수에는 검증이나 경고를 두지 않고 교사가 자율적으로 구성할 수 있게 한다.
- 일반 학습과 종합평가의 출제 구성 영역은 단원을 선택하지 않은 초기 상태부터 하단 총 문항 수와 생성 버튼을 표시하며, 총 문항 수는 `총 0문항` 형식으로 시작한다.
- 학년·반 식별자는 학습 관리와 대시보드 간에 공통으로 사용한다. 학년은 `gradeId: 'middle-1'`, 반은 학년과 반을 포함한 `classId: 'middle-1-1'` 형식을 사용하고, 같은 `classId`를 페이지나 mock별로 다른 반에 매핑하지 않는다.
- 학습 현황의 맞춤 학습은 `sourceWorksheetId`로 원본 학습지와 연결하고 왼쪽 학습 목록과 상단 집계에서 제외한다. 원본 학생 표에는 맞춤 학습 상태 컬럼을 두지 않고, 하단 `CustomLearningSection`의 학생별 상세 표를 구분선으로 바로 이어서 표시하며 카드를 눌러 별도 맞춤 화면으로 전환하지 않는다. 파생 학습지 조회는 `learningStatusUtils.js`의 `getDerivedCustomAssignments`에 두고 컴포넌트에서 다시 집계하지 않는다.
- 학습 관리의 탐색형 필터는 `학년 → 반 → 학기 → 상태 → 검색`을 사용하고, 학년과 반에는 전체 옵션을 제공한다. 문제 보관함, 학습 현황, 평가 결과에서는 기간 필터를 사용하지 않는다. 취약점 분석의 선택형 필터는 `학년도 → 학년 → 반 → 학기 → 학습지`, 교사용 대시보드는 `학년도 → 학년 → 반 → 학기`를 사용하며 전체 옵션을 두지 않는다.
- 교사용 대시보드는 학습지 하나가 아니라 반 × 학기 단위로 집계한다. 학습지 단위 상세는 학습 현황, 평가 결과, 취약점 분석이 담당하므로 대시보드에 문항 단위 분석이나 학습지 선택 필터를 두지 않는다.
- 교사용 대시보드는 `/api/teacher/dashboard/summary`, `/student-progress`, `/assignments`를 React Query로 조회하고, API 응답을 기존 화면 모델로 바꾸는 파생 로직은 `src/pages/dashboard/DashboardPage/dashboardAdapters.js`에서 관리한다. 컴포넌트에서 응답 enum 변환이나 집계를 다시 구현하지 않는다.
- 대시보드의 본문 섹션은 `학생별 학습 현황`(학생 축)과 `학습지별 현황`(학습지 축) 두 개로 두고 각각 전폭으로 배치한다. 개념 축 섹션과 학생 표의 `주요 취약 개념` 컬럼은 두지 않는다. 대시보드의 개념 정보는 학기 누적 집계라 학습지 단위 취약 개념 분석 결과와 축이 달라 맞춤 문제 생성의 입력이 될 수 없고, 개념 단위 조회와 후속 조치는 취약점 분석이 담당한다.
- 대시보드 API가 맞춤 학습의 원본 배정 ID를 제공하기 전에는 맞춤 학습을 평면 목록으로 표시하고 `정보 부족` 표기를 함께 둔다. 원본 배정 ID가 추가되면 원본 아래 하위 행으로 묶고, 학생 결과 스트립과 학습지 목록이 같은 계층 번호를 쓰도록 어댑터에서 한 번만 계산한다.
- 대시보드에서 학습지 유형 차등은 `학습지별 현황` 섹션에서만 둔다. `practice`는 학생별 완료 결과에서 평균 정답률을 파생하고 취약점 분석 이동을 제공한다. `assessment`는 학생별 완료 결과에서 평균 점수를 파생하되, API가 결과 확정 상태를 제공하기 전에는 동작을 추측하지 않고 비활성 `정보 부족`으로 표시한다. 학생 축은 유형과 무관하게 API의 누적 정답률을 사용한다.
- 맞춤 문제 생성 진입은 취약점 분석에서만 제공한다. 이동할 때 `concept`에는 라벨이 아니라 `conceptId`를 넘기고, `CustomProblemPage`는 `worksheet`, `students`, `concept`만 읽으므로 다른 이름의 파라미터를 추가하지 않는다. `worksheet`에는 `weaknessWorksheets`에 실재하는 `practice` 학습지 id를 넘긴다.

## 라우팅

- 페이지 이동과 활성 메뉴 처리는 `react-router-dom`을 사용한다.
- 새로운 페이지 경로는 `src/App.jsx`의 라우트 구성에 등록한다.
- `src/pages`의 최상위 폴더는 라우트와 헤더 메뉴 기준으로 `auth`, `dashboard`, `problems`, `learning`, `students`, `student`를 사용하고, 개별 페이지 폴더는 해당 그룹 아래에 둔다.
- 학생 관리 하위 화면은 기본적으로 `src/pages/students/StudentManagementLayout.jsx`의 중첩 라우트와 `Outlet` 구조를 사용한다.
- `src/pages/students` 내부는 `StudentListPage`, `ClassManagementPage`, 양쪽에서 사용하는 UI와 상수 `shared`로 구분한다.
- 반 생성과 반 상세 수정은 별도 라우트로 이동하지 않고 `/students/classes` 목록 화면에서 `StudentFormModal` 프레임을 재사용한 모달로 제공한다.
- 학생앱 학습지 하위 화면은 풀이 `/student/worksheets/:assignmentId/solve`, 채점 결과·해설 `/student/worksheets/:assignmentId/review` 경로를 사용하고 두 경로 모두 `student` 쿼리로 학생 ID를 유지한다.
- 학습 현황과 취약점 분석 사이의 학습지 컨텍스트는 `worksheet` 쿼리로 전달한다.
- 취약점 분석의 전체/개인 화면은 좌측 분석 대상 목록을 공유하고 개인 URL(`/learning/weaknesses/students/:id`)을 유지한 채 같은 2단 레이아웃 안에서 전환한다.
- 평가 결과 조회(`/learning/results`)는 학습 관리의 중첩 라우트를 사용하고, 채점 화면(`/learning/results/:worksheetId/grading`)은 헤더와 사이드바가 없는 독립 라우트로 유지한다.

## 접근성

- 아이콘만 있는 버튼, 검색창, 드롭다운, 체크박스 등 인터랙티브 요소에는 용도를 알 수 있는 `aria-label`을 제공한다.
- 키보드 포커스 표시와 `Escape`로 닫기 등 기존 컴포넌트의 키보드 접근성 동작을 유지한다.

## UI 컴포넌트

- 문제 만들기, 학습 관리, 학생 관리의 좌측 메뉴는 `src/components/Sidebar/Sidebar.jsx`와 `src/config/sidebarMenus.js`를 공통으로 사용하며, 섹션별 사이드바 UI나 메뉴 배열을 페이지 내부에 중복 구현하지 않는다.
- 헤더와 사이드바가 함께 표시되는 중첩 라우트 화면은 `src/components/SectionLayout/SectionLayout.jsx`를 재사용한다.
- 공통 헤더는 화면 상단에, 공통 사이드바는 헤더 아래에 고정해 본문을 스크롤해도 탐색 메뉴가 계속 보이도록 유지한다.
- `src/components/common`은 책임별로 `inputs`, `filters`, `worksheets` 그룹을 사용하고, 페이지에서는 각 그룹의 `index.js` 진입점에서 필요한 컴포넌트를 named import한다.
- 서비스의 모든 셀렉트 드롭다운은 네이티브 `<select>` 대신 `src/components/common/inputs/CustomSelect/CustomSelect.jsx`를 사용한다.
- 문제 생성과 종합평가 생성의 단원 선택 트리와 출제 범위 필터는 각각 `src/components/common/filters/UnitTreeSelector/UnitTreeSelector.jsx`와 `src/components/common/filters/UnitScopeFilter/UnitScopeFilter.jsx`를 재사용한다.
- 문제 생성과 종합평가 생성의 단원 트리는 `GET /api/teacher/problems/units`로 조회하며, 학년·학기 변경 시 기존 소단원 선택과 출제 구성을 초기화한다. 응답의 `children` 계층과 숫자형 단원 `id`를 공통 단원 선택 UI에서 그대로 사용한다.
- 대시보드와 취약점 분석처럼 학년도·학기·반·학습지를 선택하는 분석 조회 영역은 `src/components/common/filters/AnalysisFilters/AnalysisFilters.jsx`를 재사용한다.
- 대시보드, 취약점 분석, 맞춤 문제 생성의 학년도·학년·반·학기 옵션과 기본 선택은 `GET /api/teacher/academic-contexts` 및 공통 `useAcademicContextFilters` 훅을 사용한다. 학년도 변경 시 학년·반을, 학년 변경 시 반을 응답 계층의 첫 항목으로 재선택하며 학기는 반 계층과 독립적으로 유지한다.
- 평가 결과의 반·기간 필터도 `AnalysisFilters`의 `controls` 구성을 사용하며 학습지 선택은 좌측 학습 목록으로 대체한다.
- 평가 결과표는 학생별 행만 제공하고 등급과 문항별 평균을 표시하지 않는다. 20문항까지 가로 스크롤로 조회하며 학생 열과 채점 동작 열을 고정한다.
- 일반 학습 결과는 배점이나 점수·정답률을 저장·표시하지 않고 문항별 O/△/X(정답/부분 정답/오답)와 학생별 정답 수로 표현한다. 부분 정답은 정답 수에 포함하지 않는다.
- 일반 학습 채점은 문항이 아니라 학생 풀이 화면과 같은 `steps[].segments[]`의 필기 입력 칸(blank) 단위로 정답 여부만 판정한다. 칸 판정은 `answers[].blanks[{ stepId, blankId, input, answerImage, autoCorrect, correct, gradedBy }]`에 저장하고, 문항별 O/△/X와 학생별 정답 수는 저장하지 않고 `assessmentResult.js`의 `getPracticeQuestionResult`, `getPracticeCorrectCount`에서 파생한다.
- 일반 학습 채점 화면은 종합 평가 채점 화면(`GradingPage`)과 같은 라우트·레이아웃·스타일을 쓰고, 문항 카드만 `PracticeGradingCard`로 분기한다. 카드에는 풀이 단계별 지시문과 학생 입력을 채운 풀이식, 칸마다 학생의 원본 필기 이미지와 인식된 답·정답을 함께 표시한다.
- 일반 학습도 종합 평가와 같이 자동 채점 결과를 먼저 보여주고 교사가 정답·오답 어느 쪽으로든 바꿀 수 있게 한다. 자동 채점과 다른 판정을 고르면 `gradedBy: 'teacher'`로 기록해 수정된 칸임을 표시한다.
- 일반 학습은 점수가 없어 학생별 채점 완료 여부를 판단할 수 없으므로 채점 화면의 `채점 완료`가 설정하는 `student.graded` 값으로 완료를 판단한다.
- 교사 채점 화면의 필기 답안은 서버가 만들어 준 이미지(`answerImage`)를 사용하고, 학생 기기의 IndexedDB 획 데이터를 직접 읽지 않는다.
- 종합평가 채점은 학생을 먼저 선택한 뒤 해당 학생의 전체 문항을 한 화면에서 채점하는 흐름을 사용한다.
- 종합평가 채점 화면에서는 자동 채점된 객관식·주관식·서술형도 교사가 학생 답안과 정답 또는 루브릭 근거를 확인하고 점수·평가지표 판정을 수정할 수 있게 한다.
- 종합평가 객관식 채점은 부분 점수를 허용하지 않고 `0점` 또는 문항 배점만 선택할 수 있게 하며, 검토 화면에 전체 5지선다 보기와 학생 선택·정답 표시를 함께 제공한다.
- 서술형 자동 채점은 문항의 `rubric[{ label, score }]`을 기준으로 부분 점수를 합산하고, 학생 답안에는 항목 순서와 대응하는 `rubricResults[{ satisfied, evidence }]`를 저장한다. 채점 결과 화면에서는 각 평가지표의 획득 점수와 답안에서 확인된 근거 문구를 함께 표시한다.
- 드롭다운 디자인은 `src/components/common/inputs/CustomSelect/CustomSelect.scss`의 공통 스타일을 따른다.
- 페이지별로 별도의 드롭다운 컴포넌트나 중복 스타일을 만들지 않는다.
- 드롭다운의 높이, 글꼴, 테두리와 옵션 스타일은 `CustomSelect.scss`에서만 관리하고 페이지 SCSS에서 덮어쓰지 않는다. 너비와 비활성 상태 등 화면별 차이는 `CustomSelect`의 props로 조절한다.
- 하단 고정 영역처럼 아래쪽 공간이 부족한 셀렉트는 `CustomSelect`의 `placement="top"`을 사용해 옵션을 위로 펼친다.
- 학습 관리 화면의 학습명 검색은 `src/components/common/inputs/SearchInput/SearchInput.jsx`를 재사용하며, 검색창 높이와 입력·플레이스홀더 글꼴 및 테두리는 `SearchInput.scss`에서만 관리한다.
- 테이블이나 목록의 항목 선택 체크박스는 `src/components/common/inputs/CustomCheckbox/CustomCheckbox.jsx`를 사용한다.
- 항목 선택 체크박스의 디자인은 `src/components/common/inputs/CustomCheckbox/CustomCheckbox.scss`의 공통 스타일을 따르고 페이지에서 중복 구현하지 않는다.
- 학생 관리 영역의 모달은 `src/pages/students/shared/StudentFormModal.jsx`와 `StudentFormModal.scss`의 공통 오버레이, 헤더, 닫기 동작을 재사용하고 화면별 너비는 `width` prop으로 조절한다.
- 학생 폼의 학년 선택과 선택 입력 영역은 각각 `StudentGradeSelector.jsx`, `StudentOptionalFields.jsx`를 재사용한다.
- 오답에 대한 처방은 맞춤 문제 생성으로 일원화하고, 같은 문항을 다시 배정하는 별도 화면을 두지 않는다. 문항 풀이는 문제 보관함의 해설로 관리하고 출제 시 함께 배포한다.
- 맞춤 학습지의 총 풀이 수는 반 단위 학습지 값이 아니라 학생별 `totalUnits`로 저장하고 진행률 계산에서도 학생 값을 우선한다.
- 취약점 분석 `conceptId`와 단원 트리 소단원의 매핑은 `src/mocks/customCreation.js`의 `conceptUnitMap`을 사용한다.
- 맞춤 문제는 공통 문제 구조에 `stage: 'retrace'|'basic'|'independent'`와 `sourceQuestionNo`를 추가해 저장한다.
- 맞춤 문제 ID는 여러 취약 개념이 같은 소단원에 매핑될 수 있으므로 학생 ID·취약 개념 ID·소단원 ID·단계·순번을 함께 사용해 고유하게 만든다.
- 개념 챗봇 UI는 `src/components/common/worksheets/ConceptChatPanel`을 재사용하고 추천 질문용 mock은 `src/mocks/conceptChat.js`에서 관리한다.
- 학생용 개념 챗봇은 `POST /api/chat`을 사용하며 `ConceptChatPanel`이 실제 사용자·assistant 대화 `history`와 응답의 `currentConceptId`를 관리한다. 환영 문구는 `history`에 포함하지 않고 요청에는 최근 20개 대화와 현재 문제의 숫자형 `subUnitId`를 전달하며, 문제·학습 화면 전환 시 대화와 연속성 토큰을 초기화한다. 챗봇 환영 문구와 assistant 응답의 `$...$`, `$$...$$` LaTeX는 공통 `MathText`로 렌더링하고 사용자 입력은 원문으로 표시한다. 교사용 생성 미리보기의 읽기 전용 챗봇은 API를 호출하지 않는다.
- 맞춤 문제 생성 화면에는 개념 챗봇 UI를 표시하지 않는다.
- 맞춤 문제 생성 화면은 학생 목록을 좌측 탐색 영역, 문항 구성을 중앙 핵심 작업 영역, 제안 근거를 우측 보조 영역에 배치한다.
- 맞춤 문제 생성 후 결과를 검토할 때는 `맞춤 문제 생성` 페이지 제목 영역과 조회 필터·학생 목록·제안 근거를 숨기고, 전체 작업 영역에 풀이 미리보기·배정 영역만 표시한다.
- 맞춤 문제 생성 화면은 페이지 전체 스크롤을 만들지 않고 가용 화면 높이에 맞추며, 학생 목록·문항 구성/미리보기·제안 근거는 각 컨테이너 안에서 필요할 때 스크롤한다.
- 취약점 분석에서 맞춤 문제 생성으로 이동할 때는 `worksheet`, 쉼표로 구분한 `students`, 선택 개념이 있으면 `concept` 쿼리를 전달한다.
- 보관함 학습지 데이터는 `src/mocks/problemLibrary.js`에서 관리하고, 학습 관리 mock과 같은 학습지는 동일한 학습지 id를 사용한다.
- 문제 미리보기 렌더러는 `src/components/common/worksheets/ProblemViewer`를 재사용하고 페이지별로 중복 구현하지 않는다.
- 일반 학습의 단계형 문제 카드와 개념 설명 카드는 `src/components/common/worksheets/PracticeProblemView`를 학생 풀이와 교사용 생성 결과 미리보기에서 함께 사용한다. 교사용 미리보기는 필기 입력 없이 같은 문제 구조 안에 정답을 표시하고 우측에 개념 설명을 배치하며, 문항 목록 없이 상단 진행률과 하단 이전/다음 버튼으로 문항을 이동한다.
- 종합평가 생성 결과도 일반 학습 문제 생성 결과와 같은 상단 진행률·하단 이전/다음 문항 탐색과 점무늬 캔버스 미리보기 구조를 사용한다. 중앙에는 정답·채점 기준을 포함한 문항 카드를 배치하고 배점 수정·문항 순서 변경 기능을 유지한다.
- 교사용 문제 미리보기와 문제 생성 결과에서는 정답을 항상 표시하고, 정답 표시·숨기기 전환 기능을 제공하지 않는다.
- 단계형 풀이를 문제 생성 결과나 학생 풀이 화면에 표시할 때 마지막 내용이 빈칸이면 빈칸 뒤의 마침표(`.`)는 표시하지 않는다.
- 일반 학습·종합 평가·맞춤 학습의 문제 생성 결과를 교사가 미리보는 동안에는 공통 헤더와 사이드바를 숨기고, 생성 결과 검토 영역에 집중할 수 있는 레이아웃을 사용한다.
- 일반 학습과 종합평가 생성 결과의 보관함 확정 저장은 `POST /api/teacher/worksheets`를 사용한다. 저장 요청에는 생성된 문항 ID·표시 순서·지원 모드와 문항에서 재집계한 `genSpec`을 전달하며, 확정된 학습지는 불변으로 취급한다. 종합평가는 각 item에 교사가 입력한 `maxScore`를 함께 전달하고 서버는 그 합계를 총점으로 사용한다.
- 문제 보관함의 학습지 삭제는 `DELETE /api/teacher/worksheets/{worksheetId}`를 사용하고 별도 삭제 모달 없이 `window.confirm`으로 확인한다. 성공하면 목록 쿼리를 무효화해 다시 조회하며, 이미 배포된 학습지의 `WORKSHEET_ALREADY_ASSIGNED` 오류 메시지는 사용자에게 표시한다.
- 문제 보관함의 학습지 출제는 `POST /api/teacher/worksheets/{worksheetId}/assignments`에 숫자형 `classId`와 ISO 8601 `dueAt`만 전달한다. 출제 모달의 반은 `GET /api/teacher/academic-contexts`에서 기본 학년도의 학습지 학년과 일치하는 반만 제공하고, 미래 기한을 클라이언트에서도 검사하며, 성공 또는 `WORKSHEET_DUPLICATE_ASSIGNMENT` 응답 후에는 보관함 목록·상세 쿼리를 갱신한다.
- 일반 학습·맞춤 학습·종합평가 생성 결과는 `senny-chatbot.png`를 사용한 AI 편집 버튼으로 편집 모드에 진입한 뒤 수정 섹터를 선택하고 `ProblemAiEditPanel`에서 요청을 입력한다. 일반 학습은 문제 전체·풀이 과정별·개념 설명 전체, 맞춤 학습은 문제 전체·풀이 과정별, 종합평가는 문제 전체·보기와 정답·모범답안·채점 기준 영역을 선택한다. LLM 연동 전까지는 UI 피드백만 제공하고 문제 데이터를 변형하지 않는다.
- 문제 보관함에서는 제목만 직접 수정하며, 내용 변경은 `from` 쿼리로 문제 생성 또는 종합평가 생성 화면에 이동한 뒤 `GET /api/teacher/worksheets/{worksheetId}/gen-spec`의 `type`, `grade`, `semester`, `genSpec`만 프리필해 재구성한다. `genSpec`은 반환 순서에 의존하지 않고 소단원·문항 유형·난이도 기준으로 정렬·집계하며, 제목과 실제 문항 목록을 원본에서 복사하지 않는다.
- 문제 보관함 상세는 `GET /api/teacher/worksheets/{worksheetId}`를 사용한다. `items[].question`은 공통 문제 미리보기 모델로 변환하고, 단계형 문제의 `steps[].segments[].unitKey`는 `answerUnits[].unitKey`와 연결해 정답을 구성하며, 문항별 `supportMode`, `customStage`, `maxScore`는 worksheet item 값을 사용한다. 상세 응답에는 서술형 rubric이 없으므로 문제 보관함 상세에서는 채점 기준 영역을 표시하지 않는다.
- 문제 보관함 상세(`/problems/library/:worksheetId`)는 공통 헤더와 사이드바가 없는 독립 라우트로 표시하고 화면 전체 높이에 맞춘다. 상세 미리보기의 문제·정답·보기·답안 영역과 타이포그래피는 일반 학습 및 종합평가 생성 결과 미리보기와 같은 크기를 사용하며, 별도의 해설 보기 버튼이나 해설 모달은 제공하지 않는다.
- 문제 보관함의 출제 상태는 별도 필드로 저장하지 않고 `assignments` 배열의 길이에서 파생한다.
- 문제 보관함의 맞춤 문제는 `custom.sourceWorksheetId`로 원본 일반 학습 또는 종합 평가에 연결하고, 원본 학습지 행 아래의 접을 수 있는 하위 항목으로 표시한다. 유형 탭 분류도 맞춤 문제 자체의 `type`이 아니라 연결된 원본 학습지 유형을 기준으로 한다.
- 학생 학습지 목록·상세·문항 저장·제출·결과 조회는 `src/api/student/studentAssignmentsApi.js`와 `src/pages/student/studentAssignmentHooks.js`를 사용한다. 화면에서는 `assignmentStudentId`, `worksheetItemId`, `answerUnitId`를 서버 식별자로 유지하고 저장 응답의 `doneUnits`, `totalUnits`, `status`를 진행 상태의 기준으로 사용한다.
- 학생 필기 답안은 문항 이탈 시 IndexedDB 원본 획을 저장하고 같은 획으로 PNG를 만든 뒤 답안 이미지 API에 업로드한 다음 문항 답안 저장 API에 `hasHandwriting: true`를 전달한다. 풀이 상세 API가 개념 설명 데이터를 제공하기 전까지 일반 학습의 우측 개념 설명 영역에는 `API 수정 후 재연동 필요`를 표시한다.
- 학생 풀이와 채점 결과 화면의 발문·보기·학생 답안·정답·단계별 풀이·해설에 포함된 LaTeX는 교사 문제 미리보기와 같은 공통 `MathText` 컴포넌트로 렌더링한다.
