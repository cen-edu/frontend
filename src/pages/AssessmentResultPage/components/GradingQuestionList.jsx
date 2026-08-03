import { formatLabels } from '../../../mocks/assessmentCreation';

function GradingQuestionList({ questions, students, selectedNo, onSelect }) {
    const statusFor = (question) => {
        if (question.gradingStatus === 'auto') return { icon: '✓', label: '자동 완료', tone: 'auto' };
        const pending = students.some((student) => student.answers.find((answer) => answer.no === question.no)?.score === null);
        if (question.no === selectedNo) return { icon: '●', label: '채점 중', tone: 'active' };
        return pending ? { icon: '⚠', label: '확인 필요', tone: 'pending' } : { icon: '✓', label: '채점 완료', tone: 'done' };
    };
    const remaining = questions.filter((question) => question.gradingStatus !== 'auto' && students.some((student) => student.answers.find((answer) => answer.no === question.no)?.score === null)).length;

    return (
        <aside className="grading-question-list" aria-label="문항 목록">
            <div className="grading-question-list__heading"><span>문항</span><strong>{questions.length}</strong></div>
            <div className="grading-question-list__items">
                {questions.map((question) => {
                    const status = statusFor(question);
                    return <button key={question.no} type="button" className={`grading-question-list__item grading-question-list__item--${status.tone}${selectedNo === question.no ? ' grading-question-list__item--selected' : ''}`} onClick={() => onSelect(question.no)}><span><strong>{question.no}</strong>{formatLabels[question.format]}</span><span title={status.label}>{status.icon}</span></button>;
                })}
            </div>
            <div className="grading-question-list__remaining"><span>남은 문항</span><strong>{remaining}</strong></div>
        </aside>
    );
}

export default GradingQuestionList;
