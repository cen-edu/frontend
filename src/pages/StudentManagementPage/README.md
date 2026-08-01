# 학생 관리 페이지 구조 명세

이 문서는 학생 관리 영역의 페이지, 컴포넌트, 데이터 흐름과 각 파일의 책임을 설명한다. 파일을 추가하거나 기존 파일의 역할을 변경할 때 이 문서도 함께 갱신한다.

## 라우팅 구조

| 경로 | 화면 | 역할 |
| --- | --- | --- |
| `/students` | `StudentListPage` | 학생 목록 조회, 필터링, 선택, 등록, 수정 |
| `/students/classes` | `ClassManagementPage` | 반 목록 조회, 검색, 선택, 순서 변경, 생성, 수정 |
| `/students/reports` | `FeatureIntro` | 대시보드에서 학생별 결과를 선택해 진입하는 초기 안내 화면 |
| `/students/classes/new` | `ClassCreationRoutePage` | 헤더와 사이드바 안에서 반 이름과 학생을 설정하는 생성 화면 |
| `/students/classes/:classId/edit` | `ClassEditRoutePage` | 반 생성 화면을 재사용하는 독립 반 수정 화면 |

`/students`, `/students/classes`, `/students/classes/new`, `/students/reports`는 `StudentManagementLayout`을 공통 부모로 사용한다. `StudentManagementLayout`은 공용 `SectionLayout`에 학생 관리 메뉴 설정을 전달하며, 자식 화면은 `SectionLayout`의 `Outlet` 위치에 렌더링된다. `/students/reports`는 학생 관리 사이드바 메뉴에는 노출하지 않고 대시보드의 학생별 결과에서 진입한다. 반 수정 경로만 전역 헤더와 사이드바를 표시하지 않는 독립 라우트다.

## 디렉터리 구조

```text
StudentManagementPage/
├── README.md
├── StudentManagementLayout.jsx
├── StudentListPage.jsx
├── StudentListPage.scss
├── ClassManagementPage.jsx
├── ClassManagementPage.scss
├── ClassCreationRoutePage.jsx
├── ClassCreationRoutePage.scss
├── ClassEditRoutePage.jsx
└── components/
    ├── ClassToolbar.jsx
    ├── ClassTable.jsx
    ├── ClassCreationPage.jsx
    ├── ClassCreationPage.scss
    ├── ClassSelectionBar.jsx
    ├── StudentToolbar.jsx
    ├── StudentTable.jsx
    ├── StudentSelectionBar.jsx
    ├── StudentFormModal.jsx
    ├── StudentFormModal.scss
    ├── StudentBulkRegistrationModal.jsx
    ├── StudentBulkRegistrationModal.scss
    ├── StudentRegistrationModal.jsx
    ├── StudentDetailModal.jsx
    ├── StudentGradeSelector.jsx
    ├── StudentOptionalFields.jsx
    └── studentFormConfig.js
```

## 페이지와 레이아웃

### `StudentManagementLayout.jsx`

- 학생 관리 영역의 공통 레이아웃이다.
- 공용 `SectionLayout`에 `students` 섹션 키를 전달한다.
- 전역 헤더, 사이드바와 `Outlet` 배치는 `SectionLayout`이 담당한다.
- 목록 데이터나 모달 상태를 직접 관리하지 않는다.

### `StudentListPage.jsx`

- 학생 목록 화면의 상태와 데이터 흐름을 관리하는 컨테이너 페이지다.
- 검색어, 학교급 필터, 상태 필터, 정렬 방식과 선택된 학생 ID를 관리한다.
- 학생 등록, 상세 수정, 활성·비활성 일괄 변경과 선택 학생 삭제 로직을 소유한다.
- 페이지 제목, 기능 설명과 현재 검색 결과 인원수를 목록 위에 표시한다.
- 화면 표현은 `StudentToolbar`, `StudentTable`, `StudentSelectionBar`에 위임한다.
- 일괄 등록·개별 등록·상세 모달의 열림 상태와 저장 결과를 관리한다.
- 개발용 초기 데이터는 `src/mocks/students.js`에서 가져온다.

### `ClassManagementPage.jsx`

- `/students/classes` 경로에 대응하는 반 관리 페이지다.
- 반 목록, 검색어와 선택된 반 ID를 관리한다.
- 페이지 제목, 반 순서 반영 안내와 현재 검색 결과 개수를 목록 위에 표시한다.
- 검색 결과의 전체 선택과 개별 선택을 처리한다.
- 반 만들기 버튼을 누르면 현재 반 목록을 라우트 상태로 전달하며 중첩 생성 경로로 이동한다.
- 생성·수정 경로에서 전달받은 목록과 키보드 방향키를 이용한 반 순서 변경을 반 목록에 반영한다.
- 개발용 초기 데이터는 `src/mocks/classes.js`에서 가져온다.

