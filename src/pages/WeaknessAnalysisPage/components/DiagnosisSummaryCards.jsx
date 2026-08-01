import { Card, Col, ConfigProvider, Row, Statistic } from 'antd';

function DiagnosisSummaryCards({ worksheet, metrics }) {
    const items = worksheet.type === 'assessment'
        ? [
            ['응답 학생', metrics.responseCount, '명', 'bi-people'], ['평균 득점률', metrics.average, '%', 'bi-graph-up'],
            ['평균 소요 시간', Math.round(metrics.averageSeconds / 60), '분', 'bi-clock'], ['힌트 사용', metrics.hintStudents, '명', 'bi-lightbulb'], ['우선 지도', metrics.priorityCount, '명', 'bi-flag'],
        ]
        : [
            ['응답 학생', metrics.responseCount, '명', 'bi-people'], ['평균 득점률', metrics.average, '%', 'bi-graph-up'],
            ['최다 취약', '공통소인수', '', 'bi-exclamation-diamond'], ['우선 지도', metrics.priorityCount, '명', 'bi-flag'],
        ];

    return (
        <ConfigProvider theme={{ token: { fontFamily: 'Pretendard, sans-serif' } }}>
            <Row className="diagnosis-summary" gutter={[12, 12]} wrap={false}>
                {items.map(([label, value, suffix, icon]) => (
                    <Col key={label} flex="1 1 0"><Card className="diagnosis-summary__card" variant="borderless">
                        <span className="diagnosis-summary__icon" aria-hidden="true"><i className={`bi ${icon}`} /></span>
                        <Statistic title={label} value={value} suffix={suffix} precision={typeof value === 'number' && !Number.isInteger(value) ? 1 : 0} />
                    </Card></Col>
                ))}
            </Row>
        </ConfigProvider>
    );
}
export default DiagnosisSummaryCards;
