import { Link } from 'react-router-dom';
function GradingNotice({ count, excludedCount = count }) {
    if (!count) return null;
    return <div className="grading-notice" role="status"><i className="bi bi-pencil-square" aria-hidden="true" /><span><strong>{count}명 채점 대기 중.</strong> 지표에서 채점 대기 {excludedCount}건을 제외했습니다.</span><Link to="/learning/results">채점하러 가기 <i className="bi bi-arrow-right" /></Link></div>;
}
export default GradingNotice;
