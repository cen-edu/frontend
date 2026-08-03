import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AssessmentPreviewList from '../../components/common/ProblemViewer/AssessmentPreviewList';
import AssessmentQuestionView from '../../components/common/ProblemViewer/AssessmentQuestionView';
import ProblemPreviewList from '../../components/common/ProblemViewer/ProblemPreviewList';
import ProblemStepView from '../../components/common/ProblemViewer/ProblemStepView';
import { getLibraryWorksheets, libraryTypeLabels, removeLibraryWorksheet, updateLibraryWorksheet } from '../../mocks/problemLibrary';
import AssignWorksheetModal from './components/AssignWorksheetModal';
import DeleteWorksheetModal from './components/DeleteWorksheetModal';
import './ProblemLibraryPage.scss';
import './components/LibraryComponents.scss';

function ProblemLibraryDetailPage() {
    const { worksheetId } = useParams();
    const navigate = useNavigate();
    const source = getLibraryWorksheets().find((item) => item.id === worksheetId);
    const [worksheet, setWorksheet] = useState(source);
    const [selectedProblemId, setSelectedProblemId] = useState(source?.problems[0]?.id ?? '');
    const [showAnswers, setShowAnswers] = useState(true);
    const [assignOpen, setAssignOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editingTitle, setEditingTitle] = useState(false);
    const [titleDraft, setTitleDraft] = useState(source?.title ?? '');
    const [notice, setNotice] = useState('');

    if (!worksheet) return <section className="problem-library-detail problem-library-detail--missing"><h1>학습지를 찾을 수 없습니다.</h1><Link to="/problems/library">보관함으로 돌아가기</Link></section>;
    const selectedProblem = worksheet.problems.find((item) => item.id === selectedProblemId) ?? worksheet.problems[0];
    const isAssessment = worksheet.type === 'assessment';
    const duplicatePath = `${isAssessment ? '/problems/comprehensive' : '/problems'}?from=${worksheet.id}`;
    const saveTitle = () => { const next = titleDraft.trim(); if (next) { setWorksheet(updateLibraryWorksheet(worksheet.id, (current) => ({ ...current, title: next }))); setEditingTitle(false); setNotice('제목을 수정했습니다.'); } };
    const assign = (assignment) => { const assignedAt = new Date().toISOString().slice(0, 10).replaceAll('-', '.'); setWorksheet(updateLibraryWorksheet(worksheet.id, (current) => ({ ...current, assignments: [...current.assignments, { ...assignment, assignedAt, status: 'ongoing' }] }))); setAssignOpen(false); setNotice('학습지를 출제했습니다.'); };

    return <section className="problem-library-detail" aria-labelledby="library-detail-title">
        <Link className="problem-library-detail__back" to="/problems/library"><i className="bi bi-arrow-left" aria-hidden="true" /> 문제 보관함</Link>
        <header className="problem-library-detail__header"><div className="problem-library-detail__title">{editingTitle ? <><h1 id="library-detail-title" className="library-sr-only">{worksheet.title}</h1><div className="problem-library-detail__title-edit"><input value={titleDraft} onChange={(event) => setTitleDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') saveTitle(); if (event.key === 'Escape') setEditingTitle(false); }} aria-label="학습지 제목" autoFocus /><button type="button" onClick={saveTitle}>저장</button><button type="button" onClick={() => setEditingTitle(false)}>취소</button></div></> : <div><h1 id="library-detail-title">{worksheet.title}</h1><button type="button" aria-label="학습지 제목 수정" onClick={() => setEditingTitle(true)}><i className="bi bi-pencil" aria-hidden="true" /></button></div>}<p>{libraryTypeLabels[worksheet.origin === 'custom' ? 'custom' : worksheet.type]} · 1학년 {worksheet.term === 'first' ? '1학기' : '2학기'} · {worksheet.unitSummary} · {worksheet.createdAt} · {worksheet.problemCount}문항{worksheet.totalScore ? ` · ${worksheet.totalScore}점` : ''}</p>{worksheet.custom && <p>{worksheet.custom.studentName} 학생 · 원본 {worksheet.custom.sourceTitle}</p>}</div><div className="problem-library-detail__actions">{worksheet.origin !== 'custom' && <button type="button" className="library-button library-button--primary" onClick={() => setAssignOpen(true)}>출제</button>}<button type="button" className="library-button" onClick={() => navigate(duplicatePath)}><i className="bi bi-copy" aria-hidden="true" /> 복제 후 재구성</button><button type="button" className="library-button library-button--danger" onClick={() => setDeleteOpen(true)}>삭제</button></div></header>
        {notice && <p className="problem-library-detail__notice" role="status"><i className="bi bi-check-circle-fill" aria-hidden="true" /> {notice}</p>}
        <section className="problem-library-detail__section" aria-labelledby="preview-title"><header><div><h2 id="preview-title">문항 미리보기</h2><p>문항을 선택해 문제와 정답을 확인합니다.</p></div><button type="button" className="problem-library-detail__answer-toggle" aria-pressed={showAnswers} onClick={() => setShowAnswers((current) => !current)}><i className={`bi bi-eye${showAnswers ? '' : '-slash'}`} aria-hidden="true" /> 정답 {showAnswers ? '숨기기' : '표시'}</button></header><div className="problem-library-detail__viewer">{isAssessment ? <><AssessmentPreviewList problems={worksheet.problems} selectedId={selectedProblemId} onSelect={setSelectedProblemId} /><AssessmentQuestionView problem={selectedProblem} showAnswers={showAnswers} /></> : <><ProblemPreviewList problems={worksheet.problems} selectedId={selectedProblemId} onSelect={setSelectedProblemId} /><ProblemStepView problem={selectedProblem} showAnswers={showAnswers} /></>}</div></section>
        <section className="problem-library-detail__section" aria-labelledby="history-title"><header><div><h2 id="history-title">출제 이력</h2><p>반별 출제일과 제출 기한을 확인합니다.</p></div></header>{worksheet.assignments.length ? <div className="problem-library-detail__history"><table><thead><tr><th>반</th><th>출제일</th><th>제출 기한</th><th>상태</th><th><span className="library-sr-only">이동</span></th></tr></thead><tbody>{worksheet.assignments.map((assignment, index) => <tr key={`${assignment.classId}-${index}`}><td>{assignment.className}</td><td>{assignment.assignedAt}</td><td>{assignment.dueAt}</td><td><span className="library-status library-status--assigned">{assignment.status === 'completed' ? '종료' : '진행 중'}</span></td><td><Link to={`/learning?worksheet=${worksheet.id}`}>학습 현황</Link></td></tr>)}</tbody></table></div> : <p className="problem-library-detail__no-history">아직 출제하지 않았습니다.</p>}</section>
        {assignOpen && <AssignWorksheetModal worksheet={worksheet} onClose={() => setAssignOpen(false)} onAssign={assign} />}{deleteOpen && <DeleteWorksheetModal worksheet={worksheet} onClose={() => setDeleteOpen(false)} onConfirm={() => { removeLibraryWorksheet(worksheet.id); navigate('/problems/library'); }} />}
    </section>;
}

export default ProblemLibraryDetailPage;
