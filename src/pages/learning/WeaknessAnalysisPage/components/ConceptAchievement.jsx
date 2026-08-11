import { getConceptRate } from '../../../../mocks/weaknessAnalysis';

function ConceptAchievement({ worksheet, student, showLegend = false }) {
    const items = worksheet.concepts.map((concept) => ({ ...concept, rate: getConceptRate(worksheet, student, concept.id).rate }));
    return <section className="student-section"><div className="student-section__heading"><span>응답 단계 기준</span><h2>개념별 결과</h2></div>{showLegend && <div className="concept-achievement__legend"><span>80% 이상</span><span>60~79%</span><span>60% 미만</span></div>}<div className="concept-achievement">{items.map((item) => <div className="concept-achievement__row" key={item.id}><strong>{item.label}</strong><span className={`concept-achievement__track concept-achievement__track--${item.rate >= 80 ? 'stable' : item.rate >= 60 ? 'review' : 'weak'}`}><i style={{ width: `${item.rate}%` }} /></span><b className={item.rate < 60 ? 'concept-achievement__rate concept-achievement__rate--weak' : 'concept-achievement__rate'}>{item.rate}%</b></div>)}</div></section>;
}
export default ConceptAchievement;
