import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from 'recharts';

function DifficultyRadar({ items, comparisonItems }) {
    const data = items.map((item) => ({ ...item, studentRate: item.rate, classRate: comparisonItems.find((value) => value.key === item.key)?.rate ?? 0 }));
    const summary = data.map((item) => `${item.label} 난이도 ${item.questionCount}문항, 학생 ${item.studentRate}%, 학급 ${item.classRate}%`).join(', ');

    return (
        <section className="diagnosis-card difficulty-radar">
            <div className="diagnosis-card__heading"><div><span>문항 난이도 기준</span><h2>난이도별 학생 vs 학급</h2></div></div>
            <div className="difficulty-radar__chart" role="img" aria-label={`난이도별 정답률 비교 그래프. ${summary}`}>
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={data} outerRadius="70%" margin={{ top: 10, right: 10, bottom: 6, left: 10 }}>
                        <PolarGrid stroke="#e0e5ea" />
                        <PolarAngleAxis dataKey="label" tick={{ fill: '#596579', fontSize: 12 }} />
                        <PolarRadiusAxis domain={[0, 100]} tickCount={5} tick={false} axisLine={false} />
                        <Radar name="학급" dataKey="classRate" stroke="#8da2b5" strokeDasharray="4 3" fill="#8da2b5" fillOpacity={0.12} isAnimationActive={false} />
                        <Radar name="학생" dataKey="studentRate" stroke="#4f806b" fill="#4f806b" fillOpacity={0.22} isAnimationActive={false} />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
            <ul className="difficulty-radar__values">
                {data.map((item) => <li key={item.key}><span>{item.label} · {item.questionCount}문항{item.questionCount < 2 ? ' · 참고용' : ''}</span><strong>{item.studentRate}%</strong><small>학급 {item.classRate}%</small></li>)}
            </ul>
            <div className="analysis-legend"><span><i /> 학생</span><span><i /> 학급</span></div>
        </section>
    );
}

export default DifficultyRadar;