### `ClassCreationRoutePage.jsx`

- `/students/classes/new`에 대응하며 `StudentManagementLayout`의 `Outlet` 안에서 렌더링된다.
- 공통 헤더와 학생 관리 사이드바 안에 반 생성 폼을 표시한다.
- 반 목록을 라우트 상태로 보존하고 닫기 또는 등록 시 `/students/classes`로 전달한다.

### `ClassEditRoutePage.jsx`

- `/students/classes/:classId/edit`에 대응하며 `StudentManagementLayout` 밖에서 렌더링된다.
- 라우트 상태나 초기 더미 목록에서 수정 대상 반을 찾아 `ClassCreationPage`에 초기값으로 전달한다.
- 수정하거나 닫을 때 현재 반 목록을 보존해 `/students/classes`로 복귀한다.
- 대상 반이 없으면 안내와 목록 복귀 버튼을 표시한다.

## 반 관리 컴포넌트

### `ClassToolbar.jsx`

- 반 이름 검색창과 반 만들기 버튼을 렌더링한다.
- 선생님 필터는 제공하지 않는다.
- 검색어와 반 생성 화면으로 이동할 요청을 `ClassManagementPage`에 전달한다.

### `ClassTable.jsx`

- 반 순서, 반 이름, 학생 요약, 담당 선생님과 상세 버튼을 표로 표시한다.
- 공통 `CustomCheckbox` 또는 행 전체 클릭으로 전체·개별 반을 선택하며 행 hover와 키보드 포커스 피드백을 제공한다.
- 행 전체를 마우스로 드래그해 다른 행의 위·아래에 놓거나 이동 핸들에 포커스한 뒤 방향키를 눌러 순서를 변경할 수 있다.
- 드래그 중인 행과 놓일 위치를 시각적으로 표시한다.

### `ClassSelectionBar.jsx`

- 한 개 이상의 반이 선택되면 반 관리 화면 하단에 표시된다.
- 선택된 반 개수와 삭제·선택 해제 메뉴를 제공한다.
- 실제 반 삭제와 선택 상태 변경은 `ClassManagementPage`에 요청한다.

### `ClassCreationPage.jsx`

- 생성·수정 경로에서 사용하는 공통 반 폼 화면이다.
- 화면 제목 아래에 반 이름과 소속 학생을 설정하는 작업 맥락을 표시한다.
- 반 이름과 학생 검색어, 선택된 학생 ID를 관리한다.
- 담당 선생님 선택 UI는 제공하지 않으며 등록·수정 결과에는 현재 사용자 `이하영 선생님`을 고정 배정한다.
- 수정 시 전달받은 반 이름과 선택 ID를 초기값으로 사용하고 제목·제출 버튼 문구를 화면 용도에 맞게 표시한다.
- 검색 결과의 학생을 개별 또는 학년 그룹 단위로 추가하고 선택 목록에서 개별 또는 그룹 단위로 제외한다.
- 추가·제외 아이콘뿐 아니라 각 목록 행 전체를 클릭할 수 있고 hover 및 키보드 포커스 피드백을 제공한다.
- 등록 시 선택 결과를 반 목록 형식으로 정리해 `ClassManagementPage`에 전달하고 닫기 버튼으로 목록에 복귀한다.

## 목록 컴포넌트

### `StudentToolbar.jsx`

- 최신 등록순·이름순 정렬을 제공한다.
- 전체·초·중·고 학교급 필터와 활성·비활성 상태 필터를 제공한다.
- 학생 이름 검색 입력을 제공한다.
- 학생 일괄 등록 및 개별 등록 버튼을 렌더링하고 각 모달 열기 요청을 상위 페이지에 전달한다.
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
- 선택 학생의 활성·비활성 일괄 변경, 삭제와 선택 해제를 요청한다.
- 실제 학생 데이터 변경은 `StudentListPage`가 수행한다.

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
- CSV 양식을 생성해 다운로드한다.
- 엑셀 또는 CSV 파일 첨부를 지원하고 선택한 파일명을 표시한다.
- 파일이 첨부된 경우에만 등록 버튼을 활성화한다.
- 실제 파일 해석과 서버 등록은 향후 API 연동 계층에서 처리한다.

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

