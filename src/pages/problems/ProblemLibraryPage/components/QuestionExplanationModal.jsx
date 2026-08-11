import StudentFormModal from '../../../students/shared/StudentFormModal';

const getAssessmentAnswer = (problem) => {
    if (problem.format === 'choice') {
        const choice = problem.choices[Number(problem.answer) - 1];
        return `${problem.answer}번${choice ? ` ${choice}` : ''}`;
    }

    return problem.modelAnswer ?? problem.answer;
};

const renderSegments = (step) => step.segments.map((segment, index) => (
    segment.type === 'blank'
        ? <strong key={segment.id}>{segment.answer}</strong>
        : <span key={`${step.id}-text-${index}`}>{segment.value}</span>
));

function QuestionExplanationModal({ problem, isAssessment, onClose }) {
    if (!problem) return null;

    return <StudentFormModal title={`${problem.no}번 문항 해설`} closeLabel="문항 해설 창 닫기" onClose={onClose} width={640}>
        <div className="question-explanation-modal">
            <section className="question-explanation-modal__problem" aria-labelledby="explanation-problem-title">
                <h3 id="explanation-problem-title">문제</h3>
                <p>{problem.prompt}</p>
            </section>
            <section aria-labelledby="explanation-answer-title">
                <h3 id="explanation-answer-title">정답</h3>
                <p className="question-explanation-modal__answer">
                    {isAssessment ? getAssessmentAnswer(problem) : problem.steps.flatMap((step) => step.segments.filter((segment) => segment.type === 'blank').map((segment) => segment.answer)).join(' · ')}
                </p>
            </section>
            <section aria-labelledby="explanation-process-title">
                <h3 id="explanation-process-title">풀이</h3>
                {isAssessment ? <div className="question-explanation-modal__assessment-explanation">
                    <p>{problem.format === 'essay'
                        ? problem.modelAnswer
                        : `${problem.unitName}의 정의와 성질을 문제의 조건에 적용하면 정답은 ${getAssessmentAnswer(problem)}입니다.`}</p>
                    {problem.rubric?.length > 0 && <div className="question-explanation-modal__rubric"><h4>채점 기준</h4><ul>{problem.rubric.map((item) => <li key={item.label}><span>{item.label}</span><strong>{item.score}점</strong></li>)}</ul></div>}
                </div> : <ol className="question-explanation-modal__steps">
                    {problem.steps.map((step, index) => <li key={step.id}><span>{index + 1}</span><p>{renderSegments(step)}</p></li>)}
                </ol>}
            </section>
        </div>
        <footer className="student-form-modal__footer">
            <button type="button" className="student-form-modal__secondary-button" onClick={onClose}>닫기</button>
        </footer>
    </StudentFormModal>;
}

export default QuestionExplanationModal;
