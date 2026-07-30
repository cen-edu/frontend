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
- 클릭 가능한 버튼에는 비활성 상태를 제외하고 배경색, 테두리색 또는 글자색이 변하는 명확한 hover 피드백을 제공한다.

## 라우팅

- 페이지 이동과 활성 메뉴 처리는 `react-router-dom`을 사용한다.
- 새로운 페이지 경로는 `src/App.jsx`의 라우트 구성에 등록한다.
- 학생 관리 하위 화면은 `src/pages/StudentManagementPage/StudentManagementLayout.jsx`의 중첩 라우트와 `Outlet` 구조를 사용한다.

## 접근성

- 아이콘만 있는 버튼, 검색창, 드롭다운, 체크박스 등 인터랙티브 요소에는 용도를 알 수 있는 `aria-label`을 제공한다.
- 키보드 포커스 표시와 `Escape`로 닫기 등 기존 컴포넌트의 키보드 접근성 동작을 유지한다.

## UI 컴포넌트

- 서비스의 모든 셀렉트 드롭다운은 네이티브 `<select>` 대신 `src/components/common/CustomSelect/CustomSelect.jsx`를 사용한다.
- 드롭다운 디자인은 `src/components/common/CustomSelect/CustomSelect.scss`의 공통 스타일을 따른다.
- 페이지별로 별도의 드롭다운 컴포넌트나 중복 스타일을 만들지 않는다.
- 드롭다운의 너비와 비활성 상태 등 화면별 차이는 `CustomSelect`의 props로 조절한다.
- 테이블이나 목록의 항목 선택 체크박스는 `src/components/common/CustomCheckbox/CustomCheckbox.jsx`를 사용한다.
- 항목 선택 체크박스의 디자인은 `src/components/common/CustomCheckbox/CustomCheckbox.scss`의 공통 스타일을 따르고 페이지에서 중복 구현하지 않는다.
- 학생 관리 영역의 모달은 `src/pages/StudentManagementPage/components/StudentFormModal.jsx`와 `StudentFormModal.scss`의 공통 오버레이, 헤더, 닫기 동작을 재사용하고 화면별 너비는 `width` prop으로 조절한다.
- 학생 폼의 학년 선택과 선택 입력 영역은 각각 `StudentGradeSelector.jsx`, `StudentOptionalFields.jsx`를 재사용한다.
