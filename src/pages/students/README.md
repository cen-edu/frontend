# 학생 관리 페이지 구조 명세

이 문서는 학생 관리 영역의 페이지, 컴포넌트, 데이터 흐름과 각 파일의 책임을 설명한다. 파일을 추가하거나 기존 파일의 역할을 변경할 때 이 문서도 함께 갱신한다.

## 라우팅 구조

| 경로 | 화면 | 역할 |
| --- | --- | --- |
| `/students` | `StudentListPage` | 학생 목록 조회, 필터링, 선택, 등록, 수정 |
| `/students/classes` | `ClassManagementPage` | 반 목록 조회, 검색, 선택, 순서 변경, 생성, 수정 |
| `/student?student={학생 ID}` | `StudentHomePage` | 선택한 학생의 학생앱 메인 화면 미리보기 |

`/students`, `/students/classes`는 `StudentManagementLayout`을 공통 부모로 사용한다. `StudentManagementLayout`은 공용 `SectionLayout`에 학생 관리 메뉴 설정을 전달하며, 자식 화면은 `SectionLayout`의 `Outlet` 위치에 렌더링된다. 반 생성과 상세 수정은 별도 경로로 이동하지 않고 `/students/classes` 목록 위에 모달로 표시한다.

## 디렉터리 구조

```text
src/pages/students/
├── README.md
├── StudentManagementLayout.jsx
├── ClassManagementPage/
│   ├── ClassManagementPage.jsx
│   ├── ClassManagementPage.scss
│   ├── classHooks.js
│   ├── classFormConfig.js
│   └── components/
│       ├── ClassToolbar.jsx
│       ├── ClassTable.jsx
│       ├── ClassFormModal.jsx
│       ├── ClassFormModal.scss
│       └── ClassSelectionBar.jsx
├── StudentListPage/
│   ├── StudentListPage.jsx
│   ├── StudentListPage.scss
│   ├── studentHooks.js
│   ├── studentFormConfig.js
│   └── components/
│       ├── StudentToolbar.jsx
│       ├── StudentTable.jsx
│       ├── StudentSelectionBar.jsx
│       ├── StudentBulkRegistrationModal.jsx
│       ├── StudentBulkRegistrationModal.scss
│       ├── StudentRegistrationModal.jsx
│       └── StudentDetailModal.jsx
└── shared/
    ├── StudentFormModal.jsx
    ├── StudentFormModal.scss
    ├── StudentGradeSelector.jsx
    ├── gradeOptions.js
    └── studentManagementConstants.js
```

## 페이지와 레이아웃

### `StudentManagementLayout.jsx`

- 학생 관리 영역의 공통 레이아웃이다.
- 공용 `SectionLayout`에 `students` 섹션 키를 전달한다.
- 전역 헤더, 사이드바와 `Outlet` 배치는 `SectionLayout`이 담당한다.
- 목록 데이터나 모달 상태를 직접 관리하지 않는다.

### `StudentListPage.jsx`

- 학생 목록 화면의 상태와 데이터 흐름을 관리하는 컨테이너 페이지다.
- 검색어, 등록 연도·`1/2/3` 학년·반 필터, 정렬 방식과 선택된 학생 ID를 관리한다.
- 필터와 1부터 시작하는 화면 페이지를 API 요청 파라미터로 변환하고, 화면 크기와 무관한 고정 페이지 크기 10명으로 서버가 반환한 현재 페이지 학생 목록과 전체 개수를 표시한다.
- 학생의 반은 학생 응답의 `classes` 배열을 사용하고, 반이 없으면 미배정으로 표시한다.
- 등록·상세 수정·선택 학생 삭제는 전용 API가 연결되기 전까지 비활성 상태로 둔다.
- 페이지 제목, 기능 설명과 현재 검색 결과 인원수를 목록 위에 표시한다.
- 학생 일괄 등록과 개별 등록 모달의 열림 상태를 관리한다.
- 화면 표현은 `StudentToolbar`, `StudentTable`, `StudentSelectionBar`에 위임한다.
- 목록 조회는 `useStudentsQuery`에 위임하며 개발용 학생·반 mock을 가져오지 않는다.

