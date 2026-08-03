import { useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getAssessmentResults, saveAssessmentResults } from '../../mocks/assessmentResult';
import GradingAnswerCard from './components/GradingAnswerCard';
import GradingStudentList from './components/GradingStudentList';
import './GradingPage.scss';
import './components/AssessmentResultComponents.scss';

const deriveRubricChecks = (answer, question) => {
    if (answer?.rubricChecks?.length === question.rubric.length) return answer.rubricChecks;
    let accumulated = 0;
    return question.rubric.map((item) => {
        accumulated += item.score;
        return (answer?.score ?? 0) >= accumulated;
    });
};

function GradingPage() {
    const navigate = useNavigate();
    const { worksheetId } = useParams();
    const [searchParams] = useSearchParams();
    const [results, setResults] = useState(getAssessmentResults);
    const worksheet = results.find((item) => item.id === worksheetId);
    const requestedStudent = searchParams.get('student');
    const requestedIndex = worksheet?.students.findIndex((student) => String(student.id) === requestedStudent);
    const firstPendingIndex = worksheet?.students.findIndex((student) => student.answers.some((answer) => answer.score === null));
    const [studentIndex, setStudentIndex] = useState(requestedIndex >= 0 ? requestedIndex : Math.max(firstPendingIndex ?? 0, 0));
    const student = worksheet?.students[studentIndex];

    const studentProgress = useMemo(() => {
        if (!worksheet || !student) return { completed: 0, total: 0 };
        const manualQuestions = worksheet.questions.filter((question) => question.gradingStatus !== 'auto');
        return {
            total: manualQuestions.length,
            completed: manualQuestions.filter((question) => student.answers.find((answer) => answer.no === question.no)?.score !== null).length,
        };
    }, [student, worksheet]);

    const updateScore = (questionNo, score, selectedRubricChecks) => {
        setResults((current) => {
            const next = current.map((item) => {
                if (item.id !== worksheet.id) return item;
                const question = item.questions.find((candidate) => candidate.no === questionNo);
                const nextStudents = item.students.map((candidate, index) => index !== studentIndex ? candidate : {
                    ...candidate,
                    answers: candidate.answers.map((answer) => answer.no !== questionNo ? answer : {
                        ...answer,
                        score,
                        gradedBy: 'teacher',
                        rubricChecks: selectedRubricChecks ?? deriveRubricChecks({ score }, question),
                    }),
                });
                const allComplete = nextStudents.every((candidate) => candidate.answers.every((answer) => answer.score !== null));
                return { ...item, students: nextStudents, status: allComplete ? (item.status === 'confirmed' ? 'confirmed' : 'graded') : 'grading', modified: item.status === 'confirmed' ? true : item.modified };
            });
            saveAssessmentResults(next);
            return next;
        });
    };

    const toggleRubric = (question, rubricIndex) => {
        const answer = student.answers.find((candidate) => candidate.no === question.no);
        const currentChecks = deriveRubricChecks(answer, question);
        const nextChecks = currentChecks.map((checked, index) => index === rubricIndex ? !checked : checked);
        const score = question.rubric.reduce((sum, item, index) => sum + (nextChecks[index] ? item.score : 0), 0);
        updateScore(question.no, score, nextChecks);
    };

    if (!worksheet || !student || worksheet.type !== 'assessment') {
        return <main className="grading-page grading-page--missing"><div><p>채점할 평가를 찾을 수 없습니다.</p><button type="button" onClick={() => navigate('/learning/results')}>평가 결과로 돌아가기</button></div></main>;
    }

    const completedStudents = worksheet.students.filter((candidate) => candidate.answers.every((answer) => answer.score !== null)).length;
    const moveStudent = (nextIndex) => {
        setStudentIndex(Math.min(Math.max(nextIndex, 0), worksheet.students.length - 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <main className="grading-page">
            <header className="grading-page__header">
                <button type="button" className="grading-page__back" aria-label="평가 결과로 돌아가기" onClick={() => navigate('/learning/results')}><i className="bi bi-chevron-left" /></button>
                <div><strong>{worksheet.title}</strong><span>{worksheet.className}</span></div>
                <div className="grading-page__progress"><span>학생 채점 완료</span><strong>{completedStudents}/{worksheet.students.length}</strong><div><i style={{ width: `${(completedStudents / worksheet.students.length) * 100}%` }} /></div></div>
                <button type="button" className="grading-page__save" onClick={() => navigate('/learning/results')}><i className="bi bi-check2" aria-hidden="true" /> 저장하고 나가기</button>
            </header>
            <div className="grading-page__workspace">
                <GradingStudentList students={worksheet.students} selectedId={student.id} onSelect={(studentId) => moveStudent(worksheet.students.findIndex((candidate) => candidate.id === studentId))} />
                <section className="grading-page__answers" aria-label={`${student.name} 학생 전체 답안 채점`}>
                    <div className="grading-page__student-title">
                        <div><span>{student.number}번</span><h1>{student.name}</h1></div>
                        <p>수동 채점 <strong>{studentProgress.completed}/{studentProgress.total}</strong></p>
                    </div>
                    <div className="grading-page__answer-list">
                        {worksheet.questions.map((question) => {
                            const answer = student.answers.find((candidate) => candidate.no === question.no);
                            return <GradingAnswerCard key={question.no} student={student} answer={answer} question={question} rubricChecks={deriveRubricChecks(answer, question)} onScore={(score) => updateScore(question.no, score)} onRubric={(rubricIndex) => toggleRubric(question, rubricIndex)} />;
                        })}
                    </div>
                    <nav className="grading-page__navigation" aria-label="학생 이동"><button type="button" disabled={studentIndex === 0} onClick={() => moveStudent(studentIndex - 1)}><i className="bi bi-chevron-left" /> 이전 학생</button><span>{studentIndex + 1} / {worksheet.students.length}</span><button type="button" disabled={studentIndex === worksheet.students.length - 1} onClick={() => moveStudent(studentIndex + 1)}>다음 학생 <i className="bi bi-chevron-right" /></button></nav>
                </section>
            </div>
        </main>
    );
}

export default GradingPage;
