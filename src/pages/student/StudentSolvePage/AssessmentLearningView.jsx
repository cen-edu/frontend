import { MathText } from '../../../components/common/worksheets';
import { difficultyLabels, formatLabels } from '../../../mocks/labels';
import StudentLearningSupport from './StudentLearningSupport';

function AssessmentLearningView({
    problem,
    studentName,
    currentIndex,
    problemCount,
    bookmarked,
    onToggleBookmark,
    renderAnswer,
    onPrevious,
    onNext,
    isSaving,
}) {
    return (
        <div className="student-solve__practice-workspace">
            <section className="student-solve__problem" aria-labelledby="current-problem-title">
                <div className="student-solve__problem-topline">
                    <div>
                        <span className="student-solve__number">{problem.no}</span>
                        <span className="student-solve__difficulty">난이도 {difficultyLabels[problem.difficulty]}</span>
                        <span className="student-solve__format">{formatLabels[problem.format]} · {problem.maxScore}점</span>
                    </div>
                    <button
                        type="button"
                        aria-pressed={bookmarked}
                        className={bookmarked ? 'student-solve__bookmark student-solve__bookmark--active' : 'student-solve__bookmark'}
                        onClick={onToggleBookmark}
                    >
                        <i className={`bi bi-bookmark${bookmarked ? '-fill' : ''}`} aria-hidden="true" /> 나중에 보기
                    </button>
                </div>
                <div className="student-solve__question-copy">
                    <h2 id="current-problem-title"><MathText>{problem.prompt}</MathText></h2>
                    {problem.subPrompt && <p><MathText>{problem.subPrompt}</MathText></p>}
                </div>
                {problem.contentBlocks
                    .filter((block) => block.asset?.url)
                    .map((block) => <img key={block.blockId} src={block.asset.url} alt={block.asset.altText} />)}
                <div className="student-solve__answer-area">
                    <h3>답 입력</h3>
                    {renderAnswer()}
                </div>
                <footer className="student-solve__controls student-solve__controls--practice">
                    <button type="button" disabled={currentIndex === 0 || isSaving} onClick={onPrevious}>
                        <i className="bi bi-chevron-left" aria-hidden="true" /> 이전 문제
                    </button>
                    <span>{problem.no} / {problemCount}</span>
                    <button type="button" disabled={currentIndex === problemCount - 1 || isSaving} className="student-solve__next" onClick={onNext}>
                        {isSaving ? '저장 중' : '다음 문제'} {!isSaving && <i className="bi bi-chevron-right" aria-hidden="true" />}
                    </button>
                </footer>
            </section>

            <StudentLearningSupport problem={problem} studentName={studentName} />
        </div>
    );
}

export default AssessmentLearningView;