### `StudentListPage/studentHooks.js`

- React Query로 교사 학생 목록을 조회한다.
- 필터·정렬·페이지 요청값 전체를 query key에 포함한다.
- query function의 `signal`을 학생 목록 API 요청에 전달하고 페이지 전환 중 이전 데이터를 유지한다.
- 개별 등록과 CSV 일괄 등록, 삭제 mutation은 학생 목록과 학생 구성을 사용하는 대시보드·학습 현황·평가 결과·취약점 분석 query를 무효화한다.

### `ClassManagementPage.jsx`

- `/students/classes` 경로에 대응하는 반 관리 페이지다.
- 반 목록은 `useClassesQuery`로 조회하고 학년도·학년 필터, 검색어와 선택된 반 ID를 관리한다.
- 필터와 반 이름 검색 조건은 `GET /api/teacher/classes`의 쿼리 파라미터로 전달한다.
- 필터 옵션과 순서 변경 요청에 필요한 전체 활성 반 ID를 위해 조건 없는 반 목록도 조회한다.
- 페이지 제목, 반 순서 반영 안내와 현재 검색 결과 개수를 목록 위에 표시한다.
- 검색 결과의 전체 선택과 개별 선택을 처리한다.
- 반 만들기와 상세 수정 모달의 열림 상태를 관리한다.
- 선택 반 삭제는 `DELETE /api/teacher/classes`, 순서 변경은 `PATCH /api/teacher/classes/order`로 요청한다.
- 순서 변경 시 화면 필터와 무관하게 교사가 소유한 전체 활성 반 ID를 최종 순서대로 전달한다.
- 반 목록과 담당 교사 이름은 각각 반 API와 `GET /api/teacher/account`에서 조회하며 개발용 반·교사 mock을 가져오지 않는다.

### `ClassManagementPage/classHooks.js`

- 반 목록·상세·배정 가능 학생 조회와 생성·수정·삭제·순서 변경 mutation을 React Query로 관리한다.
- 조회 조건과 반 ID를 query key에 포함하고 query function의 `signal`을 Axios 요청에 전달한다.
- 변경 요청 성공 후 `teacher/classes`, `teacher/students`, `teacher/academic-contexts`와 학급 구성을 사용하는 대시보드·학습 현황·평가 결과·취약점 분석 query를 무효화해 삭제된 반이 다른 화면에 남지 않게 한다.

## 반 관리 컴포넌트

### `ClassToolbar.jsx`

- 왼쪽에 학년도·학년 필터를, 오른쪽에 반 이름 검색창과 반 만들기 버튼을 렌더링한다.
- 학년도에 존재하는 학년만 학년 필터에 제공하며 학년도 변경 시 학년 선택을 전체로 초기화한다.
- 선생님 필터는 제공하지 않는다.
- 학년도·학년·검색어 변경과 반 생성 모달을 열 요청을 `ClassManagementPage`에 전달한다.

### `ClassTable.jsx`

- 반 순서, `학년도 + 학년 + 반 이름` 조합 라벨, 서버가 반환한 학생 수, 현재 담당 선생님과 상세 버튼을 표로 표시한다.
- 공통 `CustomCheckbox` 또는 행 전체 클릭으로 전체·개별 반을 선택하며 행 hover와 키보드 포커스 피드백을 제공한다.
- 행 전체를 마우스로 드래그해 다른 행의 위·아래에 놓거나 이동 핸들에 포커스한 뒤 방향키를 눌러 순서를 변경할 수 있다.
- 드래그 중인 행과 놓일 위치를 시각적으로 표시한다.

### `ClassSelectionBar.jsx`

- 한 개 이상의 반이 선택되면 반 관리 화면 하단에 표시된다.
- 선택된 반 개수와 삭제·선택 해제 메뉴를 제공한다.
- 실제 반 일괄 삭제와 선택 상태 변경은 `ClassManagementPage`에 요청하며 삭제 중에는 중복 동작을 막는다.

### `ClassFormModal.jsx`

