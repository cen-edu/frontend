function TimeTimeline({ student }) {
    const max = Math.max(...student.responses.map((item) => item.seconds));
    return <section className="student-section"><div className="student-section__heading"><span>TIME</span><h2>시간 타임라인</h2></div><div className="time-timeline">{student.responses.map((response) => <div className="time-timeline__row" key={response.no}><span>{response.no}번</span><span className="time-timeline__track"><i style={{ width: `${response.seconds / max * 100}%` }} /><b style={{ left: '48%' }} title="학급 중앙값" /></span><strong>{Math.floor(response.seconds / 60)}:{String(response.seconds % 60).padStart(2, '0')}</strong></div>)}<p><i /> 학급 중앙값 기준선</p></div></section>;
}
export default TimeTimeline;
