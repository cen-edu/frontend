import { useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getAuth } from '../../../api/auth/authStorage.js';
import { ConceptChatPanel, ReviewResultStrip } from '../../../components/common/worksheets';
import Header from '../../../components/Header/Header';
import { questionResultLabels } from '../../../mocks/labels';
import {
    useStudentAssignmentQuery,
    useStudentAssignmentResultQuery,
} from '../studentAssignmentHooks.js';
import { adaptStudentReview } from '../studentWorksheetAdapters.js';
import AssessmentReviewCard from './components/AssessmentReviewCard';
import PracticeReviewCard from './components/PracticeReviewCard';
import ReviewExplanation from './components/ReviewExplanation';
import './StudentReviewPage.scss';

function StudentReviewPage() {
    const navigate = useNavigate();
    const { assignmentId } = useParams();
    const [searchParams] = useSearchParams();
    const assignmentStudentId = Number(assignmentId);
    const studentQuery = searchParams.get('student');
    const querySuffix = studentQuery ? `?student=${encodeURIComponent(studentQuery)}` : '';
    const worksheetsPath = `/student/worksheets${querySuffix}`;
    const auth = getAuth();
    const studentName = auth?.name ?? '학생';
    const detailQuery = useStudentAssignmentQuery(assignmentStudentId);
    const resultQuery = useStudentAssignmentResultQuery(assignmentStudentId);
    const [currentIndex, setCurrentIndex] = useState(0);

    const review = useMemo(() => (
        detailQuery.data && resultQuery.data
            ? adaptStudentReview(resultQuery.data, detailQuery.data)
            : null
    ), [detailQuery.data, resultQuery.data]);
    const question = review?.questions[currentIndex];
    const isAssessment = review?.type === 'assessment';
    const isCustom = detailQuery.data?.origin === 'custom';
    const error = detailQuery.error || resultQuery.error;
    const resultNotReleased = error?.code === 'WORKSHEET_RESULT_NOT_RELEASED';

    const moveToQuestion = (index) => {
        setCurrentIndex(index);
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    };

    const renderNotice = () => {
        if (resultNotReleased) {
            return (
                <section className="student-review__notice" aria-live="polite">
                    <i className="bi bi-hourglass-split" aria-hidden="true" />
                    <h2>아직 채점 중이에요</h2>
                    <p>선생님이 채점을 마치면 문항별 결과와 해설을 볼 수 있어요.</p>
                    <button type="button" onClick={() => navigate(worksheetsPath)}>학습지 목록으로</button>
                </section>
            );
        }

        return (
            <section className="student-review__notice" role={error ? 'alert' : undefined} aria-live="polite">
                <i className={`bi bi-${error ? 'exclamation-circle' : 'hourglass-split'}`} aria-hidden="true" />
                <h2>{error ? '결과를 불러오지 못했어요' : '채점 결과를 불러오는 중이에요'}</h2>
                {error && <p>{error.message}</p>}
                {error && <button type="button" onClick={() => navigate(worksheetsPath)}>학습지 목록으로</button>}
            </section>
        );
    };

    return (
        <div className="student-review">
            <Header mode="student" userName={studentName} />
            <main className="student-review__main">
                <header className="student-review__worksheet-header">
                    <button type="button" className="student-review__back" onClick={() => navigate(worksheetsPath)}>
                        <i className="bi bi-chevron-left" aria-hidden="true" /> 학습지 목록
                    </button>
                    <div className="student-review__title-group">
                        <h1>{review?.title ?? detailQuery.data?.title ?? '채점 결과'}</h1>
                        <span>{review?.gradedAt ? `${new Intl.DateTimeFormat('ko-KR').format(new Date(review.gradedAt))} 채점` : '제출 완료'}</span>
                    </div>
                    <span className="student-review__badge">채점 결과</span>
                </header>

                {!review || !question ? renderNotice() : (
                    <>
                        <ReviewResultStrip summary={review.summary} questions={review.questions} currentIndex={currentIndex} onSelect={moveToQuestion} />
                        <div className="student-review__workspace">
                            <div className="student-review__content">
                                {isAssessment ? <AssessmentReviewCard question={question} /> : <PracticeReviewCard question={question} isCustom={isCustom} />}
                                <ReviewExplanation question={question} />
                                <footer className="student-review__controls">
                                    <button type="button" disabled={currentIndex === 0} onClick={() => moveToQuestion(currentIndex - 1)}><i className="bi bi-chevron-left" aria-hidden="true" /> 이전 문항</button>
                                    <span>{question.no} / {review.questions.length}문항 · {questionResultLabels[question.result]}</span>
                                    <button type="button" className="student-review__next" disabled={currentIndex === review.questions.length - 1} onClick={() => moveToQuestion(currentIndex + 1)}>다음 문항 <i className="bi bi-chevron-right" aria-hidden="true" /></button>
                                </footer>
                            </div>
                            <ConceptChatPanel mode="student" title="학습 도우미" description="해설을 봐도 잘 모르겠다면 질문하세요." studentName={studentName} welcomeMessage={`${question.no}번 문항의 해설을 함께 보고 있어요. 어느 부분이 이해되지 않는지 알려 주면 그 단계부터 다시 설명해 줄게요.`} context={question.chatContext} />
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

export default StudentReviewPage;
