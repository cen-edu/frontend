import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AccuracyAnalysis({ concepts, questions, worksheetId }) {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('concepts');
    const [selectedId, setSelectedId] = useState(concepts[0]?.id);
    const items = activeTab === 'concepts' ? concepts : questions;
    const selectedItem = items.find((item) => item.id === selectedId) ?? items[0];

    const changeTab = (tab) => {
        setActiveTab(tab);
        setSelectedId((tab === 'concepts' ? concepts : questions)[0]?.id);
    };

    const createProblems = () => {
        const params = new URLSearchParams({ worksheet: worksheetId, target: selectedItem.label });
        navigate(`/problems/custom?${params.toString()}`);
    };

    return (
        <section className="dashboard-section dashboard-section--analysis" aria-labelledby="accuracy-analysis-title">
            <div className="dashboard-section__header">
                <div>
                    <span className="dashboard-section__kicker">핵심 분석</span>
                    <h2 id="accuracy-analysis-title">개념·문항별 정답률</h2>
                    <p>막대를 선택하면 취약 학생 수와 맞춤 출제 기능을 확인할 수 있어요.</p>
                </div>
                <div className="dashboard-tabs" role="tablist" aria-label="정답률 분석 기준">
                    <button type="button" role="tab" aria-selected={activeTab === 'concepts'} className={activeTab === 'concepts' ? 'dashboard-tabs__button dashboard-tabs__button--active' : 'dashboard-tabs__button'} onClick={() => changeTab('concepts')}>개념별 분석</button>
                    <button type="button" role="tab" aria-selected={activeTab === 'questions'} className={activeTab === 'questions' ? 'dashboard-tabs__button dashboard-tabs__button--active' : 'dashboard-tabs__button'} onClick={() => changeTab('questions')}>문항별 분석</button>
                </div>
            </div>

            <div className="accuracy-chart" role="tabpanel">
                {items.map((item) => {
                    const isSelected = item.id === selectedItem?.id;
                    const level = item.accuracy < 50 ? 'critical' : item.accuracy < 70 ? 'warning' : 'good';

                    return (
                        <button key={item.id} type="button" className={`accuracy-chart__row${isSelected ? ' accuracy-chart__row--selected' : ''}`} onClick={() => setSelectedId(item.id)}>
                            <span className="accuracy-chart__label">{item.label}</span>
                            <span className="accuracy-chart__track">
                                <span className={`accuracy-chart__bar accuracy-chart__bar--${level}`} style={{ width: `${item.accuracy}%` }} />
                            </span>
                            <strong>{item.accuracy}%</strong>
                        </button>
                    );
                })}
            </div>

            {selectedItem && (
                <div className="accuracy-chart__selection">
                    <div>
                        <span>현재 선택</span>
                        <strong>{selectedItem.label}</strong>
                        <small>정답률 {selectedItem.accuracy}% · 취약 학생 {selectedItem.weakStudents}명</small>
                    </div>
                    <button type="button" onClick={createProblems}><i className="bi bi-stars" aria-hidden="true" />이 항목으로 문제 만들기</button>
                </div>
            )}
        </section>
    );
}

export default AccuracyAnalysis;
