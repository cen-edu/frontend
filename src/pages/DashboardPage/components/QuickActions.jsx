import { Link } from 'react-router-dom';

const actions = [
    { label: '문제 만들기', description: '단원별 문제 생성', path: '/problems', icon: 'bi-pencil-square', tone: 'blue' },
    { label: '종합평가 생성', description: '여러 단원으로 평가 구성', path: '/problems/comprehensive', icon: 'bi-clipboard2-check', tone: 'purple' },
    { label: '학생 등록', description: '새로운 학생 추가', path: '/students', icon: 'bi-person-plus', tone: 'green' },
];

function QuickActions() {
    return (
        <section className="dashboard-panel dashboard-panel--quick" aria-labelledby="quick-actions-title">
            <div className="dashboard-panel__header">
                <div>
                    <h2 id="quick-actions-title">빠른 작업</h2>
                    <p>자주 쓰는 메뉴로 바로 이동하세요.</p>
                </div>
            </div>

            <div className="quick-actions">
                {actions.map((action) => (
                    <Link key={action.label} to={action.path} className="quick-actions__item">
                        <span className={`quick-actions__icon quick-actions__icon--${action.tone}`} aria-hidden="true"><i className={`bi ${action.icon}`} /></span>
                        <span className="quick-actions__content"><strong>{action.label}</strong><small>{action.description}</small></span>
                        <i className="bi bi-chevron-right quick-actions__arrow" aria-hidden="true" />
                    </Link>
                ))}
            </div>
        </section>
    );
}

export default QuickActions;
