import { Card, Col, ConfigProvider, Row, Statistic } from 'antd';

function DashboardSummaryCards({ summaries }) {
    return (
        <ConfigProvider theme={{ token: { fontFamily: 'Pretendard, sans-serif' } }}>
            <section aria-label="학기 학습 요약">
                <Row className="dashboard-page__summary-row" gutter={[18, 18]}>
                    {summaries.map((summary) => {
                        const [, value, suffix = ''] = summary.value.match(/^([\d.]+)(.*)$/) ?? [];

                        return (
                            <Col key={summary.id} xs={24} sm={12} xl={6}>
                                <Card className="summary-card">
                                    <span className="summary-card__label">{summary.label}</span>

                                    {value
                                        ? <Statistic title={summary.valueLabel} value={Number(value)} suffix={suffix} precision={value.includes('.') ? 1 : 0} />
                                        : <div className="summary-card__empty"><span>{summary.valueLabel}</span><strong>{summary.value}</strong></div>}

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
