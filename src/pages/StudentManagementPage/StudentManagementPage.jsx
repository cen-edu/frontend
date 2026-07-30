import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../components/Header/Header';
import StudentSidebar from '../../components/StudentSidebar/StudentSidebar';
import CustomCheckbox from '../../components/common/CustomCheckbox/CustomCheckbox';
import CustomSelect from '../../components/common/CustomSelect/CustomSelect';
import './StudentManagementPage.scss';

const initialStudents = [
    { id: 1, grade: '초3', status: 'active', name: '송현우', phone: '010-2451-7832', studentId: 'S42047134' },
    { id: 2, grade: '초5', status: 'active', name: '강채원', phone: '010-5827-1946', studentId: 'S31231332' },
    { id: 3, grade: '초6', status: 'inactive', name: '오시우', phone: '010-7364-5028', studentId: 'S71636550' },
    { id: 4, grade: '중1', status: 'active', name: '한예린', phone: '010-4198-6357', studentId: 'S30147956' },
    { id: 5, grade: '중2', status: 'active', name: '윤민준', phone: '010-8632-4701', studentId: 'S14787129' },
    { id: 6, grade: '중3', status: 'inactive', name: '정서아', phone: '010-2975-8463', studentId: 'S36230226' },
    { id: 7, grade: '고1', status: 'active', name: '최도윤', phone: '010-6543-2198', studentId: 'S15262340' },
    { id: 8, grade: '고2', status: 'active', name: '박지우', phone: '010-3816-7254', studentId: 'S87586847' },
    { id: 9, grade: '고2', status: 'inactive', name: '이서준', phone: '010-9284-3615', studentId: 'S81139551' },
    { id: 10, grade: '고3', status: 'active', name: '김하늘', phone: '010-5472-9086', studentId: 'S39625890' },
];

