import { Card, Col, ConfigProvider, Row, Statistic } from 'antd';

function DiagnosisSummaryCards({ metrics }) {
    const items = [
        ['참여 학생', metrics.responseCount, '명'],
        ['학급 정답률', metrics.average, '%'],
        ['힌트 사용', metrics.hintCount, '회'],
        ['집중 지도', metrics.priorityCount, '명'],
    ];

    return (
        <ConfigProvider theme={{ token: { fontFamily: 'Pretendard, sans-serif' } }}>
            <Row className="diagnosis-summary" gutter={[12, 12]} wrap={false}>
                {items.map(([label, value, suffix]) => (
                    <Col key={label} flex="1 1 0"><Card className="diagnosis-summary__card" variant="borderless">
                        <Statistic title={label} value={value} suffix={suffix} precision={typeof value === 'number' && !Number.isInteger(value) ? 1 : 0} />
                    </Card></Col>
                ))}
            </Row>
        </ConfigProvider>
    );
}
export default DiagnosisSummaryCards;