- 반 생성과 상세 수정에 공통으로 사용하는 반 폼 모달이다.
- `StudentFormModal` 프레임을 재사용하며 바깥 영역 클릭과 `Escape` 닫기, 본문 스크롤 잠금 동작을 공유한다.
- 학년도는 선택할 수 없는 읽기 전용 값이다. 반 만들기에서는 현재 연도가, 상세 수정에서는 해당 반의 학년도가 고정 표시된다.
- 반 이름, 학생 검색어와 선택된 학생 객체를 함께 관리한다.
- 담당 선생님 선택 UI는 제공하지 않는다. 서버가 인증된 교사를 담임으로 지정한다.
- 상세 수정 시 `GET /api/teacher/classes/{classId}`로 반 정보와 소속 학생을 조회한다.
- 후보 학생은 선택 학년과 검색어로 `GET /api/teacher/classes/available-students`를 조회하며 개별 학생 단위로 추가·제외한다.
- 학년을 변경하면 기존 선택 학생을 초기화해 다른 학년 학생이 수정 요청에 섞이지 않게 한다.
- 추가·제외 아이콘뿐 아니라 각 목록 행 전체를 클릭할 수 있고 hover 및 키보드 포커스 피드백을 제공한다.
- 생성은 `POST /api/teacher/classes`, 수정은 `PATCH /api/teacher/classes/{classId}`로 요청하며 성공 시 모달을 닫는다.
- 반 이름은 서버 제한과 동일하게 최대 20자로 제한하고 조회·저장 오류와 진행 상태를 모달 안에 표시한다.

## 목록 컴포넌트

### `StudentToolbar.jsx`

- 최신 등록순·이름순 정렬을 제공한다.
- 현재 조회 결과에 존재하는 등록 연도와 전체·1학년·2학년·3학년 셀렉트 필터를 제공한다.
- 별도 반 목록 API가 연결되기 전에는 현재 조회 결과의 반으로 전체 반과 각 반 이름 옵션을 구성한다. 목록 API 요청에 미배정 조건이 없으므로 미배정 필터는 제공하지 않는다.
- 학생 이름 검색 입력을 제공한다.
- 학생 일괄 등록 및 개별 등록 버튼을 렌더링하고 각 모달 열기 요청을 상위 페이지에 전달한다.
- 필터 상태는 직접 소유하지 않고 `StudentListPage`에서 props로 전달받는다.

### `StudentTable.jsx`

- 필터링된 학생 목록을 테이블로 표시한다.
- 선택 열 다음의 첫 데이터 열에 등록 연도를 표시하고 상태 열은 제공하지 않는다.
- 데이터 열은 등록 연도, 학년, 반, 학생 이름, 학생 ID다.
- 반 이름은 `getClassLabel`로 전달받고 값이 없으면 흐린 색의 `미배정`으로 표시한다.
- 전체 선택과 개별 학생 선택을 처리한다.
- 행 클릭 및 `Enter`, `Space` 키를 통한 선택을 지원한다.
- 학생앱 이동 및 상세보기 버튼을 렌더링한다.
- 학생앱 이동은 선택한 학생 ID를 `student` 쿼리로 전달해 독립 라우트의 `StudentHomePage`를 연다.
- 상세보기 요청은 선택된 학생 객체를 상위 페이지에 전달한다.

### `StudentSelectionBar.jsx`

- 한 명 이상의 학생이 선택되었을 때 하단에 표시된다.
- 선택 인원수를 표시한다.
- 선택 학생 삭제와 선택 해제를 요청한다.
- 삭제 API가 연결되기 전에는 삭제 동작을 비활성화한다.

## 학생 폼 모달 컴포넌트

### `StudentFormModal.jsx`

- 등록·상세 모달이 공유하는 모달 프레임이다.
- 오버레이, 제목, 닫기 버튼과 Portal 렌더링을 담당한다.
- 모달이 열리면 본문 스크롤을 잠근다.
- 바깥 영역 클릭과 `Escape` 키로 닫기를 지원한다.
- 실제 폼 내용과 푸터 버튼은 `children`으로 전달받는다.
- `width` prop으로 모달별 너비를 조절한다.

### `StudentBulkRegistrationModal.jsx`

