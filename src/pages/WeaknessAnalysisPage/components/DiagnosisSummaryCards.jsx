import { Card, Col, ConfigProvider, Row, Statistic } from 'antd';

function DiagnosisSummaryCards({ worksheet, metrics }) {
    const items = worksheet.type === 'assessment'
        ? [
            ['응답 학생', metrics.responseCount, '명'], ['평균 득점률', metrics.average, '%'],
            ['평균 소요 시간', Math.round(metrics.averageSeconds / 60), '분'], ['힌트 사용', metrics.hintStudents, '명'], ['우선 지도', metrics.priorityCount, '명'],
        ]
        : [
            ['응답 학생', metrics.responseCount, '명'], ['평균 득점률', metrics.average, '%'],
            ['최다 취약', '공통소인수', ''], ['우선 지도', metrics.priorityCount, '명'],
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
