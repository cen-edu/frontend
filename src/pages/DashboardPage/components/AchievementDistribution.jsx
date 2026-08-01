import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CartesianGrid,
    ReferenceArea,
    ReferenceLine,
    ResponsiveContainer,
    Scatter,
    ScatterChart,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

const levelColors = {
    priority: '#eb665c',
    reinforce: '#eeaa3f',
    encourage: '#4f9fe5',
    good: '#30af77',
};

const getLevel = (progress, accuracy) => {
    if (progress < 60 && accuracy < 60) return 'priority';
    if (progress >= 60 && accuracy < 60) return 'reinforce';
    if (progress < 60 && accuracy >= 60) return 'encourage';
    return 'good';
};

function StudentPoint({ cx, cy, payload, onOpenReport }) {
    if (typeof cx !== 'number' || typeof cy !== 'number' || !payload) return null;

    const openReport = () => onOpenReport(payload.id);

    return (
        <circle
            cx={cx}
            cy={cy}
            r={6}
            className="achievement-chart__point"
            fill={levelColors[payload.level]}
            stroke="#ffffff"
            strokeWidth="2"
            tabIndex={0}
            role="link"
            aria-label={`${payload.name}, 진행률 ${payload.progress}%, 정답률 ${payload.accuracy}%, 개인 리포트 보기`}
            onClick={openReport}
            onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openReport();
                }
            }}
        />
    );
}

function StudentTooltip({ active, payload }) {
    const student = payload?.[0]?.payload;
    if (!active || !student) return null;

    return (
        <div className="achievement-chart__tooltip">
            <strong>{student.name}</strong>
            <b>진행률 {student.progress}% · 정답률 {student.accuracy}%</b>
            <span>{student.score}점 · {student.weakConcept}</span>
        </div>
    );
}

function AchievementDistribution({ students }) {
    const navigate = useNavigate();
    const chartData = useMemo(() => students.map((student) => ({
        ...student,
        level: getLevel(student.progress, student.accuracy),
    })), [students]);

    return (
        <section className="dashboard-section dashboard-section--distribution" aria-labelledby="achievement-title">
            <div className="dashboard-section__header">
                <div>
                    <h2 id="achievement-title">학생 성취 분포</h2>
                    <p>가로축은 단원 진행률, 세로축은 정답률입니다. 점을 선택하면 개인 리포트로 이동합니다.</p>
                </div>
            </div>

            <div className="achievement-chart" role="group" aria-label="학생별 정답률 점 분포 그래프">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 12, right: 10, bottom: 25, left: 0 }}>
                        <CartesianGrid stroke="#e5eaf0" strokeDasharray="3 4" />
                        <ReferenceArea x1={0} x2={60} y1={0} y2={60} fill="#eb665c" fillOpacity={0.07} stroke="none" />
                        <ReferenceArea x1={60} x2={100} y1={0} y2={60} fill="#eeaa3f" fillOpacity={0.08} stroke="none" />
                        <ReferenceArea x1={0} x2={60} y1={60} y2={100} fill="#4f9fe5" fillOpacity={0.07} stroke="none" />
                        <ReferenceArea x1={60} x2={100} y1={60} y2={100} fill="#30af77" fillOpacity={0.08} stroke="none" />
                        <ReferenceLine x={60} stroke="#b9c3cd" strokeDasharray="4 4" />
                        <ReferenceLine y={60} stroke="#b9c3cd" strokeDasharray="4 4" />
                        <XAxis
                            type="number"
                            dataKey="progress"
                            domain={[0, 100]}
                            ticks={[0, 20, 40, 60, 80, 100]}
                            tickFormatter={(value) => `${value}%`}
                            tick={{ fill: '#929dab', fontSize: 9 }}
                            tickLine={false}
                            axisLine={{ stroke: '#cfd7df' }}
                            label={{ value: '진행률', position: 'insideBottom', offset: -18, fill: '#7f8b99', fontSize: 9 }}
                        />
                        <YAxis
                            type="number"
                            dataKey="accuracy"
                            domain={[0, 100]}
                            ticks={[0, 20, 40, 60, 80, 100]}
                            tickFormatter={(value) => `${value}%`}
                            tick={{ fill: '#929dab', fontSize: 9 }}
                            tickLine={false}
                            axisLine={{ stroke: '#cfd7df' }}
                            width={31}
                            label={{ value: '정답률', angle: -90, position: 'insideLeft', fill: '#7f8b99', fontSize: 9 }}
                        />
                        <Tooltip content={<StudentTooltip />} cursor={false} />
                        <Scatter
                            data={chartData}
                            isAnimationActive={false}
                            shape={(props) => <StudentPoint {...props} onOpenReport={(studentId) => navigate(`/students/reports?student=${studentId}`)} />}
                        />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>

            <div className="achievement-chart__legend">
                <span><i className="achievement-chart__legend-dot achievement-chart__legend-dot--priority" />우선 관리</span>
                <span><i className="achievement-chart__legend-dot achievement-chart__legend-dot--reinforce" />정답 보완</span>
                <span><i className="achievement-chart__legend-dot achievement-chart__legend-dot--encourage" />진행 독려</span>
                <span><i className="achievement-chart__legend-dot achievement-chart__legend-dot--good" />양호</span>
            </div>
        </section>
    );
}

export default AchievementDistribution;
