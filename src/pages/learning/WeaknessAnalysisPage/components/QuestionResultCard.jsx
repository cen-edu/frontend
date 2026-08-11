import { areaLabels } from '../../../../mocks/weaknessAnalysis';

function QuestionResultCard({ worksheet, student, question, classAccuracy }) {
    const response = student.responses.find((item) => item.no === question.no); const ratio = response.maxScore ? response.score / response.maxScore : 0;
    const isAssessment = worksheet.type === 'assessment';
    const outcome = response.gradedBy === null ? 'pending' : ratio === 1 && response.hintUsed ? 'hint' : ratio === 1 ? 'correct' : ratio > 0 ? 'partial' : 'wrong';
    const outcomeLabel = { pending: '채점 대기', hint: '힌트 후 정답', correct: isAssessment ? '독립 정답' : '정답', partial: '부분 정답', wrong: '오답' }[outcome];
    const studentAnswer = isAssessment ? (ratio === 1 ? question.correctAnswer : '학생 제출 답안') : response.steps.map((item) => item.input || '미응답').join(' → ');
    const concept = question.steps?.[0]?.conceptId ? worksheet.concepts.find((item) => item.id === question.steps[0].conceptId)?.label : areaLabels[question.area];
    return <article className="question-result"><header><span>{question.no}</span><h3>{question.prompt}</h3><strong className={`question-result__score question-result__score--${outcome}`}>{outcomeLabel}</strong></header>
        <dl className="question-result__answers"><div><dt>학생 답안</dt><dd>{studentAnswer}</dd></div><div><dt>정답</dt><dd>{question.correctAnswer}</dd></div><div><dt>학급 정답률</dt><dd>{classAccuracy?.rate ?? 0}% ({classAccuracy?.correct ?? 0}/{classAccuracy?.total ?? 0}명)</dd></div></dl>
        {!isAssessment && <ol className="question-result__steps">{question.steps.map((step) => { const result = response.steps.find((item) => item.order === step.order); return <li key={step.order}><span>0{step.order}</span><strong>{step.label}</strong><em>{result?.input || '미응답'}</em><i className={`bi ${result?.correct ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}`} /></li>; })}</ol>}
        <dl className="question-result__guidance"><div><dt>확인된 점</dt><dd>{outcome === 'correct' ? isAssessment ? '힌트 없이 풀이를 완료했습니다.' : '풀이를 스스로 완료했습니다.' : outcome === 'hint' ? '힌트가 주어지면 해결할 수 있습니다.' : '풀이 과정에서 개념 적용이 끊겼습니다.'}</dd></div><div><dt>핵심 개념</dt><dd>{concept || areaLabels[question.area]}</dd></div><div><dt>다시 풀 때</dt><dd>{outcome === 'correct' ? '다른 수 구조에서도 같은 방법을 설명하게 합니다.' : '핵심 조건을 먼저 표시하고 각 단계의 근거를 말하게 합니다.'}</dd></div></dl>
    </article>;
}
export default QuestionResultCard;
