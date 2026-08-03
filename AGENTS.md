# 프로젝트 작업 지침

## 지침 유지관리

- 작업을 마친 뒤, 이후 다른 작업이나 다른 채팅의 에이전트가 참고해야 할 프로젝트 규칙, 공통 구현 방식, 주의사항이 새로 생겼다면 `AGENTS.md`에 명시적으로 추가하거나 기존 내용을 업데이트한다.
- 일회성 작업 내용이나 특정 작업의 진행 상황은 기록하지 않고, 이후 작업에도 반복해서 적용되는 정보만 남긴다.
- `src/pages/StudentManagementPage` 내부의 페이지나 컴포넌트 역할, 데이터 흐름 또는 파일 구조가 변경되면 해당 폴더의 `README.md` 명세도 함께 업데이트한다.

## 검증

- 검증 테스트는 사용자가 직접 진행하므로 에이전트가 별도로 실행하지 않는다.

## 기술 스택 및 패키지 관리

- 프로젝트는 React와 Vite 기반이며, 별도 요청이 없다면 TypeScript로 전환하지 않고 기존 `JavaScript/JSX` 구성을 유지한다.
- 패키지 관리는 `npm`을 사용하고 기존 `package-lock.json`을 유지한다.
- 새로운 패키지를 추가하기 전에 현재 설치된 의존성으로 구현할 수 있는지 먼저 확인한다.

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
- 아이콘은 새 이미지나 아이콘 라이브러리를 추가하기 전에 기존 Bootstrap Icons의 `bi` 클래스를 우선 사용한다.
- 기본 글꼴은 `src/index.css`에 설정된 Pretendard 구성을 유지한다.
- 화면 개발용 더미 데이터는 페이지 컴포넌트 안에 직접 선언하지 않고 `src/mocks`에서 관리한다.
- 학생 관리의 학생 `grade` 값은 `1|2|3` 문자열로 통일하고 학교급이나 학교명 필드를 사용하지 않는다.
- 학생 관리의 학생 등록 연도는 `registrationYear` 4자리 문자열로 저장한다. 신규 개별 등록 시 현재 연도를 자동 적용하고 수정할 수 없게 표시하며, 학생 데이터에는 활성·비활성 상태와 수업 시작일을 두지 않는다.
- 학생 관리의 반 데이터는 `year`, `grade`, 축약 반 이름 `name`을 별도 필드로 저장하고 화면 라벨은 `년도학년도 학년학년 반이름`으로 조합한다. 학기는 반 데이터에 저장하지 않는다.
- 클릭 가능한 버튼에는 비활성 상태를 제외하고 배경색, 테두리색 또는 글자색이 변하는 명확한 hover 피드백을 제공한다.
- 학습 관리 화면의 상태 배지·보조 정보는 최소 11px, 탭·표·버튼·일반 본문은 12px 이상을 유지해 한눈에 읽을 수 있는 가독성을 확보한다.
- 교사용 대시보드의 상단 요약 카드는 Ant Design의 `Row`, `Col`, `Card`, `Statistic`과 페이지 전용 SCSS를 사용한다.
- 교사용 대시보드의 학생 성취 분포 그래프는 Recharts의 `ScatterChart`를 사용하며, X축은 단원 학습 진행률, Y축은 정답률로 표현한다. 학생 점의 클릭·키보드 접근성과 개인 리포트 이동을 유지한다.
- 학습지 유형 데이터는 `practice`(일반 학습), `assessment`(종합평가)로 통일하고, 맞춤 출제 여부는 `origin: 'custom'`으로 구분한다.
- 단원 트리(학년>과목>학기>대>중>소)와 소단원 개념 요약은 `src/mocks/curriculum.js`에서 관리한다.
- 단계형 문제는 `steps[].segments[]` 구조를 사용하고 segment는 `{type:'text', value}` 또는 `{type:'blank', id, answer}`로 저장한다. 문제 생성 미리보기와 학생 풀이 화면은 이 구조를 공유한다.
- 문제 난이도 값은 `low|mid|high`로 저장하고 화면 라벨은 `difficultyLabels`의 하/중/상을 사용한다.
- 평가 문항 유형은 채점 화면과 동일한 `choice|short|essay`를 사용하고, 유형 라벨과 기본 배점은 `src/mocks/assessmentCreation.js`의 `questionFormats`와 `defaultScores`를 사용한다.
- 종합평가의 총 문항 수에는 검증이나 경고를 두지 않고 교사가 자율적으로 구성할 수 있게 한다.
- 학년·반 식별자는 학습 관리와 대시보드 간에 공통으로 사용한다. 학년은 `gradeId: 'middle-1'`, 반은 학년과 반을 포함한 `classId: 'middle-1-1'` 형식을 사용하고, 같은 `classId`를 페이지나 mock별로 다른 반에 매핑하지 않는다.
- 학습 관리의 탐색형 필터는 `학년 → 반 → 배정일 기간 → 상태 → 검색`을 사용하고, 학년과 반에는 전체 옵션을 제공한다. 대시보드·취약점 분석의 선택형 필터는 `학년도 → 학년 → 반 → 학기 → 학습지`를 사용하며 전체 옵션을 두지 않는다.

## 라우팅