- 학생 일괄 등록을 위한 양식 다운로드와 파일 첨부 흐름을 제공한다.
- `학생 이름,학년` 헤더와 예시 행이 포함된 UTF-8 BOM CSV 양식을 생성해 다운로드한다.
- 1MB 이하의 CSV 파일만 선택할 수 있으며 선택한 파일명을 표시한다.
- 파일이 첨부된 경우에만 등록 버튼을 활성화하고 업로드 중에는 파일 선택과 모달 닫기를 막는다.
- 파일 사전 검증 오류와 서버가 반환한 행별 오류 메시지를 모달 내부에 표시한다.
- 실제 파일 해석과 최대 500명 제한, 행별 데이터 검증은 서버에서 처리한다.

### `StudentRegistrationModal.jsx`

- 신규 학생 정보를 입력하는 폼이다.
- 현재 연도를 수정할 수 없는 등록 연도 값으로 자동 표시하고 학생 이름, 학년과 함께 필수값으로 전달한다.
- 모든 항목이 필수라 섹션 제목과 `(필수)` 표시 없이 세 개 필드를 세로 1열로 나열한다.
- 선택 입력 영역은 제공하지 않는다. 나머지 정보는 등록 후 `StudentDetailModal`에서 입력한다.
- 제출 시 입력값을 정리해 `onRegister`로 상위 페이지에 전달한다.
- 학생 ID 생성은 `StudentListPage`가 담당한다.

### `StudentDetailModal.jsx`

- 기존 학생 정보를 확인하고 수정하는 폼이다.
- 학생 이름과 학년을 수정한다.
- 등록 연도와 학생 ID는 읽기 전용으로 표시한다.
- 등록 모달과 동일하게 섹션 제목 없이 네 개 필드를 세로 1열로 나열한다.
- 학생 비밀번호 초기화 UI를 제공한다.
- 저장 결과를 `onSave`로 상위 페이지에 전달한다.

### `StudentGradeSelector.jsx`

- `1학년/2학년/3학년` 공통 드롭다운을 제공한다.
- 서비스 공통 `CustomSelect`를 사용한다.
- 학년 옵션은 `shared/gradeOptions.js`의 공통 설정을 사용한다.

### `StudentListPage/studentFormConfig.js`

- 빈 학생 폼의 기본 구조를 제공한다.
- React UI를 포함하지 않는 순수 설정 및 변환 파일이다.

### `ClassManagementPage/classFormConfig.js`

- 반 폼에 고정 표시할 현재 학년도 값을 제공한다.
- 반 목록과 접근성 라벨에서 사용하는 `학년도 + 학년 + 반 이름` 조합 함수를 제공한다.

### `shared/gradeOptions.js`

- 학생과 반이 공통으로 사용하는 `1/2/3` 학년 옵션을 정의한다.

### `shared/studentManagementConstants.js`

- 학생 목록과 반 필터가 함께 사용하는 미배정 값 `UNASSIGNED_CLASS`를 정의한다.

## 스타일 파일

### `StudentListPage.scss`

- 목록 화면의 제목·결과 건수, 툴바, 텍스트·숫자 정렬이 구분된 테이블, 행 상태, 페이지네이션과 선택 바 스타일을 정의한다.
- 하위 목록 컴포넌트가 사용하는 `student-list` BEM 클래스의 단일 스타일 소스다.

### `ClassManagementPage.scss`

- 반 관리 제목·결과 건수, 툴바, 검색, 목록 테이블과 선택 바의 `class-management` BEM 스타일을 정의한다.

### `ClassManagementPage/components/ClassFormModal.scss`

- 반 폼 모달의 기본 필드, 학생 선택 패널과 검색창의 `class-form-modal` BEM 스타일을 정의한다.

### `shared/StudentFormModal.scss`

- 등록·상세 모달이 공유하는 레이아웃과 입력 필드, 학년 선택, 푸터 버튼 스타일을 정의한다.
- 모달별로 같은 스타일을 다시 작성하지 않는다.

## 외부 의존 파일

