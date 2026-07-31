export const sidebarMenus = {
    problems: {
        ariaLabel: '문제 만들기 메뉴',
        menus: [
            { label: '문제 생성', path: '/problems', end: true },
            { label: '종합평가 생성', path: '/problems/comprehensive' },
            { label: '맞춤 문제 생성', path: '/problems/custom' },
            { label: '문제 보관함', path: '/problems/library' },
        ],
    },
    learning: {
        ariaLabel: '학습 관리 메뉴',
        menus: [
            { label: '학습 현황', path: '/learning', end: true },
            { label: '평가 결과', path: '/learning/results' },
            { label: '오답 학습', path: '/learning/wrong-answers' },
            { label: '취약점 분석', path: '/learning/weaknesses' },
        ],
    },
    students: {
        ariaLabel: '학생 관리 메뉴',
        menus: [
            { label: '학생 관리', path: '/students', end: true },
            { label: '반 관리', path: '/students/classes' },
            { label: '학생별 학습 리포트', path: '/students/reports' },
        ],
    },
};
