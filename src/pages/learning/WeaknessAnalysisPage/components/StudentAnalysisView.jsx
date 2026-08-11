import { useState } from 'react';
import { areaLabels, getConceptRate, getQuestionAccuracy, getResultBreakdown, getStudentMetrics, statusLabels } from '../../../../mocks/weaknessAnalysis';
import ConceptAchievement from './ConceptAchievement';
import CustomLearningResult from './CustomLearningResult';
import DifficultyRadar from './DifficultyRadar';
import QuestionResultCard from './QuestionResultCard';
import ResultBreakdown from './ResultBreakdown';
import TimeTimeline from './TimeTimeline';

function StudentAnalysisView({ worksheet, student, index, onMove }) {
    const [resultFilter, setResultFilter] = useState('all');
    const metrics = getStudentMetrics(student);
    const isAssessment = worksheet.type === 'assessment';
    const weakConceptCount = worksheet.concepts.filter((concept) => {
        const result = getConceptRate(worksheet, student, concept.id);
        return result.count > 0 && result.rate < 60;
    }).length;
    const classStudents = worksheet.students.filter((item) => item.status !== 'insufficient');
    const classRate = Math.round(classStudents.reduce((sum, item) => sum + getStudentMetrics(item).scoreRate, 0) / Math.max(classStudents.length, 1));
    const classGap = metrics.scoreRate - classRate;
    const classGapTone = classGap > 0 ? 'above' : classGap < 0 ? 'below' : 'even';
    const questions = worksheet.questions.filter((question) => {
        const response = student.responses.find((item) => item.no === question.no);
        if (resultFilter === 'wrong') return response.score < response.maxScore && response.gradedBy !== null;
        if (resultFilter === 'hint') return response.hintUsed && response.score === response.maxScore;
        if (resultFilter === 'pending') return response.gradedBy === null;
        return true;
    });
    const weakestQuestion = worksheet.questions
        .map((question) => ({ question, response: student.responses.find((item) => item.no === question.no) }))
        .filter(({ response }) => response.gradedBy !== null)
        .sort((a, b) => a.response.score / a.response.maxScore - b.response.score / b.response.maxScore)[0]?.question;
    const weakConcept = weakestQuestion?.steps?.[0]?.conceptId ? worksheet.concepts.find((concept) => concept.id === weakestQuestion.steps[0].conceptId)?.label : areaLabels[weakestQuestion?.area];
    const recentIndependent = [...student.responses].reverse().findIndex((response) => response.score !== response.maxScore || response.hintUsed);
    const pendingCount = student.responses.filter((response) => response.gradedBy === null).length;

    return <div className="student-analysis-view">
        <header className="student-analysis-view__header">
            <div><div className="student-analysis-view__identity"><h2>{student.name}</h2><span className={`status-badge status-badge--${student.status}`}>{statusLabels[student.status]}</span></div><p>{worksheet.title} 개인 분석</p></div>
            <div className="student-analysis-view__navigation">
                <button type="button" disabled={index === 0} onClick={() => onMove(-1)}><i className="bi bi-chevron-left" /> 이전</button>
                <button type="button" disabled={index === worksheet.students.length - 1} onClick={() => onMove(1)}>다음 <i className="bi bi-chevron-right" /></button>
            </div>
        </header>
        <div className="student-analysis-view__metrics">
            {[['풀이 문항', metrics.solvedCount, '문항'], ['정답', metrics.correctCount, '문항'], ['정답률', metrics.scoreRate, '%'], isAssessment ? ['힌트 사용', metrics.hints, '회'] : ['취약 개념', weakConceptCount, '개']].map(([label, value, unit]) => <div key={label}><span>{label}</span><strong>{value}<small>{unit}</small></strong></div>)}
        </div>
        {pendingCount > 0 && <p className="student-analysis-view__pending"><i className="bi bi-exclamation-circle" /> 채점 대기 {pendingCount}건을 지표에서 제외했습니다.</p>}
        <div className="student-analysis-view__insight"><strong>{weakConcept || '응답 패턴'}</strong>에서 반복 오류가 관찰되었습니다.{isAssessment && ` 독립 정답률은 ${metrics.independentRate}%입니다.`}</div>
        <section className="student-priority">
            <div><span>가장 먼저 지도할 부분</span><h3>{weakConcept || '추가 응답 확인'}</h3><p>중학교 1학년 › 수와 연산 › 소인수분해 › {weakConcept || '응답 확인'}</p></div>
            <dl><div><dt>상태</dt><dd>{statusLabels[student.status]}</dd></div><div><dt>누적 오답</dt><dd>{student.responses.filter((response) => response.score < response.maxScore && response.gradedBy !== null).length}회</dd></div><div><dt>{isAssessment ? '최근 연속 독립 정답' : '최근 연속 정답'}</dt><dd>{recentIndependent < 0 ? student.responses.length : recentIndependent}회</dd></div></dl>
        </section>
        <section className="student-comparison diagnosis-card">
            <div className="diagnosis-card__heading"><div><span>같은 학습지 기준</span><h2>학급 비교</h2></div></div>
            <div className="student-comparison__values"><div><span>학생 정답률</span><strong className={`student-comparison__value student-comparison__value--${classGapTone}`}>{metrics.scoreRate}%</strong></div><div><span>학급 평균</span><strong>{classRate}%</strong></div><div><span>평균과 차이</span><strong className={`student-comparison__value student-comparison__value--${classGapTone}`}>{classGap > 0 ? '+' : ''}{classGap}%p</strong></div></div>
            <p>이 비교는 현재 학습지 응답만을 기준으로 하며 등수나 전체 능력을 의미하지 않습니다.</p>
        </section>
        <CustomLearningResult worksheet={worksheet} student={student} />
        <div className="student-analysis-view__breakdowns">
            <ResultBreakdown title="영역별 학생 vs 학급" description="학생 막대와 학급 평균 비교" items={getResultBreakdown(worksheet, 'area', student)} comparisonItems={getResultBreakdown(worksheet, 'area')} />
            <DifficultyRadar items={getResultBreakdown(worksheet, 'difficulty', student)} comparisonItems={getResultBreakdown(worksheet, 'difficulty')} />
        </div>
        {worksheet.type === 'practice' && <ConceptAchievement worksheet={worksheet} student={student} showLegend />}
        {worksheet.type === 'assessment' && <TimeTimeline student={student} />}
        <section className="student-analysis-view__results diagnosis-card">
            <div className="student-analysis-view__results-heading"><div><span>지도 근거 확인</span><h2>문항별 결과</h2></div><div className="diagnosis-tabs">{(isAssessment ? [['all', '전체'], ['wrong', '오답'], ['hint', '힌트 후 정답'], ['pending', '채점 대기']] : [['all', '전체'], ['wrong', '오답']]).map(([value, label]) => <button type="button" key={value} className={resultFilter === value ? 'diagnosis-tabs__button diagnosis-tabs__button--active' : 'diagnosis-tabs__button'} onClick={() => setResultFilter(value)}>{label}</button>)}</div></div>
            <div className="student-analysis-view__cards">{questions.map((question) => <QuestionResultCard key={question.no} worksheet={worksheet} student={student} question={question} classAccuracy={getQuestionAccuracy(worksheet, question.no)} />)}{!questions.length && <p className="student-analysis-view__empty">해당하는 문항이 없습니다.</p>}</div>
        </section>
        <section className="diagnosis-card learning-record">
            <div className="diagnosis-card__heading"><div><span>응답 흐름과 관찰</span><h2>풀이 기록</h2></div></div>
            <div className="learning-record__wrap"><table><thead><tr><th>문항</th><th>영역</th><th>결과</th>{isAssessment && <th>힌트</th>}<th>학급 정답률</th></tr></thead><tbody>{worksheet.questions.map((question) => { const response = student.responses.find((item) => item.no === question.no); const accuracy = getQuestionAccuracy(worksheet, question.no); const label = response.gradedBy === null ? '채점 대기' : response.score === response.maxScore ? isAssessment && response.hintUsed ? '힌트 후 정답' : isAssessment ? '독립 정답' : '정답' : '오답'; return <tr key={question.no}><td>{question.no}번</td><td>{areaLabels[question.area]}</td><td>{label}</td>{isAssessment && <td>{response.hintUsed ? '사용' : '—'}</td>}<td>{accuracy.rate}%</td></tr>; })}</tbody></table></div>
            <div className="learning-record__observation"><strong>관찰 요약</strong><p>{weakConcept || '현재 응답'} 관련 문항에서 정답의 근거를 말로 설명하게 하고, {isAssessment ? '힌트 없이 ' : ''}같은 구조를 다시 해결하는지 확인해 주세요.</p></div>
        </section>
    </div>;
}

export default StudentAnalysisView;