function StudentList() {
    const [students, setStudents] = useState(initialStudents);
    const [selectedIds, setSelectedIds] = useState([]);
    const [schoolLevel, setSchoolLevel] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortOrder, setSortOrder] = useState('newest');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredStudents = useMemo(() => {
        const keyword = searchTerm.trim().toLowerCase();

        const matches = students.filter((student) => {
            const level = student.grade.startsWith('초') ? 'elementary' : student.grade.startsWith('중') ? 'middle' : 'high';
            const matchesLevel = schoolLevel === 'all' || schoolLevel === level;
            const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
            const matchesSearch = !keyword || student.name.toLowerCase().includes(keyword);
            return matchesLevel && matchesStatus && matchesSearch;
        });

        return sortOrder === 'name'
            ? [...matches].sort((first, second) => first.name.localeCompare(second.name, 'ko'))
            : matches;
    }, [schoolLevel, searchTerm, sortOrder, statusFilter, students]);

    const visibleIds = filteredStudents.map((student) => student.id);
    const isAllSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));

    const toggleStudent = (studentId) => {
        setSelectedIds((current) => current.includes(studentId)
            ? current.filter((id) => id !== studentId)
            : [...current, studentId]);
    };

    const handleRowClick = (event, studentId) => {
        if (event.target.closest('button, input, a, label')) return;
        toggleStudent(studentId);
    };

    const handleRowKeyDown = (event, studentId) => {
        if (event.target !== event.currentTarget || !['Enter', ' '].includes(event.key)) return;
        event.preventDefault();
        toggleStudent(studentId);
    };

    const toggleAll = () => {
        setSelectedIds((current) => isAllSelected
            ? current.filter((id) => !visibleIds.includes(id))
            : [...new Set([...current, ...visibleIds])]);
    };

    const changeSelectedStatus = (status) => {
        setStudents((current) => current.map((student) =>
            selectedIds.includes(student.id) ? { ...student, status } : student));
        setSelectedIds([]);
    };

    return (
        <section className="student-list" aria-label="학생 목록">
            <div className="student-list__toolbar">
                <div className="student-list__filters">
                    <CustomSelect
                        label="정렬 순서"
                        value={sortOrder}
                        onChange={setSortOrder}
                        options={[
                            { value: 'newest', label: '최신 등록순' },
                            { value: 'name', label: '이름순' },
                        ]}
                    />

                    <div className="student-list__level-filter" aria-label="학년 구분">
                        {[
                            ['all', '전체'],
                            ['elementary', '초'],
                            ['middle', '중'],
                            ['high', '고'],
                        ].map(([value, label]) => (
                            <button
                                key={value}
                                type="button"
                                className={`student-list__filter-button${schoolLevel === value ? ' student-list__filter-button--active' : ''}`}
                                onClick={() => setSchoolLevel(value)}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    <CustomSelect
                        label="상태 필터"
                        value={statusFilter}
                        onChange={setStatusFilter}
                        width={104}
                        options={[
                            { value: 'all', label: '전체 상태' },
                            { value: 'active', label: '활성' },
                            { value: 'inactive', label: '비활성' },
                        ]}
                    />
                </div>

                <div className="student-list__actions">
                    <label className="student-list__search">
                        <span className="student-list__sr-only">학생 이름 검색</span>
                        <input
                            type="search"
                            placeholder="학생 이름 검색"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                        />
                        <i className="bi bi-search" aria-hidden="true" />
                    </label>
                    <button type="button" className="student-list__outline-button">
                        <i className="bi bi-people-fill" aria-hidden="true" />
                        학생 일괄 등록
                    </button>
                    <button type="button" className="student-list__primary-button">
                        <i className="bi bi-person-fill-add" aria-hidden="true" />
                        학생 개별 등록
                    </button>
                </div>
            </div>

            <div className="student-list__table-wrap">
                <table className="student-list__table">
                    <thead>
                        <tr>
                            <th className="student-list__check-cell">
                                <CustomCheckbox
                                    label="현재 목록 전체 선택"
                                    checked={isAllSelected}
                                    onChange={toggleAll}
                                />
                            </th>
                            <th>학년</th>
                            <th>상태</th>
                            <th>학생 이름</th>
                            <th>연락처</th>
                            <th>학생 ID</th>
                            <th>학생앱</th>
                            <th>상세</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map((student) => (
                            <tr
                                key={student.id}
                                className={`student-list__row${selectedIds.includes(student.id) ? ' student-list__row--selected' : ''}`}
                                tabIndex="0"
                                aria-selected={selectedIds.includes(student.id)}
                                onClick={(event) => handleRowClick(event, student.id)}
                                onKeyDown={(event) => handleRowKeyDown(event, student.id)}
                            >
                                <td className="student-list__check-cell">
                                    <CustomCheckbox
                                        label={`${student.name} 선택`}
                                        checked={selectedIds.includes(student.id)}
                                        onChange={() => toggleStudent(student.id)}
                                    />
                                </td>
                                <td>{student.grade}</td>
                                <td>
                                    <span className={`student-list__status student-list__status--${student.status}`}>
                                        {student.status === 'active' ? '활성' : '비활성'}
                                    </span>
                                </td>
                                <td>{student.name}</td>
                                <td>{student.phone}</td>
                                <td>{student.studentId}</td>
                                <td><button type="button" className="student-list__table-button">학생앱으로 이동</button></td>
                                <td><button type="button" className="student-list__table-button">상세보기</button></td>
                            </tr>
                        ))}
                        {filteredStudents.length === 0 && (
                            <tr><td className="student-list__empty" colSpan="8">검색 조건에 맞는 학생이 없습니다.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="student-list__pagination" aria-label="페이지 이동">
                <button type="button" disabled aria-label="이전 페이지"><i className="bi bi-chevron-left" /></button>
                <button type="button" className="student-list__pagination-current" aria-current="page">1</button>
                <button type="button" disabled aria-label="다음 페이지"><i className="bi bi-chevron-right" /></button>
            </div>

            {selectedIds.length > 0 && (
                <div className="student-list__selection-bar" role="region" aria-label="선택 학생 상태 변경">
                    <strong>학생 {selectedIds.length}명 선택됨</strong>
                    <div className="student-list__selection-actions">
                        <button type="button" onClick={() => changeSelectedStatus('active')}>
                            <i className="bi bi-check-circle" aria-hidden="true" />
                            활성
                        </button>
                        <button type="button" onClick={() => changeSelectedStatus('inactive')}>
                            <i className="bi bi-slash-circle" aria-hidden="true" />
                            비활성
                        </button>
                        <button type="button" className="student-list__selection-close" aria-label="선택 해제" onClick={() => setSelectedIds([])}>
                            <i className="bi bi-x-lg" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}

function StudentManagementPage() {
    const location = useLocation();
    const isStudentList = location.pathname === '/students';

    return (
        <div className="student-management-page">
            <Header />
            <div className="student-management-page__body">
                <StudentSidebar />
                <main className="student-management-page__content">
                    {isStudentList && <StudentList />}
                </main>
            </div>
        </div>
    );
}

export default StudentManagementPage;
