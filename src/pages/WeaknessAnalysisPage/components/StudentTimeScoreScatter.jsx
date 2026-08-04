import { CartesianGrid, LabelList, ReferenceArea, ReferenceLine, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from 'recharts';
import { getStudentMetrics, statusLabels } from '../../../mocks/weaknessAnalysis';

const statusColors = { priority: '#a96762', review: '#a58a55', stable: '#4f806b', insufficient: '#9aa4b1' };

function median(values) {
    if (!values.length) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[middle] : Math.round((sorted[middle - 1] + sorted[middle]) / 2 * 10) / 10;
}

function StudentTooltip({ active, payload }) {
    if (!active || !payload?.length) return null;
    const point = payload[0].payload;
    return <div className="student-scatter__tooltip">
        <strong>{point.name}</strong>
        <span className={`status-badge status-badge--${point.status}`}>{statusLabels[point.status]}</span>
        <dl>
            <div><dt>득점률</dt><dd>{point.scoreRate}%</dd></div>
            <div><dt>소요 시간</dt><dd>{point.minutes}분</dd></div>
            <div><dt>힌트</dt><dd>{point.hints}회</dd></div>
        </dl>
    </div>;
}

function StudentTimeScoreScatter({ worksheet, onSelectStudent }) {
    const points = worksheet.students.map((student) => {
        const metrics = getStudentMetrics(student);
        return {
            id: student.id,
            name: student.name,
            status: student.status,
            minutes: Math.round(metrics.seconds / 60 * 10) / 10,
            scoreRate: metrics.scoreRate,
            hints: metrics.hints,
        };
    });
    const reliable = points.filter((point) => point.status !== 'insufficient');
    const middleMinutes = median(reliable.map((point) => point.minutes));
    const middleRate = median(reliable.map((point) => point.scoreRate));
    const minutes = points.map((point) => point.minutes);
    const from = Math.max(0, Math.floor(Math.min(...minutes)) - 2);
    const to = Math.ceil(Math.max(...minutes)) + 2;
    const summary = points.map((point) => `${point.name} ${point.minutes}분 ${point.scoreRate}%`).join(', ');
    const corners = [
        { key: 'mastered', label: '빠르고 정확', x1: from, x2: middleMinutes, y1: middleRate, y2: 100, position: 'insideTopLeft' },
        { key: 'uncertain', label: '풀었지만 오래 걸림', x1: middleMinutes, x2: to, y1: middleRate, y2: 100, position: 'insideTopRight' },
        { key: 'giveup', label: '빨리 포기', x1: from, x2: middleMinutes, y1: 0, y2: middleRate, position: 'insideBottomLeft' },
        { key: 'struggle', label: '붙잡고 실패', x1: middleMinutes, x2: to, y1: 0, y2: middleRate, position: 'insideBottomRight' },
    ];

    const dot = (props) => {
        const { cx, cy, payload } = props;
        const color = statusColors[payload.status];
        return <circle
            cx={cx}
            cy={cy}
            r={7}
            fill={color}
            fillOpacity={.85}
            stroke={color}
            className="student-scatter__dot"
            onClick={() => onSelectStudent(payload.id)}
        />;
    };

    return <section className="diagnosis-card student-scatter">
        <div className="diagnosis-card__heading">
            <div><span>학생 분포</span><h2>소요 시간 × 득점률</h2></div>
            <small>점을 선택하면 학생 분석으로 이동합니다</small>
        </div>
        <div className="student-scatter__chart" role="img" aria-label={`학생별 소요 시간과 득점률 분포도. ${summary}`}>
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 22, right: 26, bottom: 18, left: 6 }}>
                    <CartesianGrid stroke="#eef0f3" />
                    <XAxis type="number" dataKey="minutes" domain={[from, to]} tickFormatter={(value) => `${value}분`} tick={{ fill: '#8a94a1', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#dde2e8' }} />
                    <YAxis type="number" dataKey="scoreRate" domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickFormatter={(value) => `${value}%`} tick={{ fill: '#8a94a1', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#dde2e8' }} width={44} />
                    {corners.map((corner) => <ReferenceArea key={corner.key} x1={corner.x1} x2={corner.x2} y1={corner.y1} y2={corner.y2} fill="none" fillOpacity={0} stroke="none" label={{ value: corner.label, position: corner.position, fill: '#a4adb8', fontSize: 11 }} />)}
                    <ReferenceLine x={middleMinutes} stroke="#c3cad2" strokeDasharray="4 4" label={{ value: `중앙값 ${middleMinutes}분`, position: 'top', fill: '#8a94a1', fontSize: 11 }} />
                    <ReferenceLine y={middleRate} stroke="#c3cad2" strokeDasharray="4 4" label={{ value: `중앙값 ${middleRate}%`, position: 'right', fill: '#8a94a1', fontSize: 11 }} />
                    <Tooltip content={<StudentTooltip />} cursor={{ stroke: '#dde2e8', strokeDasharray: '3 3' }} />
                    <Scatter data={points} shape={dot} isAnimationActive={false}>
                        <LabelList dataKey="name" position="top" offset={10} fill="#596579" fontSize={11} />
                    </Scatter>
                </ScatterChart>
            </ResponsiveContainer>
        </div>
        <div className="student-scatter__legend">
            <span><i className="student-scatter__key student-scatter__key--priority" /> 집중 지도</span>
            <span><i className="student-scatter__key student-scatter__key--review" /> 다시 확인</span>
            <span><i className="student-scatter__key student-scatter__key--stable" /> 안정</span>
            <span><i className="student-scatter__key student-scatter__key--insufficient" /> 자료 부족</span>
        </div>
        <p className="student-scatter__note">기준선은 자료 부족 학생을 제외한 학급 중앙값이며, 채점 대기 문항은 두 축 모두에서 제외했습니다.</p>
    </section>;
}

export default StudentTimeScoreScatter;
