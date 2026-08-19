import {
    DiagnosticStage,
    GradingStatus,
    QuestionTypeGroup,
    StudentItemResultType,
} from '../../../../api/analysis/analysisConstants.js';
import { MathText } from '../../../../components/common/worksheets';
import {
    difficultyBandLabels,
    evaluationAreaLabels,
    formatAnalysisDuration,
    questionTypeGroupLabels,
} from '../analysisAdapters.js';
import './QuestionResultCard.scss';

const resultLabels = {
    [StudentItemResultType.NOT_GRADED]: '채점 대기',
    [StudentItemResultType.CORRECT]: '정답',
    [StudentItemResultType.PARTIAL_CORRECT]: '부분 정답',
    [StudentItemResultType.INCORRECT]: '오답',
};

const resultTones = {
    [StudentItemResultType.NOT_GRADED]: 'pending',
    [StudentItemResultType.CORRECT]: 'correct',
    [StudentItemResultType.PARTIAL_CORRECT]: 'partial',
    [StudentItemResultType.INCORRECT]: 'wrong',
};

const diagnosticStageLabels = {
    [DiagnosticStage.INTERPRET]: '문제 해석',
    [DiagnosticStage.MODEL]: '식 세우기',
    [DiagnosticStage.EXECUTE]: '계산·실행',
    [DiagnosticStage.ANSWER]: '답 작성',
};

const formatRate = (value) => value == null ? '-' : `${value}%`;

function QuestionResultCard({ item, reportMessage = null }) {
    const isFailed = item.gradingStatus === GradingStatus.FAILED;
    const outcomeLabel = isFailed ? '채점 실패' : resultLabels[item.resultType] ?? '결과 없음';
    const outcomeTone = isFailed ? 'wrong' : resultTones[item.resultType] ?? 'pending';
    const answerUnits = [...(item.answerUnits ?? [])].sort((a, b) => a.displayOrder - b.displayOrder);
    const categoryLabel = item.questionTypeGroup
        ? questionTypeGroupLabels[item.questionTypeGroup] ?? item.questionTypeGroup
        : item.evaluationArea
            ? evaluationAreaLabels[item.evaluationArea] ?? item.evaluationArea
            : '-';
    const answerIsLatex = !item.questionTypeGroup
        || item.questionTypeGroup === QuestionTypeGroup.SHORT_ANSWER;
    const renderAnswer = (value) => (
        value === null || value === undefined || value === ''
            ? '-'
            : <MathText latex={answerIsLatex}>{value}</MathText>
    );

    return (
        <article className="question-result">
            <header>
                <span>{item.itemNumber}</span>
                <h3><MathText>{item.questionTitle}</MathText></h3>
                <strong className={`question-result__score question-result__score--${outcomeTone}`}>{outcomeLabel}</strong>
            </header>
            <dl className="question-result__answers">
                <div><dt>유형·난이도</dt><dd>{categoryLabel} · {difficultyBandLabels[item.difficultyBand] ?? item.difficultyBand}</dd></div>
                <div><dt>점수</dt><dd>{item.score === null || item.maxScore === null ? '-' : `${item.score}/${item.maxScore}점`}</dd></div>
                <div><dt>학급 정답률</dt><dd>{formatRate(item.classAccuracyRate)} ({item.classCorrectStudentCount}/{item.classGradedStudentCount}명)</dd></div>
            </dl>
            {(item.solvingDurationMs != null || item.classMedianSolvingDurationMs != null) && <dl className="question-result__timing">
                <div><dt>학생 풀이 시간</dt><dd>{formatAnalysisDuration(item.solvingDurationMs)}</dd></div>
                <div><dt>학급 중앙값</dt><dd>{formatAnalysisDuration(item.classMedianSolvingDurationMs)}</dd></div>
            </dl>}
            {answerUnits.length
                ? <ol className="question-result__answer-units">{answerUnits.map((answerUnit) => {
                    const unitFailed = answerUnit.gradingStatus === GradingStatus.FAILED;
                    const unitLabel = unitFailed ? '채점 실패' : resultLabels[answerUnit.resultType] ?? '결과 없음';
                    const unitTone = unitFailed ? 'wrong' : resultTones[answerUnit.resultType] ?? 'pending';
                    return <li key={answerUnit.answerUnitId}>
                        <span>{String(answerUnit.displayOrder).padStart(2, '0')}</span>
                        <div><strong><MathText>{answerUnit.label}</MathText></strong><small>{answerUnit.diagnosticStage ? diagnosticStageLabels[answerUnit.diagnosticStage] ?? answerUnit.diagnosticStage : '답안 단위'}</small></div>
                        <dl><div><dt>학생 답안</dt><dd>{renderAnswer(answerUnit.studentAnswer)}</dd></div><div><dt>정답</dt><dd>{renderAnswer(answerUnit.correctAnswer)}</dd></div></dl>
                        <em className={`question-result__unit-status question-result__unit-status--${unitTone}`}>{unitLabel}{answerUnit.score !== null ? ` · ${answerUnit.score}점` : ''}</em>
                    </li>;
                })}</ol>
                : <p className="question-result__empty">표시할 답안 단위 결과가 없습니다.</p>}
            {reportMessage && <aside className="question-result__report" aria-label={`${item.itemNumber}번 문항 AI 분석`}>
                <div><span>AI 관찰</span><p><MathText>{reportMessage.observation}</MathText></p></div>
                <dl>
                    <div><dt>학습 포인트</dt><dd><MathText>{reportMessage.learningPoint}</MathText></dd></div>
                    <div><dt>다시 풀기</dt><dd><MathText>{reportMessage.retryGuide}</MathText></dd></div>
                </dl>
            </aside>}
        </article>
    );
}

export default QuestionResultCard;
