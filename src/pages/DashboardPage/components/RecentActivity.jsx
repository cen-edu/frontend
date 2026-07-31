import { Link } from 'react-router-dom';

function RecentActivity({ activities }) {
    return (
        <section className="dashboard-panel dashboard-panel--activity" aria-labelledby="recent-activity-title">
            <div className="dashboard-panel__header">
                <div>
                    <h2 id="recent-activity-title">최근 활동</h2>
                    <p>반에서 일어난 주요 소식이에요.</p>
                </div>
            </div>

            <ul className="activity-list">
                {activities.map((activity) => (
                    <li key={activity.id}>
                        <Link to={activity.path} className={`activity-list__item${activity.emphasis ? ' activity-list__item--emphasis' : ''}`}>
                            <span className={`activity-list__icon activity-list__icon--${activity.tone}`} aria-hidden="true">
                                <i className={`bi ${activity.icon}`} />
                            </span>
                            <span className="activity-list__content">
                                <strong>{activity.title}</strong>
                                <span>{activity.time}</span>
                            </span>
                            <i className="bi bi-chevron-right activity-list__arrow" aria-hidden="true" />
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default RecentActivity;
