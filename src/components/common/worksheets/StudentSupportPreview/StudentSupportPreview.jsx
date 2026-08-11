import { supportModes } from '../../../../mocks/labels';
import ConceptChatPanel from '../ConceptChatPanel/ConceptChatPanel';
import PracticeConceptView from '../PracticeProblemView/PracticeConceptView';
import './StudentSupportPreview.scss';

// 생성 결과 화면에서 교사가 문제별로 학생에게 보여줄 자료를 고르고, 그 화면을 미리 보는 영역.
function StudentSupportPreview({
    value,
    onChange,
    concept,
    conceptHeadingId,
    studentName = '',
    editMode = false,
    conceptSelected = false,
    onSelectConcept,
    selectable = true,
}) {
    return (
        <div className="student-support-preview">
            {selectable && <>
                <p className="student-support-preview__note"><i className="bi bi-info-circle" aria-hidden="true" /> 선택한 항목만 학생 화면에 표시됩니다.</p>
                <div className="student-support-preview__switch" role="group" aria-label="학생 화면에 함께 보여줄 자료 선택">
                    {supportModes.map((mode) => (
                        <button
                            key={mode.value}
                            type="button"
                            className={value === mode.value ? 'student-support-preview__option student-support-preview__option--active' : 'student-support-preview__option'}
                            aria-pressed={value === mode.value}
                            title={mode.description}
                            onClick={() => onChange(mode.value)}
                        >
                            <i className={`bi ${mode.icon}`} aria-hidden="true" /> {mode.label}
                        </button>
                    ))}
                </div>
            </>}
            {value === 'chat' ? (
                <ConceptChatPanel
                    readOnly
                    mode="student"
                    title="학습 도우미"
                    description="문제를 풀다 막히면 질문하세요."
                    studentName={studentName}
                    welcomeMessage="학생 화면에 표시되는 학습 도우미입니다. 학생은 문제를 푸는 동안 막히는 부분을 질문하고, 정답 대신 필요한 개념과 다음 풀이 방향을 안내받습니다."
                    suggestions={['이 문제는 어떻게 시작하나요?']}
                />
            ) : (
                <PracticeConceptView
                    concept={concept}
                    headingId={conceptHeadingId}
                    editMode={editMode}
                    selected={conceptSelected}
                    onSelect={onSelectConcept}
                />
            )}
        </div>
    );
}

export default StudentSupportPreview;
