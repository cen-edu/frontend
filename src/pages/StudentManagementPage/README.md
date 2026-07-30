# 학생 관리 페이지 구조 명세

이 문서는 학생 관리 영역의 페이지, 컴포넌트, 데이터 흐름과 각 파일의 책임을 설명한다. 파일을 추가하거나 기존 파일의 역할을 변경할 때 이 문서도 함께 갱신한다.

## 라우팅 구조

| 경로 | 화면 | 역할 |
| --- | --- | --- |
| `/students` | `StudentListPage` | 학생 목록 조회, 필터링, 선택, 등록, 수정 |
| `/students/classes` | `ClassManagementPage` | 반 관리 화면. 현재 본문은 구현 전 상태 |

두 경로는 `StudentManagementLayout`을 공통 부모로 사용한다. 하위 화면은 React Router의 `Outlet` 위치에 렌더링된다.

## 디렉터리 구조

```text
StudentManagementPage/
├── README.md
├── StudentManagementLayout.jsx
├── StudentManagementLayout.scss
├── StudentListPage.jsx
├── StudentListPage.scss
├── ClassManagementPage.jsx
└── components/
    ├── StudentToolbar.jsx
    ├── StudentTable.jsx
    ├── StudentSelectionBar.jsx
    ├── StudentFormModal.jsx
    ├── StudentFormModal.scss
    ├── StudentRegistrationModal.jsx
    ├── StudentDetailModal.jsx
    ├── StudentGradeSelector.jsx
    ├── StudentOptionalFields.jsx
    └── studentFormConfig.js
```

## 페이지와 레이아웃

### `StudentManagementLayout.jsx`

- 학생 관리 영역의 공통 레이아웃이다.
- 전역 `Header`와 학생 관리용 `StudentSidebar`를 배치한다.
- `Outlet`을 통해 학생 목록 또는 반 관리 화면을 렌더링한다.
- 목록 데이터나 모달 상태를 직접 관리하지 않는다.

### `StudentListPage.jsx`

- 학생 목록 화면의 상태와 데이터 흐름을 관리하는 컨테이너 페이지다.
- 검색어, 학교급 필터, 상태 필터, 정렬 방식과 선택된 학생 ID를 관리한다.
- 학생 등록, 상세 수정, 활성·비활성 일괄 변경 로직을 소유한다.
- 화면 표현은 `StudentToolbar`, `StudentTable`, `StudentSelectionBar`에 위임한다.
- 등록·상세 모달의 열림 상태와 저장 결과를 관리한다.
- 개발용 초기 데이터는 `src/mocks/students.js`에서 가져온다.

### `ClassManagementPage.jsx`

- `/students/classes` 경로에 대응하는 반 관리 페이지다.
- 현재는 사이드바 이동과 라우팅 구조만 유지하기 위한 빈 화면이다.
- 반 관리 기능을 구현할 때 이 파일을 진입점으로 사용한다.

## 목록 컴포넌트

### `StudentToolbar.jsx`

- 최신 등록순·이름순 정렬을 제공한다.
- 전체·초·중·고 학교급 필터와 활성·비활성 상태 필터를 제공한다.
- 학생 이름 검색 입력을 제공한다.
- 학생 일괄 등록 및 개별 등록 버튼을 렌더링한다.
- 필터 상태는 직접 소유하지 않고 `StudentListPage`에서 props로 전달받는다.

### `StudentTable.jsx`

- 필터링된 학생 목록을 테이블로 표시한다.
- 전체 선택과 개별 학생 선택을 처리한다.
- 행 클릭 및 `Enter`, `Space` 키를 통한 선택을 지원한다.
- 학생앱 이동 및 상세보기 버튼을 렌더링한다.
- 상세보기 요청은 선택된 학생 객체를 상위 페이지에 전달한다.

### `StudentSelectionBar.jsx`

- 한 명 이상의 학생이 선택되었을 때 하단에 표시된다.
- 선택 인원수를 표시한다.
- 선택 학생의 활성·비활성 일괄 변경과 선택 해제를 요청한다.
- 실제 학생 데이터 변경은 `StudentListPage`가 수행한다.

## 학생 폼 모달 컴포넌트

### `StudentFormModal.jsx`

- 등록·상세 모달이 공유하는 모달 프레임이다.
- 오버레이, 제목, 닫기 버튼과 Portal 렌더링을 담당한다.
- 모달이 열리면 본문 스크롤을 잠근다.
- 바깥 영역 클릭과 `Escape` 키로 닫기를 지원한다.
- 실제 폼 내용과 푸터 버튼은 `children`으로 전달받는다.

### `StudentRegistrationModal.jsx`

