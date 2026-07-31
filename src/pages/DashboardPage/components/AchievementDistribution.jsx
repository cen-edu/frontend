import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CartesianGrid,
    ReferenceArea,
    ResponsiveContainer,
    Scatter,
    ScatterChart,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

const levelColors = {
    weak: '#eb665c',
    average: '#eeaa3f',
    good: '#30af77',
};

const getLevel = (accuracy) => accuracy < 60 ? 'weak' : accuracy < 80 ? 'average' : 'good';

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
            aria-label={`${payload.name}, 정답률 ${payload.accuracy}%, 개인 리포트 보기`}
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
            <b>{student.accuracy}%</b>
            <span>{student.score}점 · {student.weakConcept}</span>
        </div>
    );
}

function AchievementDistribution({ students }) {
    const navigate = useNavigate();
    const chartData = useMemo(() => students.map((student, index) => ({
        ...student,
        level: getLevel(student.accuracy),
        row: 0.9 + (index % 3) * 0.27,
    })), [students]);

    return (
        <section className="dashboard-section dashboard-section--distribution" aria-labelledby="achievement-title">
            <div className="dashboard-section__header">
                <div>
                    <span className="dashboard-section__kicker">학생 분포</span>
                    <h2 id="achievement-title">학생 성취 분포</h2>
                    <p>점 하나는 학생 한 명을 의미해요.</p>
                </div>
            </div>

            <div className="achievement-chart" role="group" aria-label="학생별 정답률 점 분포 그래프">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 16, right: 12, bottom: 12, left: 12 }}>
                        <CartesianGrid horizontal={false} stroke="#e5eaf0" strokeDasharray="3 4" />
                        <ReferenceArea x1={0} x2={60} y1={0.65} y2={1.65} fill="#eb665c" fillOpacity={0.07} stroke="none" />
                        <ReferenceArea x1={60} x2={80} y1={0.65} y2={1.65} fill="#eeaa3f" fillOpacity={0.08} stroke="none" />
                        <ReferenceArea x1={80} x2={100} y1={0.65} y2={1.65} fill="#30af77" fillOpacity={0.08} stroke="none" />
                        <XAxis
                            type="number"
                            dataKey="accuracy"
                            domain={[0, 100]}
                            ticks={[0, 20, 40, 60, 80, 100]}
                            tickFormatter={(value) => `${value}%`}
                            tick={{ fill: '#929dab', fontSize: 9 }}
                            tickLine={false}
                            axisLine={{ stroke: '#cfd7df' }}
                        />
                        <YAxis type="number" dataKey="row" domain={[0.65, 1.65]} hide />
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
                <span><i className="achievement-chart__legend-dot achievement-chart__legend-dot--weak" />취약 60% 미만</span>
                <span><i className="achievement-chart__legend-dot achievement-chart__legend-dot--average" />보통 60~79%</span>
                <span><i className="achievement-chart__legend-dot achievement-chart__legend-dot--good" />양호 80% 이상</span>
            </div>
        </section>
    );
}

export default AchievementDistribution;