### `StudentListPage.scss`

- 목록 화면의 제목·결과 건수, 툴바, 텍스트·숫자 정렬이 구분된 테이블, 행 상태, 페이지네이션과 선택 바 스타일을 정의한다.
- 하위 목록 컴포넌트가 사용하는 `student-list` BEM 클래스의 단일 스타일 소스다.

### `ClassManagementPage.scss`

- 반 관리 제목·결과 건수, 툴바, 검색, 목록 테이블과 선택 바의 `class-management` BEM 스타일을 정의한다.

### `components/ClassCreationPage.scss`

- 반 생성 화면의 헤더, 학생 선택 패널, 검색창과 등록 푸터의 `class-creation` BEM 스타일을 정의한다.

### `ClassCreationRoutePage.scss`

- 중첩 반 생성 화면과 독립 반 수정 화면의 배경, 여백과 높이를 각각 정의한다.
- 데스크톱 중첩 생성 화면은 등록 푸터가 뷰포트 안에 유지되도록 카드 높이를 제한하고 학생 목록 패널 내부에서 스크롤한다.

### `components/StudentFormModal.scss`

- 등록·상세 모달이 공유하는 레이아웃과 입력 필드, 학년·상태 버튼, 푸터 버튼 스타일을 정의한다.
- 모달별로 같은 스타일을 다시 작성하지 않는다.

## 외부 의존 파일

- `src/mocks/students.js`: 학생 목록 개발용 초기 데이터
- `src/mocks/classes.js`: 반 목록 개발용 초기 데이터
- `src/mocks/teachers.js`: 로그인 사용자 연동 전 담당 선생님을 고정하는 개발용 데이터
- `src/components/Header/Header.jsx`: 서비스 공통 헤더
- `src/components/SectionLayout/SectionLayout.jsx`: 헤더, 공용 사이드바와 중첩 화면을 배치하는 섹션 공통 레이아웃
- `src/components/Sidebar/Sidebar.jsx`: 섹션별 메뉴 배열을 렌더링하는 공용 사이드바
- `src/components/FeatureIntro/FeatureIntro.jsx`: 아직 구현되지 않은 하위 메뉴의 초기 안내 화면
- `src/config/sidebarMenus.js`: 문제 만들기, 학습 관리, 학생 관리의 사이드바 메뉴 설정
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
        ├── StudentBulkRegistrationModal (일괄 등록 파일 전달)
        ├── StudentRegistrationModal (신규 학생 등록 요청)
        └── StudentDetailModal (기존 학생 저장 요청)
```

```text
src/mocks/classes.js
        ↓
ClassManagementPage (반 데이터와 화면 상태 관리)
        ├── ClassToolbar (검색 변경·반 생성 요청)
        ├── ClassTable (선택·상세·순서 변경 요청)
        └── ClassSelectionBar (선택 반 삭제·선택 해제 요청)

ClassManagementPage ── 현재 반 목록 전달 ──→ StudentManagementLayout
                                              └── ClassCreationRoutePage
                                                    └── ClassCreationPage (학생 선택과 반 생성 요청, 현재 선생님 고정 배정)
                                                        ↓
                                     등록된 반 목록과 함께 ClassManagementPage로 복귀

ClassManagementPage ── 수정할 반과 목록 전달 ──→ ClassEditRoutePage
                                                └── ClassCreationPage (기존 선택값 수정 요청)
                                                          ↓
                                       수정된 반 목록과 함께 ClassManagementPage로 복귀
```

실제 API가 연결되면 서버 요청과 응답 처리는 `StudentListPage`에 직접 누적하지 않고 별도의 API 모듈 또는 전용 훅으로 분리한다.

## 변경 시 원칙

- 페이지는 데이터와 화면 상태를 조정하고, 반복되는 UI 표현은 하위 컴포넌트에 위임한다.
- 등록·상세 모달에 동일한 필드를 각각 중복 작성하지 않는다.
- 학생 폼의 공통 필드를 변경하면 등록과 상세 화면에 모두 필요한 변경인지 먼저 확인한다.
- 새로운 학생 관리 하위 페이지는 기본적으로 `StudentManagementLayout`의 중첩 라우트로 추가하고 `src/config/sidebarMenus.js`에도 메뉴를 등록하며, 공통 헤더와 사이드바가 없어야 하는 전체 화면 흐름만 독립 라우트로 분리한다.
- 파일의 책임이 달라지거나 컴포넌트가 추가·삭제되면 이 문서를 함께 수정한다.
