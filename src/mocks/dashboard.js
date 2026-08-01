export const dashboardClassOptions = [
    { value: 'middle-1-1', label: '중학교 1학년 1반' },
    { value: 'middle-1-2', label: '중학교 1학년 2반' },
    { value: 'all', label: '전체 반' },
];

const classOneStudents = [
    { id: 101, name: '김민서', lastStudy: '오늘', progress: 48, accuracy: 45, weakConcepts: 5 },
    { id: 102, name: '박준호', lastStudy: '어제', progress: 62, accuracy: 52, weakConcepts: 4 },
    { id: 103, name: '이서윤', lastStudy: '오늘', progress: 74, accuracy: 58, weakConcepts: 3 },
    { id: 104, name: '최지우', lastStudy: '7월 29일', progress: 69, accuracy: 64, weakConcepts: 3 },
    { id: 105, name: '정도윤', lastStudy: '오늘', progress: 82, accuracy: 71, weakConcepts: 2 },
    { id: 106, name: '한예린', lastStudy: '7월 28일', progress: 91, accuracy: 78, weakConcepts: 1 },
];

const classTwoStudents = [
    { id: 201, name: '윤하준', lastStudy: '어제', progress: 42, accuracy: 41, weakConcepts: 6 },
    { id: 202, name: '오서아', lastStudy: '오늘', progress: 57, accuracy: 49, weakConcepts: 4 },
    { id: 203, name: '강시우', lastStudy: '7월 29일', progress: 65, accuracy: 55, weakConcepts: 4 },
    { id: 204, name: '송채원', lastStudy: '오늘', progress: 73, accuracy: 63, weakConcepts: 3 },
    { id: 205, name: '임도현', lastStudy: '어제', progress: 86, accuracy: 69, weakConcepts: 2 },
    { id: 206, name: '백수빈', lastStudy: '오늘', progress: 94, accuracy: 81, weakConcepts: 1 },
];

const sharedActivities = [
    { id: 1, title: '김민서 학생이 종합평가를 제출했습니다.', time: '10분 전', icon: 'bi-file-earmark-check-fill', tone: 'blue', path: '/learning/results' },
    { id: 2, title: '채점 대기 중인 평가가 3건 있습니다.', time: '35분 전', icon: 'bi-exclamation-circle-fill', tone: 'orange', path: '/learning/results', emphasis: true },
    { id: 3, title: '2단원 맞춤 문제지 생성이 완료됐습니다.', time: '1시간 전', icon: 'bi-stars', tone: 'purple', path: '/problems/library' },
    { id: 4, title: '박준호 학생이 오답 학습을 완료했습니다.', time: '어제', icon: 'bi-check-circle-fill', tone: 'green', path: '/learning/wrong-answers' },
];

const dashboardData = {
    'middle-1-1': {
        summaries: [
            { id: 'students', label: '학생 수', value: '24명', support: '오늘 학습 참여 18명' },
            { id: 'assignments', label: '출제한 문제 · 평가', value: '12개', support: '이번 달 신규 4개' },
            { id: 'pending', label: '채점 대기', value: '3건', support: '오늘까지 확인이 필요해요' },
            { id: 'accuracy', label: '반 평균 정답률', value: '68%', support: '지난주보다 4.2%', trend: 'up' },
        ],
        weakConcepts: [
            { id: 1, name: '일차방정식의 활용', unit: '문자와 식', accuracy: 42, weakStudents: 8 },
            { id: 2, name: '정비례와 반비례', unit: '좌표평면과 그래프', accuracy: 48, weakStudents: 7 },
            { id: 3, name: '기본 도형의 작도', unit: '기본 도형', accuracy: 55, weakStudents: 5 },
        ],
        activities: sharedActivities,
        students: classOneStudents,
    },
    'middle-1-2': {
        summaries: [
            { id: 'students', label: '학생 수', value: '22명', support: '오늘 학습 참여 15명' },
            { id: 'assignments', label: '출제한 문제 · 평가', value: '9개', support: '이번 달 신규 3개' },
            { id: 'pending', label: '채점 대기', value: '5건', support: '미제출 학생 2명 포함' },
            { id: 'accuracy', label: '반 평균 정답률', value: '64%', support: '지난주보다 1.8%', trend: 'down' },
        ],
        weakConcepts: [
            { id: 4, name: '평면도형의 성질', unit: '기본 도형', accuracy: 39, weakStudents: 9 },
            { id: 5, name: '일차방정식의 풀이', unit: '문자와 식', accuracy: 46, weakStudents: 7 },
            { id: 6, name: '자료의 정리와 해석', unit: '통계', accuracy: 53, weakStudents: 6 },
        ],
        activities: [
            { id: 5, title: '윤하준 학생이 종합평가를 제출했습니다.', time: '20분 전', icon: 'bi-file-earmark-check-fill', tone: 'blue', path: '/learning/results' },
            { id: 6, title: '채점 대기 중인 평가가 5건 있습니다.', time: '50분 전', icon: 'bi-exclamation-circle-fill', tone: 'orange', path: '/learning/results', emphasis: true },
            { id: 7, title: '도형 단원 문제지 생성이 완료됐습니다.', time: '2시간 전', icon: 'bi-stars', tone: 'purple', path: '/problems/library' },
            { id: 8, title: '송채원 학생이 오답 학습을 완료했습니다.', time: '어제', icon: 'bi-check-circle-fill', tone: 'green', path: '/learning/wrong-answers' },
        ],
        students: classTwoStudents,
    },
    all: {
        summaries: [
            { id: 'students', label: '학생 수', value: '46명', support: '오늘 학습 참여 33명' },
            { id: 'assignments', label: '출제한 문제 · 평가', value: '21개', support: '이번 달 신규 7개' },
            { id: 'pending', label: '채점 대기', value: '8건', support: '미제출 학생 2명 포함' },
            { id: 'accuracy', label: '전체 평균 정답률', value: '66%', support: '지난주보다 1.2%', trend: 'up' },
        ],
        weakConcepts: [
            { id: 9, name: '일차방정식의 활용', unit: '문자와 식', accuracy: 41, weakStudents: 15 },
            { id: 10, name: '평면도형의 성질', unit: '기본 도형', accuracy: 45, weakStudents: 13 },
            { id: 11, name: '정비례와 반비례', unit: '좌표평면과 그래프', accuracy: 50, weakStudents: 11 },
        ],
        activities: sharedActivities,
        students: [...classTwoStudents.slice(0, 3), ...classOneStudents.slice(0, 3)].sort((a, b) => a.accuracy - b.accuracy),
    },
};

export default dashboardData;
