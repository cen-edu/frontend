import { Card, Col, ConfigProvider, Row, Statistic } from 'antd';

const cardStyles = {
    submissions: { valueLabel: '제출한 학생' },
    score: { valueLabel: '반 평균' },
    accuracy: { valueLabel: '전체 문항 기준' },
    atRisk: { valueLabel: '정답률 60% 미만', attention: true },
};

function DashboardSummaryCards({ summaries }) {
    return (
        <ConfigProvider theme={{ token: { fontFamily: 'Pretendard, sans-serif' } }}>
            <section aria-label="반 학습 요약">
                <Row className="dashboard-page__summary-row" gutter={[18, 18]}>
                    {summaries.map((summary) => {
                        const style = cardStyles[summary.id];
                        const [, value = '0', suffix = ''] = summary.value.match(/^([\d.]+)(.*)$/) ?? [];

                        return (
                            <Col key={summary.id} xs={24} sm={12} xl={6}>
                                <Card className={`summary-card${style.attention ? ' summary-card--attention' : ''}`}>
                                    <span className="summary-card__label">{summary.label}</span>

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
