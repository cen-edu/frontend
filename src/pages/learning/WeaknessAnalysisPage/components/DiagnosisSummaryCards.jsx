import { Card, Col, ConfigProvider, Row, Statistic } from 'antd';
import { formatAnalysisDuration } from '../analysisAdapters.js';

function DiagnosisSummaryCards({ worksheetType, summary }) {
    const isAssessment = worksheetType === 'assessment';
    const hasValue = (value) => value !== null && value !== undefined;
    const items = [
        { label: '참여 학생', value: summary.participantCount ?? '-', suffix: hasValue(summary.participantCount) ? '명' : '' },
        { label: '학급 성취율', value: summary.classPerformanceRate ?? '-', suffix: hasValue(summary.classPerformanceRate) ? '%' : '' },
        isAssessment
            ? { label: '평균 소요 시간', value: formatAnalysisDuration(summary.averageSolvingDurationMs), suffix: '' }
            : { label: '취약 소분류', value: summary.weaknessSubcategoryCount ?? '-', suffix: hasValue(summary.weaknessSubcategoryCount) ? '개' : '' },
        { label: '취약 학생', value: summary.weaknessStudentCount ?? '-', suffix: hasValue(summary.weaknessStudentCount) ? '명' : '' },
    ];

    return (
        <ConfigProvider theme={{ token: { fontFamily: 'Pretendard, sans-serif' } }}>
            <Row className="diagnosis-summary" gutter={[12, 12]} wrap={false}>
                {items.map(({ label, value, suffix }) => (
                    <Col key={label} flex="1 1 0"><Card className="diagnosis-summary__card" variant="borderless">
                        <Statistic title={label} value={value} suffix={suffix} precision={typeof value === 'number' && !Number.isInteger(value) ? 1 : 0} />
                    </Card></Col>
                ))}
            </Row>
        </ConfigProvider>
    );
}
export default DiagnosisSummaryCards;
