import { useMemo } from 'react';
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
import { weakAccuracyThreshold } from '../../../mocks/teacherDashboard';

const levelColors = {
    priority: '#eb665c',
    reinforce: '#eeaa3f',
    encourage: '#4f9fe5',
    good: '#30af77',
};

const getLevel = (participation, accuracy) => {
    if (participation < 80 && accuracy < weakAccuracyThreshold) return 'priority';
    if (participation >= 80 && accuracy < weakAccuracyThreshold) return 'reinforce';
    if (participation < 80 && accuracy >= weakAccuracyThreshold) return 'encourage';
    return 'good';
};

function StudentPoint({ cx, cy, payload }) {
    if (typeof cx !== 'number' || typeof cy !== 'number' || !payload) return null;

    return (
        <circle
            cx={cx}
            cy={cy}
            r={6}
            className="achievement-chart__point"
            fill={levelColors[payload.level]}
            stroke="#ffffff"
            strokeWidth="2"
            role="img"
            aria-label={`${payload.name}, 참여율 ${payload.participation}%, 누적 정답률 ${payload.accuracy}%`}
        />
    );
}

function StudentTooltip({ active, payload }) {
    const student = payload?.[0]?.payload;
    if (!active || !student) return null;

    return (
        <div className="achievement-chart__tooltip">
            <strong>{student.name}</strong>
            <b>참여율 {student.participation}% · 누적 정답률 {student.accuracy}%</b>
            <span>제출 {student.submittedCount}/{student.assignedCount} · {student.weakConcept?.label ?? '취약 개념 없음'}</span>
        </div>
    );
}

function AchievementDistribution({ students }) {
    const chartData = useMemo(() => students
        .filter((student) => student.accuracy !== null)
        .map((student) => ({ ...student, level: getLevel(student.participation, student.accuracy) })), [students]);
    const excluded = students.length - chartData.length;

    return (
        <section className="dashboard-section" aria-labelledby="achievement-title">
            <div className="dashboard-section__header">
                <div>
                    <h2 id="achievement-title">학생 성취 분포</h2>
                    <p>가로축은 학기 학습 참여율, 세로축은 누적 정답률입니다.{chartData.length > 0 && excluded > 0 && ` 채점 자료가 없는 ${excluded}명은 제외했습니다.`}</p>
                </div>
            </div>

            {chartData.length === 0
                ? <p className="dashboard-empty">분포를 그릴 만큼 채점된 응답이 없습니다.</p>
                : <>
                    <div className="achievement-chart" role="group" aria-label="학생별 참여율과 누적 정답률 분포 그래프">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 12, right: 10, bottom: 25, left: 0 }}>
                                <CartesianGrid stroke="#e5eaf0" strokeDasharray="3 4" />
                                <ReferenceArea x1={0} x2={80} y1={0} y2={weakAccuracyThreshold} fill="#eb665c" fillOpacity={0.07} stroke="none" />
                                <ReferenceArea x1={80} x2={100} y1={0} y2={weakAccuracyThreshold} fill="#eeaa3f" fillOpacity={0.08} stroke="none" />
                                <ReferenceArea x1={0} x2={80} y1={weakAccuracyThreshold} y2={100} fill="#4f9fe5" fillOpacity={0.07} stroke="none" />
                                <ReferenceArea x1={80} x2={100} y1={weakAccuracyThreshold} y2={100} fill="#30af77" fillOpacity={0.08} stroke="none" />
                                <ReferenceLine x={80} stroke="#b9c3cd" strokeDasharray="4 4" />
                                <ReferenceLine y={weakAccuracyThreshold} stroke="#b9c3cd" strokeDasharray="4 4" />
                                <XAxis
                                    type="number"
                                    dataKey="participation"
                                    domain={[0, 100]}
                                    ticks={[0, 20, 40, 60, 80, 100]}
                                    tickFormatter={(value) => `${value}%`}
                                    tick={{ fill: '#929dab', fontSize: 9 }}
                                    tickLine={false}
                                    axisLine={{ stroke: '#cfd7df' }}
                                    label={{ value: '참여율', position: 'insideBottom', offset: -18, fill: '#7f8b99', fontSize: 9 }}
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
                                <Scatter data={chartData} isAnimationActive={false} shape={(props) => <StudentPoint {...props} />} />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="achievement-chart__legend">
                        <span><i className="achievement-chart__legend-dot achievement-chart__legend-dot--priority" />우선 관리</span>
                        <span><i className="achievement-chart__legend-dot achievement-chart__legend-dot--reinforce" />정답 보완</span>
                        <span><i className="achievement-chart__legend-dot achievement-chart__legend-dot--encourage" />참여 독려</span>
                        <span><i className="achievement-chart__legend-dot achievement-chart__legend-dot--good" />양호</span>
                    </div>
                </>}
        </section>
    );
}

export default AchievementDistribution;
