import { useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ConceptChatPanel, ReviewResultStrip } from '../../../components/common/worksheets';
import Header from '../../../components/Header/Header';
import { questionResultLabels } from '../../../mocks/labels';
import { getStudentAssignments } from '../../../mocks/studentAssignments';
import { getStudentWorksheetReview } from '../../../mocks/studentWorksheetReview';
import students from '../../../mocks/students';
import AssessmentReviewCard from './components/AssessmentReviewCard';
import PracticeReviewCard from './components/PracticeReviewCard';
import ReviewExplanation from './components/ReviewExplanation';
import './StudentReviewPage.scss';

function StudentReviewPage() {
    const navigate = useNavigate();
    const { assignmentId } = useParams();
    const [searchParams] = useSearchParams();
    const requestedStudentId = Number(searchParams.get('student'));
    const student = students.find((item) => item.id === requestedStudentId) ?? students[0];
    const assignments = useMemo(() => getStudentAssignments(student.id), [student.id]);
    const assignment = assignments.find((item) => item.id === assignmentId) ?? assignments[0];
    const isReady = assignment.status === 'submitted' && Boolean(assignment.resultReady);
    const review = useMemo(() => (isReady ? getStudentWorksheetReview(assignment) : null), [assignment, isReady]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const question = review?.questions[currentIndex];
    const isAssessment = assignment.type === 'assessment';
    const isCustom = assignment.origin === 'custom';
    const worksheetsPath = `/student/worksheets?student=${student.id}`;

    const moveToQuestion = (index) => {
        setCurrentIndex(index);
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    };

    return (
        <div className="student-review">
            <Header mode="student" userName={student.name} />
            <main className="student-review__main">
                <header className="student-review__worksheet-header">
                    <button type="button" className="student-review__back" onClick={() => navigate(worksheetsPath)}>
                        <i className="bi bi-chevron-left" aria-hidden="true" /> 학습지 목록
                    </button>
                    <div className="student-review__title-group">
                        <h1>{assignment.title}</h1>
                        <span>{assignment.submittedAt ? `${assignment.submittedAt} 제출` : '제출 완료'}</span>
                    </div>
                    <span className="student-review__badge">채점 결과</span>
                </header>

                {!isReady ? (
                    <section className="student-review__notice" aria-live="polite">
                        <i className="bi bi-hourglass-split" aria-hidden="true" />
                        <h2>아직 채점 중이에요</h2>
                        <p>선생님이 채점을 마치면 문항별 결과와 해설을 볼 수 있어요.</p>
                        <button type="button" onClick={() => navigate(worksheetsPath)}>학습지 목록으로</button>
                    </section>
                ) : (
                    <>
                        <ReviewResultStrip
                            summary={review.summary}
                            questions={review.questions}
                            currentIndex={currentIndex}
                            onSelect={moveToQuestion}
                        />

                        <div className="student-review__workspace">
                            <div className="student-review__content">
                                {isAssessment ? (
                                    <AssessmentReviewCard question={question} />
                                ) : (
                                    <PracticeReviewCard question={question} isCustom={isCustom} />
                                )}

                                <ReviewExplanation question={question} />

                                <footer className="student-review__controls">
                                    <button type="button" disabled={currentIndex === 0} onClick={() => moveToQuestion(currentIndex - 1)}>
                                        <i className="bi bi-chevron-left" aria-hidden="true" /> 이전 문항
                                    </button>
                                    <span>{question.no} / {review.questions.length}문항 · {questionResultLabels[question.result]}</span>
                                    <button
                                        type="button"
                                        className="student-review__next"
                                        disabled={currentIndex === review.questions.length - 1}
                                        onClick={() => moveToQuestion(currentIndex + 1)}
                                    >
                                        다음 문항 <i className="bi bi-chevron-right" aria-hidden="true" />
                                    </button>
                                </footer>
                            </div>

                            <ConceptChatPanel
                                mode="student"
                                title="학습 도우미"
                                description="해설을 봐도 잘 모르겠다면 질문하세요."
                                studentName={student.name}
                                welcomeMessage={`${question.no}번 문항의 해설을 함께 보고 있어요. 어느 부분이 이해되지 않는지 알려 주면 그 단계부터 다시 설명해 줄게요.`}
                                context={question.chatContext}
                            />
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

export default StudentReviewPage;