- 페이지 이동과 활성 메뉴 처리는 `react-router-dom`을 사용한다.
- 새로운 페이지 경로는 `src/App.jsx`의 라우트 구성에 등록한다.
- 학생 관리 하위 화면은 기본적으로 `src/pages/StudentManagementPage/StudentManagementLayout.jsx`의 중첩 라우트와 `Outlet` 구조를 사용한다.
- 반 생성과 반 상세 수정은 별도 라우트로 이동하지 않고 `/students/classes` 목록 화면에서 `StudentFormModal` 프레임을 재사용한 모달로 제공한다.
- 학습 현황과 취약점 분석 사이의 학습지 컨텍스트는 `worksheet` 쿼리로 전달한다.
- 평가 결과 조회(`/learning/results`)는 학습 관리의 중첩 라우트를 사용하고, 채점 화면(`/learning/results/:worksheetId/grading`)은 헤더와 사이드바가 없는 독립 라우트로 유지한다.
- 취약점 분석에서 오답 학습(`/learning/wrong-answers`)으로 이동할 때는 `worksheet`, 쉼표로 구분한 `students`, 선택 개념이 있으면 `concept` 쿼리를 전달해 배정 모달의 학습지·학생·항목을 미리 선택한다.

## 접근성

- 아이콘만 있는 버튼, 검색창, 드롭다운, 체크박스 등 인터랙티브 요소에는 용도를 알 수 있는 `aria-label`을 제공한다.
- 키보드 포커스 표시와 `Escape`로 닫기 등 기존 컴포넌트의 키보드 접근성 동작을 유지한다.

## UI 컴포넌트

- 문제 만들기, 학습 관리, 학생 관리의 좌측 메뉴는 `src/components/Sidebar/Sidebar.jsx`와 `src/config/sidebarMenus.js`를 공통으로 사용하며, 섹션별 사이드바 UI나 메뉴 배열을 페이지 내부에 중복 구현하지 않는다.
- 헤더와 사이드바가 함께 표시되는 중첩 라우트 화면은 `src/components/SectionLayout/SectionLayout.jsx`를 재사용한다.
- 서비스의 모든 셀렉트 드롭다운은 네이티브 `<select>` 대신 `src/components/common/CustomSelect/CustomSelect.jsx`를 사용한다.
- 문제 생성과 종합평가 생성의 단원 선택 트리와 출제 범위 필터는 각각 `src/components/common/UnitTreeSelector/UnitTreeSelector.jsx`와 `src/components/common/UnitScopeFilter/UnitScopeFilter.jsx`를 재사용한다.
- 대시보드와 취약점 분석처럼 학년도·학기·반·학습지를 선택하는 분석 조회 영역은 `src/components/common/AnalysisFilters/AnalysisFilters.jsx`를 재사용한다.
- 평가 결과의 반·기간 필터도 `AnalysisFilters`의 `controls` 구성을 사용하며 학습지 선택은 좌측 학습 목록으로 대체한다.
- 드롭다운 디자인은 `src/components/common/CustomSelect/CustomSelect.scss`의 공통 스타일을 따른다.
- 페이지별로 별도의 드롭다운 컴포넌트나 중복 스타일을 만들지 않는다.
- 드롭다운의 높이, 글꼴, 테두리와 옵션 스타일은 `CustomSelect.scss`에서만 관리하고 페이지 SCSS에서 덮어쓰지 않는다. 너비와 비활성 상태 등 화면별 차이는 `CustomSelect`의 props로 조절한다.
- 학습 관리 화면의 학습명 검색은 `src/components/common/SearchInput/SearchInput.jsx`를 재사용하며, 검색창 높이와 입력·플레이스홀더 글꼴 및 테두리는 `SearchInput.scss`에서만 관리한다.
- 테이블이나 목록의 항목 선택 체크박스는 `src/components/common/CustomCheckbox/CustomCheckbox.jsx`를 사용한다.
- 항목 선택 체크박스의 디자인은 `src/components/common/CustomCheckbox/CustomCheckbox.scss`의 공통 스타일을 따르고 페이지에서 중복 구현하지 않는다.
- 학생 관리 영역의 모달은 `src/pages/StudentManagementPage/components/StudentFormModal.jsx`와 `StudentFormModal.scss`의 공통 오버레이, 헤더, 닫기 동작을 재사용하고 화면별 너비는 `width` prop으로 조절한다.
- 학생 폼의 학년 선택과 선택 입력 영역은 각각 `StudentGradeSelector.jsx`, `StudentOptionalFields.jsx`를 재사용한다.
- 오답 학습 배정 모달은 `StudentFormModal` 프레임을 재사용하며, 해설 검토가 완료되지 않은 문항이나 개념은 선택 및 배정을 비활성화한다.
- 취약점 분석 `conceptId`와 단원 트리 소단원의 매핑은 `src/mocks/customCreation.js`의 `conceptUnitMap`을 사용한다.
- 맞춤 문제는 공통 문제 구조에 `stage: 'retrace'|'basic'|'independent'`와 `sourceQuestionNo`를 추가해 저장한다.
- 개념 챗봇 UI는 `src/components/common/ConceptChatPanel`을 재사용하고 mock 응답은 `src/mocks/conceptChat.js`에서 관리한다.
- 맞춤 문제 생성 화면에는 개념 챗봇 UI를 표시하지 않는다.
- 맞춤 문제 생성 화면은 학생 목록을 좌측 탐색 영역, 문항 구성을 중앙 핵심 작업 영역, 제안 근거를 우측 보조 영역에 배치한다.
- 맞춤 문제 생성 화면은 페이지 전체 스크롤을 만들지 않고 가용 화면 높이에 맞추며, 학생 목록·문항 구성/미리보기·제안 근거는 각 컨테이너 안에서 필요할 때 스크롤한다.
- 취약점 분석에서 맞춤 문제 생성으로 이동할 때는 `worksheet`, 쉼표로 구분한 `students`, 선택 개념이 있으면 `concept` 쿼리를 전달한다.
