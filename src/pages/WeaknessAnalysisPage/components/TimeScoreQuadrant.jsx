function TimeScoreQuadrant({ onSelect }) {
    const areas = [['붙잡고 실패', 'struggle'], ['풀었지만 불안', 'uncertain'], ['찍음·포기', 'giveup'], ['숙달', 'mastered']];
    return <div className="quadrant"><span className="quadrant__axis quadrant__axis--top">느림 ↑</span><div className="quadrant__grid">{areas.map(([label, value]) => <button key={value} type="button" className={`quadrant__area quadrant__area--${value}`} onClick={() => onSelect?.(value)}>{label}</button>)}</div><span className="quadrant__axis quadrant__axis--bottom">저득점　← 득점 →　고득점　 ·　 빠름 ↓</span></div>;
}
export default TimeScoreQuadrant;
