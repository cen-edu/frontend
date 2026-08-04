export const dashboardFilterOptions = {
    years: [
        { value: '2026', label: '2026학년도' },
        { value: '2025', label: '2025학년도' },
    ],
    grades: [
        { value: 'middle-1', label: '1학년' },
    ],
    terms: [
        { value: 'first', label: '1학기' },
        { value: 'second', label: '2학기' },
    ],
    classes: [
        { value: 'middle-1-1', label: '1반' },
        { value: 'middle-1-2', label: '2반' },
    ],
    worksheets: [
        { value: 'linear-equation', label: '2단원 일차방정식 형성평가' },
        { value: 'coordinate-plane', label: '3단원 좌표평면 단원평가' },
    ],
};

const linearEquationStudents = [
    { id: 101, name: '김민서', score: 42, accuracy: 42, progress: 38, submittedAt: '오늘 09:12', status: 'graded', weakConcept: '일차방정식의 활용' },
    { id: 102, name: '박준호', score: 48, accuracy: 48, progress: 72, submittedAt: '오늘 09:25', status: 'graded', weakConcept: '등식의 성질' },
    { id: 103, name: '이서윤', score: 55, accuracy: 55, progress: 54, submittedAt: '어제 16:40', status: 'graded', weakConcept: '일차방정식의 풀이' },
    { id: 104, name: '최지우', score: 61, accuracy: 61, progress: 46, submittedAt: '오늘 10:08', status: 'graded', weakConcept: '일차방정식의 활용' },
    { id: 105, name: '정도윤', score: 66, accuracy: 66, progress: 68, submittedAt: '오늘 09:48', status: 'graded', weakConcept: '등식의 성질' },
    { id: 106, name: '한예린', score: 72, accuracy: 72, progress: 82, submittedAt: '어제 17:05', status: 'graded', weakConcept: '식의 계산' },
    { id: 107, name: '윤하준', score: 76, accuracy: 76, progress: 57, submittedAt: '오늘 10:17', status: 'graded', weakConcept: '식의 계산' },
    { id: 108, name: '오서아', score: 81, accuracy: 81, progress: 74, submittedAt: '오늘 09:31', status: 'graded', weakConcept: '등식의 성질' },
    { id: 109, name: '강시우', score: 86, accuracy: 86, progress: 88, submittedAt: '어제 15:22', status: 'graded', weakConcept: '일차방정식의 풀이' },
    { id: 110, name: '송채원', score: 92, accuracy: 92, progress: 96, submittedAt: '오늘 10:02', status: 'graded', weakConcept: '없음' },
    { id: 111, name: '임도현', score: 44, accuracy: 44, progress: 63, submittedAt: '오늘 09:18', status: 'graded', weakConcept: '일차방정식의 활용' },
    { id: 112, name: '백수빈', score: 53, accuracy: 53, progress: 84, submittedAt: '어제 16:18', status: 'graded', weakConcept: '등식의 성질' },
    { id: 113, name: '조현우', score: 59, accuracy: 59, progress: 51, submittedAt: '오늘 09:56', status: 'graded', weakConcept: '일차방정식의 풀이' },
    { id: 114, name: '신유진', score: 64, accuracy: 64, progress: 42, submittedAt: '오늘 10:21', status: 'graded', weakConcept: '일차방정식의 활용' },
    { id: 115, name: '문지호', score: 69, accuracy: 69, progress: 76, submittedAt: '어제 17:14', status: 'graded', weakConcept: '등식의 성질' },
    { id: 116, name: '안서진', score: 74, accuracy: 74, progress: 91, submittedAt: '오늘 09:43', status: 'graded', weakConcept: '식의 계산' },
    { id: 117, name: '유건우', score: 79, accuracy: 79, progress: 58, submittedAt: '오늘 10:11', status: 'graded', weakConcept: '일차방정식의 풀이' },
    { id: 118, name: '장하은', score: 88, accuracy: 88, progress: 85, submittedAt: '어제 16:52', status: 'graded', weakConcept: '없음' },
];

const linearEquation = {
    title: '2단원 일차방정식 형성평가',
    updatedAt: '오늘 오전 10:30 기준',
    summaries: [
        { id: 'submissions', label: '제출 현황', value: '18/24명', support: '미제출 학생 6명' },
        { id: 'score', label: '평균 점수', value: '72점', support: '지난 평가보다 3점 상승', trend: 'up' },
        { id: 'accuracy', label: '평균 정답률', value: '68%', support: '지난 평가보다 4%p 상승', trend: 'up' },
        { id: 'atRisk', label: '취약 학생 수', value: '6명', support: '맞춤 학습이 필요해요' },
    ],
    concepts: [
        { id: 'concept-1', label: '일차방정식의 활용', accuracy: 42, weakStudents: 8 },
        { id: 'concept-2', label: '등식의 성질', accuracy: 51, weakStudents: 6 },
        { id: 'concept-3', label: '일차방정식의 풀이', accuracy: 58, weakStudents: 5 },
        { id: 'concept-4', label: '식의 계산', accuracy: 76, weakStudents: 2 },
    ],
    questions: [
        { id: 'question-7', label: '7번 문항', accuracy: 38, weakStudents: 11 },
        { id: 'question-4', label: '4번 문항', accuracy: 46, weakStudents: 9 },
        { id: 'question-9', label: '9번 문항', accuracy: 54, weakStudents: 7 },
        { id: 'question-2', label: '2번 문항', accuracy: 71, weakStudents: 3 },
    ],
    submission: { submitted: 18, missing: 6, graded: 18, total: 24 },
    students: linearEquationStudents,
};

const coordinatePlane = {
    title: '3단원 좌표평면 단원평가',
    updatedAt: '어제 오후 5:00 기준',
    summaries: [
        { id: 'submissions', label: '제출 현황', value: '21/24명', support: '미제출 학생 3명' },
        { id: 'score', label: '평균 점수', value: '78점', support: '지난 평가보다 5점 상승', trend: 'up' },
        { id: 'accuracy', label: '평균 정답률', value: '74%', support: '지난 평가보다 6%p 상승', trend: 'up' },
        { id: 'atRisk', label: '취약 학생 수', value: '4명', support: '지난 평가보다 2명 감소' },
    ],
    concepts: [
        { id: 'concept-5', label: '정비례와 반비례', accuracy: 49, weakStudents: 7 },
        { id: 'concept-6', label: '좌표와 순서쌍', accuracy: 62, weakStudents: 4 },
        { id: 'concept-7', label: '그래프의 해석', accuracy: 69, weakStudents: 3 },
        { id: 'concept-8', label: '좌표평면', accuracy: 84, weakStudents: 1 },
    ],
    questions: [
        { id: 'question-6', label: '6번 문항', accuracy: 45, weakStudents: 8 },
        { id: 'question-8', label: '8번 문항', accuracy: 57, weakStudents: 6 },
        { id: 'question-3', label: '3번 문항', accuracy: 68, weakStudents: 4 },
        { id: 'question-1', label: '1번 문항', accuracy: 88, weakStudents: 1 },
    ],
    submission: { submitted: 21, missing: 3, graded: 19, total: 24 },
    students: linearEquationStudents.map((student, index) => ({
        ...student,
        score: Math.min(student.score + 6 + (index % 3), 100),
        accuracy: Math.min(student.accuracy + 6 + (index % 3), 100),
        weakConcept: index < 4 ? '정비례와 반비례' : index < 7 ? '그래프의 해석' : '없음',
    })),
};

export const dashboardWorksheets = {
    'linear-equation': linearEquation,
    'coordinate-plane': coordinatePlane,
};
