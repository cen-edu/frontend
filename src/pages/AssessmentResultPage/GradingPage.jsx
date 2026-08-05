import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getAssessmentResults, isPracticeStudentGraded, saveAssessmentResults } from '../../mocks/assessmentResult';
import { worksheetTypeLabels } from '../../mocks/labels';
import GradingAnswerCard from './components/GradingAnswerCard';
import GradingStudentList from './components/GradingStudentList';
import PracticeGradingCard from './components/PracticeGradingCard';
import './GradingPage.scss';
import './components/AssessmentResultComponents.scss';

const deriveRubricChecks = (answer, question) => {
    if (answer?.rubricChecks?.length === question.rubric.length) return answer.rubricChecks;
    if (answer?.rubricResults?.length === question.rubric.length) return answer.rubricResults.map((result) => result.satisfied === true);
    let accumulated = 0;
    return question.rubric.map((item) => {
        accumulated += item.score;
        return (answer?.score ?? 0) >= accumulated;
    });
};

const isScored = (student) => student.answers.every((answer) => answer.score !== null);

function GradingPage() {
    const navigate = useNavigate();
    const { worksheetId } = useParams();
    const [searchParams] = useSearchParams();
    const [results, setResults] = useState(getAssessmentResults);
    const worksheet = results.find((item) => item.id === worksheetId);
    const isPractice = worksheet?.type === 'practice';
    // 종합 평가는 모든 문항에 점수가 매겨지면, 일반 학습은 교사가 확인을 마치면 완료로 본다.
    const isComplete = isPractice ? isPracticeStudentGraded : isScored;
    const requestedStudent = searchParams.get('student');
    const requestedIndex = worksheet?.students.findIndex((student) => String(student.id) === requestedStudent);
    const firstPendingIndex = worksheet?.students.findIndex((student) => !isComplete(student));
    const [studentIndex, setStudentIndex] = useState(requestedIndex >= 0 ? requestedIndex : Math.max(firstPendingIndex ?? 0, 0));
    const student = worksheet?.students[studentIndex];

    // 채점 결과를 학생 한 명 기준으로 바꾸고 학습지 전체의 채점 상태를 다시 계산한다.
    const updateStudent = (updateAnswers, extra = {}) => {
        setResults((current) => {
            const next = current.map((item) => {
                if (item.id !== worksheet.id) return item;
                const nextStudents = item.students.map((candidate, index) => index !== studentIndex ? candidate : {
                    ...candidate,
                    ...extra,
                    answers: updateAnswers(candidate, item),
                });
                const allComplete = nextStudents.every(isComplete);
                return {
                    ...item,
                    students: nextStudents,
                    status: allComplete ? (item.status === 'confirmed' ? 'confirmed' : 'graded') : 'grading',
                    modified: item.status === 'confirmed' ? true : item.modified,
                };
            });
            saveAssessmentResults(next);
            return next;
        });
    };

    const updateScore = (questionNo, score, selectedRubricChecks) => {
        updateStudent((candidate, item) => {
            const question = item.questions.find((entry) => entry.no === questionNo);
            return candidate.answers.map((answer) => {
                if (answer.no !== questionNo) return answer;
                const rubricChecks = selectedRubricChecks ?? (answer.score === score ? deriveRubricChecks(answer, question) : deriveRubricChecks({ score }, question));
                return {
                    ...answer,
                    score,
                    gradedBy: 'teacher',
                    rubricChecks,
                    rubricResults: question.rubric.map((_, rubricIndex) => ({
                        ...(answer.rubricResults?.[rubricIndex] ?? {}),
                        satisfied: rubricChecks[rubricIndex] === true,
                    })),
                };
            });
        });
    };

    const toggleRubric = (question, rubricIndex) => {
        const answer = student.answers.find((candidate) => candidate.no === question.no);
        const currentChecks = deriveRubricChecks(answer, question);
        const nextChecks = currentChecks.map((checked, index) => index === rubricIndex ? !checked : checked);
        const score = question.rubric.reduce((sum, item, index) => sum + (nextChecks[index] ? item.score : 0), 0);
        updateScore(question.no, score, nextChecks);
    };

    // 일반 학습은 점수 대신 풀이 칸 하나의 정답 여부만 바꾼다.
    const markBlank = (questionNo, blankId, correct) => {
        updateStudent((candidate) => candidate.answers.map((answer) => answer.no !== questionNo ? answer : {
            ...answer,
            blanks: answer.blanks.map((blank) => blank.blankId !== blankId ? blank : {
                ...blank,
                correct,
                gradedBy: correct === blank.autoCorrect ? 'auto' : 'teacher',
            }),
        }));
    };

    if (!worksheet || !student) {
        return <main className="grading-page grading-page--missing"><div><p>채점할 학습을 찾을 수 없습니다.</p><button type="button" onClick={() => navigate('/learning/results')}>평가 결과로 돌아가기</button></div></main>;
    }

    const completedStudents = worksheet.students.filter(isComplete).length;
    const moveStudent = (nextIndex) => {
        setStudentIndex(Math.min(Math.max(nextIndex, 0), worksheet.students.length - 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const completeGrading = () => {
        // 일반 학습은 점수가 없어 이 버튼을 눌러야 해당 학생의 채점이 끝난 것으로 기록된다.
        if (isPractice) updateStudent((candidate) => candidate.answers, { graded: true });
        if (studentIndex < worksheet.students.length - 1) {
            moveStudent(studentIndex + 1);
            return;
        }
        navigate('/learning/results');
    };

    return (
        <main className="grading-page">
            <header className="grading-page__header">
                <button type="button" className="grading-page__back" aria-label="평가 결과로 돌아가기" onClick={() => navigate('/learning/results')}><i className="bi bi-chevron-left" /></button>
                <div><strong>{worksheet.title}</strong><span>{worksheet.className} · {worksheetTypeLabels[worksheet.type]}</span></div>
                <div className="grading-page__progress"><span>학생 채점 완료</span><strong>{completedStudents}/{worksheet.students.length}</strong><div><i style={{ width: `${(completedStudents / worksheet.students.length) * 100}%` }} /></div></div>
                <button type="button" className="grading-page__save" onClick={() => navigate('/learning/results')}><i className="bi bi-check2" aria-hidden="true" /> 저장하고 나가기</button>
            </header>
            <div className="grading-page__workspace">
                <GradingStudentList students={worksheet.students} selectedId={student.id} isComplete={isComplete} onSelect={(studentId) => moveStudent(worksheet.students.findIndex((candidate) => candidate.id === studentId))} />
                <section className="grading-page__answers" aria-label={`${student.name} 학생 전체 답안 채점`}>
                    <div className="grading-page__student-title">
                        <div><span>{student.number}번</span><h1>{student.name}</h1></div>
                        <button type="button" className="grading-page__complete" onClick={completeGrading}>채점 완료</button>
                    </div>
                    <div className="grading-page__answer-list">
                        {worksheet.questions.map((question) => {
                            const answer = student.answers.find((candidate) => candidate.no === question.no);
                            return isPractice
                                ? <PracticeGradingCard key={question.no} student={student} answer={answer} question={question} onMark={(blankId, correct) => markBlank(question.no, blankId, correct)} />
                                : <GradingAnswerCard key={question.no} student={student} answer={answer} question={question} rubricChecks={deriveRubricChecks(answer, question)} onScore={(score) => updateScore(question.no, score)} onRubric={(rubricIndex) => toggleRubric(question, rubricIndex)} />;
                        })}
                    </div>
                    <nav className="grading-page__navigation" aria-label="학생 이동"><button type="button" disabled={studentIndex === 0} onClick={() => moveStudent(studentIndex - 1)}><i className="bi bi-chevron-left" /> 이전 학생</button><span>{studentIndex + 1} / {worksheet.students.length}</span><button type="button" disabled={studentIndex === worksheet.students.length - 1} onClick={() => moveStudent(studentIndex + 1)}>다음 학생 <i className="bi bi-chevron-right" /></button></nav>
                </section>
            </div>
        </main>
    );
}

export default GradingPage;
