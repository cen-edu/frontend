import { useEffect, useMemo, useState } from 'react';
import { PracticeProblemView, StudentSupportPreview } from '../../../../components/common/worksheets';
import { customStageLabels, difficultyLabels } from '../../../../mocks/labels.js';
import {
    getCustomGenerationErrorMessage,
    normalizeCustomGenerationSlots,
} from '../customGenerationAdapter.js';
import CustomAssignBar from './CustomAssignBar.jsx';

const jobStatusLabels = {
    QUEUED: '생성 대기 중',
    RUNNING: '문제 생성 중',
    COMPLETED: '생성 완료',
    PARTIALLY_FAILED: '일부 문제 생성 완료',
    FAILED: '생성 실패',
};

const slotStatusLabels = {
    QUEUED: '대기 중',
    GENERATING_CONTENT: '문항 생성 중',
    GENERATING_ASSET: '자료 생성 중',
    VALIDATING: '구조 확인 중',
    VERIFYING: '품질 확인 중',
    READY: '완료',
    FAILED: '실패',
};

const responseStageKeys = {
    review: 'retrace',
    similar: 'basic',
    advanced: 'independent',
};

function CustomGenerationResult({
    job,
    configs,
    student,
    isPending,
    error,
    initialWorksheetTitle,
    assignment,
    isSaving,
    isAssigning,
    assignmentError,
    assignmentDisabledReason,
    onAssign,
    onRetry,
    onBack,
}) {
    const problems = useMemo(
        () => normalizeCustomGenerationSlots(job?.slots, configs),
        [configs, job?.slots],
    );
    const [selectedProblemId, setSelectedProblemId] = useState('');
    const selectedProblemIndex = problems.findIndex((problem) => problem.id === selectedProblemId);
    const selectedProblem = problems[selectedProblemIndex] ?? problems[0] ?? null;
    const failedSlots = (job?.slots ?? []).filter((slot) => slot.status === 'FAILED');
    const totalCount = job?.totalCount ?? 0;
    const completedCount = job?.completedCount ?? (job?.status === 'COMPLETED' ? totalCount : 0);
    const progress = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;
    const isTerminal = ['COMPLETED', 'PARTIALLY_FAILED', 'FAILED'].includes(job?.status);

    useEffect(() => {
        if (!problems.length) {
            setSelectedProblemId('');
            return;
        }
        if (!problems.some((problem) => problem.id === selectedProblemId)) {
            setSelectedProblemId(problems[0].id);
        }
    }, [problems, selectedProblemId]);

    const movePreview = (offset) => {
        const currentIndex = problems.findIndex((problem) => problem.id === selectedProblem?.id);
        const nextProblem = problems[currentIndex + offset];
        if (nextProblem) setSelectedProblemId(nextProblem.id);
    };

    return <section className="custom-problem-result" aria-labelledby="custom-problem-result-title">
        <header className="custom-problem-result__header">
            <div>
                <h2 id="custom-problem-result-title">{isTerminal ? '맞춤 문제 생성 결과' : '맞춤 문제 생성 중'}</h2>
                <p>{student?.name ?? '선택한 학생'} 학생 · {jobStatusLabels[job?.status] ?? '생성 작업 확인 중'}</p>
            </div>
            <div className="custom-problem-result__actions">
                <button type="button" className="custom-problem-result__secondary-button" disabled={isSaving || isAssigning} onClick={onBack}>문항 구성으로 돌아가기</button>
            </div>
        </header>
        <div className="custom-problem-result__progress" aria-label={`문제 생성 진행률 ${progress}%`}>
            <div><span style={{ width: `${progress}%` }} /></div>
            <strong>{completedCount}/{totalCount}문항</strong>
        </div>

        {error ? <div className="custom-problem-result__state custom-problem-result__state--error" role="alert">
            <i className="bi bi-exclamation-circle" aria-hidden="true" />
            <strong>생성 상태를 불러오지 못했습니다.</strong>
            <p>{getCustomGenerationErrorMessage(error)}</p>
            <button type="button" onClick={onRetry}>다시 조회</button>
        </div> : !isTerminal || isPending ? <div className="custom-problem-result__state" role="status" aria-live="polite">
            <i className="bi bi-arrow-repeat custom-problem-result__spinner" aria-hidden="true" />
            <strong>{jobStatusLabels[job?.status] ?? '생성 작업을 확인하고 있습니다.'}</strong>
            <p>완료된 문항부터 순서대로 준비하고 있습니다. 다음 상태를 기다리고 있습니다.</p>
            {(job?.slots ?? []).length > 0 && <ol className="custom-problem-result__slots">
                {[...job.slots].sort((left, right) => left.slotIndex - right.slotIndex).map((slot) => <li key={slot.itemId ?? slot.slotIndex}>
                    <span>{slot.slotIndex}번 · {customStageLabels[responseStageKeys[slot.customStage]] ?? '맞춤'}</span>
                    <strong className={`custom-problem-result__slot-status custom-problem-result__slot-status--${slot.status?.toLowerCase()}`}>{slotStatusLabels[slot.status] ?? slot.status}</strong>
                </li>)}
            </ol>}
        </div> : problems.length === 0 ? <div className="custom-problem-result__state custom-problem-result__state--error" role="alert">
            <i className="bi bi-exclamation-circle" aria-hidden="true" />
            <strong>미리볼 수 있는 문제가 없습니다.</strong>
            <p>{failedSlots[0]?.errorCode ? `실패 코드: ${failedSlots[0].errorCode}` : '문항 구성을 조정해 다시 생성해 주세요.'}</p>
        </div> : <>
            {failedSlots.length > 0 && <p className="custom-problem-result__notice" role="status">
                <i className="bi bi-exclamation-triangle" aria-hidden="true" /> 전체 {totalCount}문항 중 {failedSlots.length}문항을 생성하지 못했습니다. 완료된 {problems.length}문항을 먼저 확인할 수 있습니다.
            </p>}
            <div className="custom-problem-result__student-preview">
                <div className="custom-problem-result__student-preview-content">
                    <PracticeProblemView
                        problem={selectedProblem}
                        answerMode="answer"
                        headingId="custom-preview-problem-title"
                        difficultyText={`${customStageLabels[selectedProblem?.stage] ?? '맞춤'} · 난이도 ${difficultyLabels[selectedProblem?.difficulty] ?? '-'}`}
                        footer={<footer className="custom-problem-result__preview-controls">
                            <button type="button" disabled={selectedProblemIndex <= 0} onClick={() => movePreview(-1)}>
                                <i className="bi bi-chevron-left" aria-hidden="true" /> 이전 학습
                            </button>
                            <span>{Math.max(selectedProblemIndex + 1, 1)}/{problems.length}문항</span>
                            <button type="button" className="custom-problem-result__preview-next" disabled={selectedProblemIndex >= problems.length - 1} onClick={() => movePreview(1)}>
                                다음 학습 <i className="bi bi-chevron-right" aria-hidden="true" />
                            </button>
                        </footer>}
                    />
                </div>
                <StudentSupportPreview
                    value="chat"
                    concept={selectedProblem?.concept}
                    studentName={student?.name ?? ''}
                    selectable={false}
                />
            </div>
            <CustomAssignBar
                student={student}
                initialTitle={initialWorksheetTitle}
                assignment={assignment}
                isSaving={isSaving}
                isAssigning={isAssigning}
                error={assignmentError}
                disabledReason={assignmentDisabledReason}
                onAssign={(values) => onAssign({ ...values, problems })}
            />
        </>}
    </section>;
}

export default CustomGenerationResult;
