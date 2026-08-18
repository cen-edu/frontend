import {
    ConceptChatPanel,
    PracticeConceptView,
} from '../../../components/common/worksheets';

const unavailableConcept = {
    title: '개념 설명',
    summary: 'API 수정 후 재연동 필요',
    points: [],
};

function StudentLearningSupport({ problem, studentName }) {
    if (problem.supportMode === 'chat') {
        return (
            <ConceptChatPanel
                mode="student"
                title="학습 도우미"
                description="문제를 풀다 막히면 질문하세요."
                studentName={studentName}
                welcomeMessage={`${problem.no}번 문제를 풀고 있어요. 정답을 바로 알려주기보다 필요한 개념과 다음 풀이 방향을 함께 찾아볼게요.`}
                context={[{
                    subUnitId: problem.subUnitId,
                    conceptLabel: problem.concept?.title ?? '문제 관련 개념',
                }]}
            />
        );
    }

    return <PracticeConceptView concept={problem.concept ?? unavailableConcept} />;
}

export default StudentLearningSupport;