- `src/api/classes/classesApi.js`: 반 목록·상세·배정 가능 학생 조회와 생성·수정·삭제·순서 변경 요청을 담당하는 API 모듈
- `src/api/students/studentsApi.js`: 학생 목록 조회, 개별 등록·삭제와 `POST /api/teacher/students/bulk` CSV 일괄 등록 요청을 담당하는 API 모듈
- `src/api/teachers/teacherAccountApi.js`: 반 목록의 현재 담당 교사 이름 조회에 사용하는 계정 API 모듈
- `src/components/Header/Header.jsx`: 서비스 공통 헤더
- `src/components/SectionLayout/SectionLayout.jsx`: 헤더, 공용 사이드바와 중첩 화면을 배치하는 섹션 공통 레이아웃
- `src/components/Sidebar/Sidebar.jsx`: 섹션별 메뉴 배열을 렌더링하는 공용 사이드바
- `src/config/sidebarMenus.js`: 문제 만들기, 학습 관리, 학생 관리의 사이드바 메뉴 설정
- `src/components/common/CustomSelect/CustomSelect.jsx`: 공통 드롭다운
- `src/components/common/CustomCheckbox/CustomCheckbox.jsx`: 목록 선택용 공통 체크박스
- `src/App.jsx`: 학생 관리 중첩 라우트 등록
- `src/pages/student/StudentHomePage`: 학생별 배정 학습지를 `전체 / 숙제 / 평가`로 조회하고 카드 단위로 선택하는 독립 학생앱 메인 화면
- `src/mocks/studentAssignments.js`: 학생앱 메인 화면의 배정 데이터와 유형·상태·맞춤 단계 라벨

## 데이터 흐름

```text
StudentListPage (필터·페이지·선택 상태 관리)
        ↓
useStudentsQuery
        ↓
src/api/students/studentsApi.js
        ↓
GET /api/teacher/students
        ↓
StudentListPage (서버 목록·페이지 정보 표시)
        ├── StudentToolbar (필터·검색 변경 및 등록 모달 열기 요청)
        ├── StudentTable (선택·상세보기·학생앱 이동 요청)
        ├── StudentSelectionBar (선택 해제·학생 삭제 요청)
        ├── StudentBulkRegistrationModal (양식 다운로드·파일 첨부)
        └── StudentRegistrationModal (개별 학생 등록 요청)
```

```text
ClassManagementPage (필터·검색·선택·모달 상태 관리)
        ↓
useClassesQuery ──→ src/api/classes/classesApi.js ──→ GET /api/teacher/classes
        ├── ClassToolbar (조회 조건 변경·반 생성 요청)
        ├── ClassTable (선택·상세·전체 ID 기반 순서 변경 요청)
        ├── ClassSelectionBar ──→ DELETE /api/teacher/classes
        └── ClassFormModal
                ├── GET /api/teacher/classes/{classId}
                ├── GET /api/teacher/classes/available-students
                ├── POST /api/teacher/classes
                └── PATCH /api/teacher/classes/{classId}

순서 변경 ──→ PATCH /api/teacher/classes/order
변경 성공 ──→ 반·학생·학급 문맥·관련 업무 query 무효화 ──→ 서버 데이터 재조회
```

학생 등록·삭제 후에는 학생 목록뿐 아니라 학생 구성을 집계하는 업무 query도 무효화해 서버 데이터를 다시 조회한다.

## 변경 시 원칙

- 페이지는 데이터와 화면 상태를 조정하고, 반복되는 UI 표현은 하위 컴포넌트에 위임한다.
- 등록·상세 모달에 동일한 필드를 각각 중복 작성하지 않는다.
- 학생 폼의 공통 필드를 변경하면 등록과 상세 화면에 모두 필요한 변경인지 먼저 확인한다.
- 새로운 학생 관리 하위 페이지는 기본적으로 `StudentManagementLayout`의 중첩 라우트로 추가하고 `src/config/sidebarMenus.js`에도 메뉴를 등록하며, 공통 헤더와 사이드바가 없어야 하는 전체 화면 흐름만 독립 라우트로 분리한다.
- 파일의 책임이 달라지거나 컴포넌트가 추가·삭제되면 이 문서를 함께 수정한다.
