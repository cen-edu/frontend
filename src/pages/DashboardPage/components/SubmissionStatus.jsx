import { useNavigate } from 'react-router-dom';

function SubmissionStatus({ submission }) {
    const navigate = useNavigate();
    const submittedPercent = Math.round((submission.submitted / submission.total) * 100);
    const gradedPercent = Math.round((submission.graded / submission.total) * 100);

    const rows = [
        { id: 'submitted', label: '제출 완료', value: submission.submitted, percent: submittedPercent, tone: 'blue' },
        { id: 'missing', label: '미제출', value: submission.missing, percent: Math.round((submission.missing / submission.total) * 100), tone: 'gray' },
        { id: 'graded', label: '채점 완료', value: submission.graded, percent: gradedPercent, tone: 'green' },
    ];

    return (
        <section className="dashboard-section dashboard-section--submission" aria-labelledby="submission-title">
            <div className="dashboard-section__header">
                <div>
                    <span className="dashboard-section__kicker">진행 상태</span>
                    <h2 id="submission-title">제출·채점 현황</h2>
                    <p>전체 {submission.total}명 기준이에요.</p>
                </div>
                <span className="submission-status__rate">{submittedPercent}%</span>
            </div>

            <div className="submission-status">
                {rows.map((row) => (
                    <div key={row.id} className="submission-status__row">
                        <div className="submission-status__label"><span>{row.label}</span><strong>{row.value}<small>명</small></strong></div>
                        <div className="submission-status__track"><span className={`submission-status__bar submission-status__bar--${row.tone}`} style={{ width: `${row.percent}%` }} /></div>
                    </div>
                ))}
            </div>

            <button type="button" className="submission-status__button" onClick={() => navigate('/learning')}>
                미제출 학생 보기 <i className="bi bi-arrow-right" aria-hidden="true" />
            </button>
        </section>
    );
}

export default SubmissionStatus;
