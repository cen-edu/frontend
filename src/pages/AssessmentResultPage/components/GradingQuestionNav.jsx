import { questionResultLabels } from '../../../mocks/labels';
import './GradingQuestionNav.scss';

// 문항 카드 아래에 붙는 이동 줄. 학생 채점 결과 화면의 문항 이동 줄과 같은 모양을 쓴다.
function GradingQuestionNav({ questionNo, currentIndex, total, result, onMove }) {
    return (
        <footer className="grading-question-nav">
            <button type="button" disabled={currentIndex === 0} onClick={() => onMove(currentIndex - 1)}>
                <i className="bi bi-chevron-left" aria-hidden="true" /> 이전 문항
            </button>
            <span>{questionNo} / {total}문항 · {questionResultLabels[result]}</span>
            <button
                type="button"
                className="grading-question-nav__next"
                disabled={currentIndex === total - 1}
                onClick={() => onMove(currentIndex + 1)}
            >
                다음 문항 <i className="bi bi-chevron-right" aria-hidden="true" />
            </button>
        </footer>
    );
}

export default GradingQuestionNav;
