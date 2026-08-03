import { difficultyLabels } from '../../../mocks/problemCreation';
import { customStageLabels } from '../../../mocks/customCreation';
import './ProblemViewer.scss';

function ProblemStepView({ problem, showAnswers }) {
    if (!problem) return <div className="problem-step-view problem-step-view--empty">목록에서 문제를 선택해 주세요.</div>;
    return <article className="problem-step-view">
        <header className="problem-step-view__header"><span>{problem.unitPath} · 난이도 {difficultyLabels[problem.difficulty]}{problem.stage ? ` · ${customStageLabels[problem.stage]}${problem.sourceQuestionNo ? ` · 원본 ${problem.sourceQuestionNo}번` : ''}` : ''}</span><h3>{problem.no}. {problem.prompt}</h3></header>
        <div className="problem-step-view__steps">{problem.steps.map((step, index) => <section className="problem-step-view__step" key={step.id} aria-labelledby={`${step.id}-title`}><h4 id={`${step.id}-title`}>단계 {index + 1}</h4><p>{step.segments.map((segment, segmentIndex) => segment.type === 'text' ? <span key={`${step.id}-text-${segmentIndex}`}>{segment.value}</span> : <span key={segment.id} className={`problem-step-view__blank${showAnswers ? ' problem-step-view__blank--answer' : ''}`}>{showAnswers ? segment.answer : <span className="problem-viewer-sr-only">빈칸</span>}</span>)}</p></section>)}</div>
        <p className="problem-step-view__guide"><i className="bi bi-info-circle" aria-hidden="true" /> 학생 화면에서는 각 빈칸에 답을 직접 입력합니다.</p>
    </article>;
}

export default ProblemStepView;
