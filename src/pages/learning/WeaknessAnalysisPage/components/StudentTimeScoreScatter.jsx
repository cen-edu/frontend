import { CartesianGrid, LabelList, ReferenceLine, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from 'recharts';
import { statusLabels } from '../../../../mocks/weaknessAnalysis';
import { adaptScoreTimeDistribution, formatAnalysisDuration } from '../analysisAdapters.js';

const statusColors = { priority: '#a96762', review: '#a58a55', stable: '#4f806b', insufficient: '#9aa4b1' };

function StudentTooltip({ active, payload }) {
    if (!active || !payload?.length) return null;
    const point = payload[0].payload;
    return <div className="student-scatter__tooltip">
        <strong>{point.name}</strong>
        <span className={`status-badge status-badge--${point.status}`}>{statusLabels[point.status]}</span>
        <dl>
            <div><dt>득점률</dt><dd>{point.scoreRate}%</dd></div>
            <div><dt>소요 시간</dt><dd>{formatAnalysisDuration(point.totalSolvingDurationMs)}</dd></div>
        </dl>
    </div>;
}

function StudentTimeScoreScatter({ distribution, onSelectStudent }) {
    const { points, insufficientStudents, medianScoreRate, medianSolvingDurationMs } = adaptScoreTimeDistribution(distribution);
    const summary = points.map((point) => `${point.name} ${formatAnalysisDuration(point.totalSolvingDurationMs)} ${point.scoreRate}%`).join(', ');

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
        {points.length ? <div className="student-scatter__chart" role="img" aria-label={`학생별 소요 시간과 득점률 분포도. ${summary}`}>
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 22, right: 26, bottom: 18, left: 6 }}>
                    <CartesianGrid stroke="#eef0f3" />
                    <XAxis type="number" dataKey="totalSolvingDurationMs" domain={[0, 'auto']} tickFormatter={formatAnalysisDuration} tick={{ fill: '#8a94a1', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#dde2e8' }} />
                    <YAxis type="number" dataKey="scoreRate" domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickFormatter={(value) => `${value}%`} tick={{ fill: '#8a94a1', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#dde2e8' }} width={44} />
                    {medianSolvingDurationMs !== null && <ReferenceLine x={medianSolvingDurationMs} stroke="#c3cad2" strokeDasharray="4 4" label={{ value: `중앙값 ${formatAnalysisDuration(medianSolvingDurationMs)}`, position: 'top', fill: '#8a94a1', fontSize: 11 }} />}
                    {medianScoreRate !== null && <ReferenceLine y={medianScoreRate} stroke="#c3cad2" strokeDasharray="4 4" label={{ value: `중앙값 ${medianScoreRate}%`, position: 'right', fill: '#8a94a1', fontSize: 11 }} />}
                    <Tooltip content={<StudentTooltip />} cursor={{ stroke: '#dde2e8', strokeDasharray: '3 3' }} />
                    <Scatter data={points} shape={dot} isAnimationActive={false}>
                        <LabelList dataKey="name" position="top" offset={10} fill="#596579" fontSize={11} />
                    </Scatter>
                </ScatterChart>
            </ResponsiveContainer>
        </div> : <p className="student-scatter__empty">산점도에 표시할 득점률·풀이 시간 데이터가 없습니다.</p>}
        <div className="student-scatter__legend">
            <span><i className="student-scatter__key student-scatter__key--priority" /> 집중 지도</span>
            <span><i className="student-scatter__key student-scatter__key--review" /> 다시 확인</span>
            <span><i className="student-scatter__key student-scatter__key--stable" /> 안정</span>
            <span><i className="student-scatter__key student-scatter__key--insufficient" /> 자료 부족</span>
        </div>
        <p className="student-scatter__note">기준선은 유효 데이터의 학급 중앙값입니다.{insufficientStudents.length ? ` 득점률 또는 풀이 시간이 없는 ${insufficientStudents.length}명은 산점도에서 제외했습니다.` : ''}</p>
    </section>;
}

export default StudentTimeScoreScatter;
