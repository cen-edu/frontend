import { Card, Col, ConfigProvider, Row, Statistic } from 'antd';

const cardStyles = {
    submissions: { icon: 'bi-send-check-fill', tone: 'mint', valueLabel: '제출한 학생' },
    score: { icon: 'bi-award-fill', tone: 'purple', valueLabel: '반 평균' },
    accuracy: { icon: 'bi-graph-up-arrow', tone: 'orange', valueLabel: '전체 문항 기준' },
    atRisk: { icon: 'bi-person-exclamation', tone: 'pink', valueLabel: '정답률 60% 미만' },
};

function DashboardSummaryCards({ summaries }) {
    return (
        <ConfigProvider theme={{ token: { fontFamily: 'Pretendard, sans-serif' } }}>
            <section aria-label="반 학습 요약">
                <Row className="dashboard-page__summary-row" gutter={[18, 18]}>
                    {summaries.map((summary, index) => {
                        const style = cardStyles[summary.id];
                        const [, value = '0', suffix = ''] = summary.value.match(/^([\d.]+)(.*)$/) ?? [];

                        return (
                            <Col key={summary.id} xs={24} sm={12} xl={6}>
                                <Card className={`summary-card summary-card--${style.tone}`} variant="borderless">
                                    <div className="summary-card__top">
                                        <span className="summary-card__label">
                                            <span className="summary-card__icon" aria-hidden="true"><i className={`bi ${style.icon}`} /></span>
                                            {summary.label}
                                        </span>
                                        <span className="summary-card__index">0{index + 1}</span>
                                    </div>

                                    <Statistic
                                        title={style.valueLabel}
                                        value={Number(value)}
                                        suffix={suffix}
                                        precision={value.includes('.') ? 1 : 0}
                                    />

                                    <p className={`summary-card__support${summary.trend ? ` summary-card__support--${summary.trend}` : ''}`}>
                                        {summary.trend && <i className={`bi bi-caret-${summary.trend === 'up' ? 'up' : 'down'}-fill`} aria-hidden="true" />}
                                        {summary.support}
                                    </p>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            </section>
        </ConfigProvider>
    );
}

export default DashboardSummaryCards;
