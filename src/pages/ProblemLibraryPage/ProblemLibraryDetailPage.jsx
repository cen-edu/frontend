import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AssessmentQuestionView from '../../components/common/ProblemViewer/AssessmentQuestionView';
import PracticeProblemView from '../../components/common/PracticeProblemView/PracticeProblemView';
import StudentSupportPreview from '../../components/common/StudentSupportPreview/StudentSupportPreview';
import { customStageLabels, defaultSupportModes, difficultyLabels } from '../../mocks/labels';
import { getLibraryWorksheets } from '../../mocks/problemLibrary';
import QuestionExplanationModal from './components/QuestionExplanationModal';
import './ProblemLibraryPage.scss';
import './components/LibraryComponents.scss';

function ProblemLibraryDetailPage() {
    const { worksheetId } = useParams();
    const worksheet = getLibraryWorksheets().find((item) => item.id === worksheetId);
    const [selectedProblemId, setSelectedProblemId] = useState(worksheet?.problems[0]?.id ?? '');
    const [explanationOpen, setExplanationOpen] = useState(false);

    if (!worksheet) return <section className="problem-library-detail problem-library-detail--missing"><h1>학습지를 찾을 수 없습니다.</h1><Link to="/problems/library">보관함으로 돌아가기</Link></section>;
    const selectedProblem = worksheet.problems.find((item) => item.id === selectedProblemId) ?? worksheet.problems[0];
    const selectedProblemIndex = worksheet.problems.findIndex((item) => item.id === selectedProblem?.id);
    const previewProgress = worksheet.problems.length ? Math.round(((selectedProblemIndex + 1) / worksheet.problems.length) * 100) : 0;
    const isAssessment = worksheet.type === 'assessment';
    const isCustom = worksheet.origin === 'custom';
    // 보관함은 조회 화면이라 선택 UI 없이, 학생에게 보여줄 자료만 그대로 표시한다.
    const selectedSupport = isCustom ? defaultSupportModes.custom : isAssessment ? defaultSupportModes.assessment : defaultSupportModes.practice;
    const movePreview = (offset) => {
        const nextProblem = worksheet.problems[selectedProblemIndex + offset];
        if (nextProblem) setSelectedProblemId(nextProblem.id);
    };

    const previewControls = (
        <footer className="problem-library-detail__preview-controls">
            <button type="button" disabled={selectedProblemIndex === 0} onClick={() => movePreview(-1)}>
                <i className="bi bi-chevron-left" aria-hidden="true" /> {isAssessment ? '이전 문항' : '이전 학습'}
            </button>
            <span>{isAssessment ? '문항과 정답, 채점 기준을 확인합니다.' : isCustom ? `${customStageLabels[selectedProblem.stage]} 단계 문제를 확인합니다.` : '문제의 풀이 과정과 개념 설명을 확인합니다.'}</span>
            <button type="button" className="problem-library-detail__preview-next" disabled={selectedProblemIndex === worksheet.problems.length - 1} onClick={() => movePreview(1)}>
                {isAssessment ? '다음 문항' : '다음 학습'} <i className="bi bi-chevron-right" aria-hidden="true" />
            </button>
        </footer>
    );

    return <section className="problem-library-detail" aria-labelledby="library-detail-title">
        <h1 id="library-detail-title" className="library-sr-only">{worksheet.title}</h1>
        <div className="problem-library-detail__workspace">
            <section className="problem-library-detail__section problem-library-detail__section--preview" aria-labelledby="preview-title">
                <header><div><h2 id="preview-title">문항 미리보기</h2><p>학생 화면과 같은 순서로 문제와 정답을 확인합니다.</p></div><div className="problem-library-detail__preview-actions"><Link className="library-button problem-library-detail__previous-button" to="/problems/library"> 이전</Link><button type="button" className="library-button library-button--primary" onClick={() => setExplanationOpen(true)}><i className="bi bi-journal-text" aria-hidden="true" /> 해설 보기</button></div></header>
                <div className="problem-library-detail__preview-progress" aria-label={`미리보기 진행률 ${previewProgress}%`}>
                    <div><span style={{ width: `${previewProgress}%` }} /></div>
                    <strong>{selectedProblemIndex + 1}/{worksheet.problems.length}문항</strong>
                </div>
                <div className="problem-library-detail__student-preview">
                    <div className="problem-library-detail__student-preview-content">
                        {isAssessment ? <div className="problem-library-detail__question-preview"><AssessmentQuestionView problem={selectedProblem} />{previewControls}</div> : (
                            <PracticeProblemView
                                problem={selectedProblem}
                                answerMode="answer"
                                headingId="library-preview-problem-title"
                                difficultyText={isCustom ? `${customStageLabels[selectedProblem.stage]} · 난이도 ${difficultyLabels[selectedProblem.difficulty]}` : undefined}
                                footer={previewControls}
                            />
                        )}
                        <StudentSupportPreview
                            selectable={false}
                            value={selectedSupport}
                            concept={selectedProblem.concept}
                            conceptHeadingId="library-preview-concept-title"
                        />
                    </div>
                </div>
            </section>
            <aside className="problem-library-detail__section problem-library-detail__section--history" aria-labelledby="history-title"><header><div><h2 id="history-title">출제 이력</h2><p>반별 출제일과 제출 기한을 확인합니다.</p></div></header>{worksheet.assignments.length ? <div className="problem-library-detail__history"><ul>{worksheet.assignments.map((assignment, index) => <li key={`${assignment.classId}-${index}`}><div className="problem-library-detail__history-heading"><strong>{assignment.className}</strong><span className="library-status library-status--assigned">{assignment.status === 'completed' ? '종료' : '진행 중'}</span></div><dl><div><dt>출제일</dt><dd>{assignment.assignedAt}</dd></div><div><dt>제출 기한</dt><dd>{assignment.dueAt}</dd></div></dl><Link to={`/learning?worksheet=${worksheet.id}`}>학습 현황 <i className="bi bi-arrow-right" aria-hidden="true" /></Link></li>)}</ul></div> : <p className="problem-library-detail__no-history">아직 출제하지 않았습니다.</p>}</aside>
        </div>
        {explanationOpen && <QuestionExplanationModal problem={selectedProblem} isAssessment={isAssessment} onClose={() => setExplanationOpen(false)} />}
    </section>;
}

export default ProblemLibraryDetailPage;