- 신규 학생 정보를 입력하는 폼이다.
- 학생 이름, 학년, 출결 번호를 필수로 입력받는다.
- 선택 입력 영역은 `StudentOptionalFields`를 재사용한다.
- 제출 시 입력값을 정리해 `onRegister`로 상위 페이지에 전달한다.
- 학생 ID와 기본 상태 생성은 `StudentListPage`가 담당한다.

### `StudentDetailModal.jsx`

- 기존 학생 정보를 확인하고 수정하는 폼이다.
- 학생 이름, 학년, 출결 번호와 활성·비활성 상태를 수정한다.
- 학생 ID는 읽기 전용으로 표시한다.
- 선택 입력 영역은 `StudentOptionalFields`를 재사용한다.
- 학생 비밀번호 초기화 UI를 제공한다.
- 저장 결과를 `onSave`로 상위 페이지에 전달한다.

### `StudentGradeSelector.jsx`

- 초·중·고 학교급 버튼과 학년 드롭다운을 묶은 공통 입력 컴포넌트다.
- 학교급에 따라 선택 가능한 학년 수를 변경한다.
- 서비스 공통 `CustomSelect`를 사용한다.
- 학년 문자열 조합이나 해석은 직접 하지 않고 `studentFormConfig.js`의 함수를 사용한다.

### `StudentOptionalFields.jsx`

- 등록·상세 모달이 공유하는 선택 입력 필드 모음이다.
- 학생 연락처, 학부모 연락처, 학교, 수업 시작일, 생년월일, 이메일, 주소, 집 전화와 특이사항을 렌더링한다.
- 입력 상태를 소유하지 않고 `form`, `onChange`를 props로 전달받는다.

### `studentFormConfig.js`

- 학교급별 표시 이름과 학년 수를 정의한다.
- 빈 학생 폼의 기본 구조를 제공한다.
- 학교급에 맞는 학년 옵션을 생성한다.
- `중2`와 같은 학년 문자열을 생성하거나 학교급·학년 값으로 분해한다.
- React UI를 포함하지 않는 순수 설정 및 변환 파일이다.

## 스타일 파일

### `StudentManagementLayout.scss`

- 학생 관리 공통 레이아웃의 높이, 배경, 사이드바 옆 본문 영역과 반응형 여백을 정의한다.

### `StudentListPage.scss`

- 목록 화면의 툴바, 테이블, 행 상태, 페이지네이션과 선택 바 스타일을 정의한다.
- 하위 목록 컴포넌트가 사용하는 `student-list` BEM 클래스의 단일 스타일 소스다.

### `components/StudentFormModal.scss`

- 등록·상세 모달이 공유하는 레이아웃과 입력 필드, 학년·상태 버튼, 푸터 버튼 스타일을 정의한다.
- 모달별로 같은 스타일을 다시 작성하지 않는다.

## 외부 의존 파일

- `src/mocks/students.js`: 학생 목록 개발용 초기 데이터
- `src/components/Header/Header.jsx`: 서비스 공통 헤더
- `src/components/StudentSidebar/StudentSidebar.jsx`: 학생 관리용 사이드바
- `src/components/common/CustomSelect/CustomSelect.jsx`: 공통 드롭다운
- `src/components/common/CustomCheckbox/CustomCheckbox.jsx`: 목록 선택용 공통 체크박스
- `src/App.jsx`: 학생 관리 중첩 라우트 등록

## 데이터 흐름

```text
src/mocks/students.js
        ↓
StudentListPage (학생 데이터와 화면 상태 관리)
        ├── StudentToolbar (필터·검색 변경 요청)
        ├── StudentTable (선택·상세보기 요청)
        ├── StudentSelectionBar (일괄 상태 변경 요청)
        ├── StudentRegistrationModal (신규 학생 등록 요청)
        └── StudentDetailModal (기존 학생 저장 요청)
```

실제 API가 연결되면 서버 요청과 응답 처리는 `StudentListPage`에 직접 누적하지 않고 별도의 API 모듈 또는 전용 훅으로 분리한다.

## 변경 시 원칙

- 페이지는 데이터와 화면 상태를 조정하고, 반복되는 UI 표현은 하위 컴포넌트에 위임한다.
- 등록·상세 모달에 동일한 필드를 각각 중복 작성하지 않는다.
- 학생 폼의 공통 필드를 변경하면 등록과 상세 화면에 모두 필요한 변경인지 먼저 확인한다.
- 새로운 학생 관리 하위 페이지는 `StudentManagementLayout`의 중첩 라우트로 추가한다.
- 파일의 책임이 달라지거나 컴포넌트가 추가·삭제되면 이 문서를 함께 수정한다.
