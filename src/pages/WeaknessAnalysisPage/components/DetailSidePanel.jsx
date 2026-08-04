import TimeScoreQuadrant from './TimeScoreQuadrant';
import { formatLabels } from '../../../mocks/assessmentCreation';

function DetailSidePanel({ worksheet, selection, onQuadrantSelect }) {
    if (worksheet.type === 'assessment') {
        if (selection?.type === 'question') {
            const question = worksheet.questions.find((item) => item.no === selection.questionNo);
            const responses = worksheet.students
                .map((student) => student.responses.find((item) => item.no === selection.questionNo))
                .filter((item) => item.gradedBy !== null);
            const correct = responses.filter((item) => item.score === item.maxScore);
            const incorrect = responses.filter((item) => item.score < item.maxScore);
            const averageTime = (items) => Math.round(items.reduce((sum, item) => sum + item.seconds, 0) / Math.max(items.length, 1));

            return (
                <aside className="diagnosis-card detail-panel">
                    <span className="detail-panel__kicker">{question.no}번 문항</span>
                    <h2>문항 상세</h2>
                    <span className="detail-panel__format">{formatLabels[question.format]}</span>
                    <strong className="detail-panel__rate">{Math.round(correct.length / Math.max(responses.length, 1) * 100)}%</strong>
                    <small>득점률</small>
                    <div className="detail-panel__compare">
                        <div><span>정답자 평균</span><strong>{averageTime(correct)}초</strong></div>
                        <div><span>오답자 평균</span><strong>{averageTime(incorrect)}초</strong></div>
                    </div>
                    <p>{question.prompt}</p>
                </aside>
            );
        }

        return (
            <aside className="diagnosis-card detail-panel">
                <span className="detail-panel__kicker">분석 기준</span>
                <h2>시간 × 득점 분포</h2>
                <p>사분면을 선택하면 해당 학생만 목록에 표시합니다.</p>
                <TimeScoreQuadrant onSelect={onQuadrantSelect} />
            </aside>
        );
    }

    if (selection?.type === 'question') {
        const question = worksheet.questions.find((item) => item.no === selection.questionNo);
        const results = worksheet.students.filter((student) => student.status !== 'insufficient').map((student) => student.responses.find((response) => response.no === question.no));
        const correct = results.filter((response) => response.score === response.maxScore).length;
        const inputs = results.flatMap((response) => response.steps ?? []).filter((step) => !step.correct && step.input).map((step) => step.input);
        const counts = Object.entries(inputs.reduce((all, input) => ({ ...all, [input]: (all[input] ?? 0) + 1 }), {})).sort((a, b) => b[1] - a[1]);
        return <aside className="diagnosis-card detail-panel">
            <span className="detail-panel__kicker">{question.no}번 문항</span><h2>오답 입력값 집계</h2>
            <strong className="detail-panel__rate">{Math.round(correct / Math.max(results.length, 1) * 100)}%</strong><small>학급 정답률 · 자료 부족 학생 제외</small>
            <p>{question.prompt}</p>
            <ul className="detail-panel__ranking">{counts.length ? counts.map(([input, count]) => <li key={input}><strong>{input}</strong><span>{count}명</span></li>) : <li className="detail-panel__empty">집계된 오답이 없습니다.</li>}</ul>
        </aside>;
    }

    if (selection?.type === 'concept') {
        const concept = worksheet.concepts.find((item) => item.id === selection.conceptId);
        const inputs = worksheet.students.flatMap((student) => {
            const results = worksheet.questions.flatMap((question) => question.steps
                .filter((step) => step.conceptId === concept.id)
                .map((step) => student.responses.find((response) => response.no === question.no)?.steps.find((value) => value.order === step.order)))
                .filter(Boolean);
            return results.filter((item) => !item.correct && item.input).map((item) => item.input);
        });
        const counts = Object.entries(inputs.reduce((all, input) => ({ ...all, [input]: (all[input] ?? 0) + 1 }), {}))
            .sort((a, b) => b[1] - a[1]);

        return (
            <aside className="diagnosis-card detail-panel">
                <span className="detail-panel__kicker">개념 상세</span>
                <h2>{concept.label}</h2>
                <p>오답 입력값을 같은 표현끼리 묶었습니다.</p>
                <ul className="detail-panel__ranking">{counts.map(([input, count]) => <li key={input}><strong>{input}</strong><span>{count}명</span></li>)}</ul>
            </aside>
        );
    }

    const ranks = worksheet.concepts.map((concept) => {
        const weak = worksheet.students.filter((student) => worksheet.questions.some((question) => question.steps.some((step) =>
            step.conceptId === concept.id
            && student.responses.find((response) => response.no === question.no)?.steps.some((result) => result.order === step.order && !result.correct),
        ))).length;
        return { ...concept, weak };
    }).sort((a, b) => b.weak - a.weak);

    const total = worksheet.students.length;

    return (
        <aside className="diagnosis-card detail-panel">
            <span className="detail-panel__kicker">취약 순위</span>
            <h2>개념별 취약 인원</h2>
            <p>전체 {total}명 중 해당 개념에서 오답이 있었던 학생 수입니다.</p>
            <ol className="concept-bars">
                {ranks.map((concept, index) => {
                    const share = Math.round(concept.weak / Math.max(total, 1) * 100);
                    const level = share >= 50 ? 'high' : share >= 25 ? 'mid' : 'low';
                    return (
                        <li key={concept.id}>
                            <div className="concept-bars__row" aria-label={`${concept.label} 취약 ${concept.weak}명, 전체 ${total}명의 ${share}%`}>
                                <span className="concept-bars__rank">{index + 1}</span>
                                <strong className="concept-bars__label">{concept.label}</strong>
                                <span className="concept-bars__value">{concept.weak}명 <small>{share}%</small></span>
                                <span className={`concept-bars__track concept-bars__track--${level}`}><i style={{ width: `${share}%` }} /></span>
                            </div>
                        </li>
                    );
                })}
            </ol>
        </aside>
    );
}

export default DetailSidePanel;
