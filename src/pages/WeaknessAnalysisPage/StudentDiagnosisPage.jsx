import { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getStudentMetrics, statusLabels, weaknessWorksheets } from '../../mocks/weaknessAnalysis';
import ConceptAchievement from './components/ConceptAchievement';
import QuestionResultCard from './components/QuestionResultCard';
import TimeTimeline from './components/TimeTimeline';
import './StudentDiagnosisPage.scss';

function StudentDiagnosisPage() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [resultFilter, setResultFilter] = useState('all');
    const worksheet = weaknessWorksheets[searchParams.get('worksheet')] ?? weaknessWorksheets['factor-practice'];
    const index = Math.max(0, worksheet.students.findIndex((item) => item.id === id));
    const student = worksheet.students[index];
    const metrics = getStudentMetrics(student);
    const questions = worksheet.questions.filter((question) => {
        const response = student.responses.find((item) => item.no === question.no);
        if (resultFilter === 'wrong') return response.score === 0;
        if (resultFilter === 'partial') return response.score > 0 && response.score < response.maxScore;
        if (resultFilter === 'pending') return response.gradedBy === null;
        return true;
    });
    const move = (delta) => {
        const next = worksheet.students[index + delta];
        if (next) navigate(`/learning/weaknesses/students/${next.id}?worksheet=${worksheet.id}`);
    };
    const weakest = student.nextAction.replace(/\s*\d+문항$/, '');

    return (
        <div className="student-diagnosis-page">
            <Link className="student-diagnosis-page__back" to={`/learning/weaknesses?worksheet=${worksheet.id}`}>
                <i className="bi bi-chevron-left" /> {worksheet.className} · {worksheet.title}
            </Link>

            <header className="student-diagnosis-page__hero">
                <div>
                    <p>학생 진단</p>
                    <h1>{student.name}</h1>
                    <span>득점률 {metrics.scoreRate}% · <b>{statusLabels[student.status]}</b>{worksheet.type === 'assessment' && ` · ${Math.round(metrics.seconds / 60)}분 · 힌트 ${metrics.hints}회`}</span>
                </div>
                <div>
                    <button type="button" disabled={index === 0} onClick={() => move(-1)}><i className="bi bi-chevron-left" /> 이전 학생</button>
                    <button type="button" disabled={index === worksheet.students.length - 1} onClick={() => move(1)}>다음 학생 <i className="bi bi-chevron-right" /></button>
                </div>
            </header>

            <div className="student-diagnosis-page__insight">
                <i className="bi bi-flag-fill" />
                <span><strong>{weakest}</strong>에서 반복 오류가 관찰되었습니다.</span>
            </div>

            <div className={`student-diagnosis-page__overview${worksheet.type === 'assessment' ? ' student-diagnosis-page__overview--split' : ''}`}>
                {worksheet.type === 'practice' && <ConceptAchievement worksheet={worksheet} student={student} />}
                {worksheet.type === 'assessment' && (
                    <>
                        <section className="student-section">
                            <div className="student-section__heading"><span>평가 결과</span><h2>평가 요약</h2></div>
                            <div className="student-score"><strong>{metrics.scoreRate}%</strong><span>총 {student.responses.reduce((sum, item) => sum + item.score, 0)}점</span></div>
                        </section>
                        <TimeTimeline student={student} />
                    </>
                )}
            </div>

            <section className="student-diagnosis-page__results">
                <div className="student-diagnosis-page__results-heading">
                    <div><span>상세 결과</span><h2>문항별 결과</h2></div>
                    <div>
                        {[['all', '전체'], ['wrong', '오답만'], ['partial', '부분점수'], ['pending', '채점대기']].map(([value, label]) => (
                            <button type="button" key={value} className={resultFilter === value ? 'active' : ''} onClick={() => setResultFilter(value)}>{label}</button>
                        ))}
                    </div>
                </div>
                <div className="student-diagnosis-page__cards">
                    {questions.map((question) => <QuestionResultCard key={question.no} worksheet={worksheet} student={student} question={question} />)}
                    {!questions.length && <p className="student-diagnosis-page__empty">해당하는 문항이 없습니다.</p>}
                </div>
            </section>

            <footer className="student-diagnosis-page__next">
                <div><span>후속 지도</span><strong>다음 지도</strong><p>{student.nextAction}</p></div>
                <button type="button">이 조건으로 출제 <i className="bi bi-arrow-right" /></button>
            </footer>
        </div>
    );
}

export default StudentDiagnosisPage;
