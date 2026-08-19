import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { teacherProgressStatusLabels as resultStatusLabels, worksheetTypeLabels } from '../../../../mocks/labels';

const weakAccuracyThreshold = 60;

const columns = [
    { key: 'name', label: '학생', direction: 'ascending' },
    { key: 'participation', label: '학습 진행', direction: 'ascending' },
    { key: 'accuracy', label: '누적 정답률', direction: 'ascending' },
];

const filters = [
    { key: 'all', label: '전체', match: () => true },
    { key: 'overdue', label: '미제출 지연', match: (student) => student.status === 'overdue' },
    { key: 'weak', label: '보완 필요', match: (student) => student.status === 'weak' },
    { key: 'steady', label: '양호', match: (student) => student.status === 'steady' },
    { key: 'noData', label: '자료 부족', match: (student) => student.status === 'noData' },
];

const accuracyLevel = (accuracy) => (accuracy < weakAccuracyThreshold ? 'critical' : accuracy < 75 ? 'warning' : 'good');

const cellState = (result) => {
    if (result.status === 'unassigned') return 'unassigned';
    if (result.status !== 'submitted') return result.overdue ? 'overdue' : 'waiting';
    return result.accuracy === null ? 'grading' : accuracyLevel(result.accuracy);
};

const cellDescription = (result) => {
    const type = `${worksheetTypeLabels[result.type]}${result.origin === 'custom' ? ' · 맞춤' : ''}`;
    const prefix = `${result.orderLabel}. ${result.title} · ${type}`;
    if (result.status === 'unassigned') return `${prefix} · 미배정`;
    if (result.status !== 'submitted') return `${prefix} · ${resultStatusLabels[result.status]}${result.overdue ? ' · 기한 초과' : ''}`;
    if (result.accuracy === null) return `${prefix} · 채점 대기`;
    return `${prefix} · ${result.type === 'assessment' ? `${result.score}점` : `정답률 ${result.accuracy}%`}`;
};

function ClassStudentProgress({ students, worksheets }) {
    const navigate = useNavigate();
    const [filterKey, setFilterKey] = useState('all');
    const [sort, setSort] = useState({ key: 'accuracy', direction: 'ascending' });

    const counts = useMemo(() => Object.fromEntries(filters.map((filter) => [filter.key, students.filter(filter.match).length])), [students]);

    const rows = useMemo(() => {
        const matched = students.filter(filters.find((filter) => filter.key === filterKey).match);

        return [...matched].sort((first, second) => {
            const firstValue = first[sort.key];
            const secondValue = second[sort.key];
            if (firstValue === null) return 1;
            if (secondValue === null) return -1;
            const result = typeof firstValue === 'string' ? firstValue.localeCompare(secondValue, 'ko') : firstValue - secondValue;
            return sort.direction === 'ascending' ? result : -result;
        });
    }, [filterKey, sort, students]);

    const changeSort = (column) => setSort((current) => ({
        key: column.key,
        direction: current.key === column.key ? (current.direction === 'ascending' ? 'descending' : 'ascending') : column.direction,
    }));

    const openStudent = (student) => navigate(`/learning/weaknesses/students/${student.id}`);

    return (
        <section className="dashboard-section" aria-labelledby="class-progress-title">
            <div className="dashboard-section__header">
                <div>
                    <h2 id="class-progress-title">학생별 학습 현황</h2>
                    <p>
                        {worksheets.length === 0
                            ? `재적 ${students.length}명 기준입니다.`
                            : `이번 학기에 배정한 학습지 ${worksheets.length}개를 학생별로 누적한 값입니다. 학생을 선택하면 개인 취약점 분석으로 이동합니다.`}
                    </p>
                </div>
                {worksheets.length > 0 && (
                    <div className="student-progress__filters" role="group" aria-label="학생 상태 필터">
                        {filters.map((filter) => (
                            <button
                                key={filter.key}
                                type="button"
                                aria-pressed={filterKey === filter.key}
                                className={`student-progress__chip${filterKey === filter.key ? ' student-progress__chip--active' : ''}`}
                                onClick={() => setFilterKey(filter.key)}
                            >
                                {filter.label} <b>{counts[filter.key]}</b>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {students.length === 0
                ? <p className="dashboard-empty">등록된 학생이 없습니다.</p>
                : worksheets.length === 0
                    ? <p className="dashboard-empty">이번 학기에 배정한 학습지가 없습니다.</p>
                : <>
                    <div className="student-progress__table-wrap">
                        <table className="student-progress__table">
                            <thead>
                                <tr>
                                    {columns.map((column) => {
                                        const active = sort.key === column.key;
                                        return (
                                            <th
                                                key={column.key}
                                                scope="col"
                                                aria-sort={active ? sort.direction : 'none'}
                                            >
                                                <button type="button" onClick={() => changeSort(column)}>
                                                    <span>{column.label}</span>
                                                    <i className={`bi ${active ? (sort.direction === 'ascending' ? 'bi-arrow-up' : 'bi-arrow-down') : 'bi-arrow-down-up'}`} aria-hidden="true" />
                                                </button>
                                            </th>
                                        );
                                    })}
                                    <th scope="col" className="student-progress__heading--left">학습지별 결과</th>
                                    <th scope="col">최근 학습</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((student) => (
                                    <tr key={student.id} onClick={() => openStudent(student)}>
                                        <td className="student-progress__cell--center">
                                            <button type="button" className="student-progress__name" onClick={(event) => { event.stopPropagation(); openStudent(student); }}>
                                                <strong>{student.name}</strong>
                                            </button>
                                        </td>
                                        <td className="student-progress__cell--center">
                                            <span className="student-progress__count">{student.submittedCount}<small> / {student.assignedCount}</small></span>
                                            <span className="student-progress__track"><span className="student-progress__bar" style={{ width: `${student.participation}%` }} /></span>
                                        </td>
                                        <td className="student-progress__cell--center">
                                            {student.accuracy === null
                                                ? <span className="student-progress__none">자료 없음</span>
                                                : <span className={`student-progress__accuracy student-progress__accuracy--${accuracyLevel(student.accuracy)}`}>{student.accuracy}%</span>}
                                        </td>
                                        <td>
                                            <span className="worksheet-strip">
                                                {student.results.map((result) => (
                                                    <span
                                                        key={result.worksheetId}
                                                        className={`worksheet-strip__cell worksheet-strip__cell--${cellState(result)}`}
                                                        title={cellDescription(result)}
                                                        aria-label={cellDescription(result)}
                                                    >
                                                        {result.orderLabel}
                                                    </span>
                                                ))}
                                            </span>
                                        </td>
                                        <td className="student-progress__cell--center">{student.lastActivity ?? <span className="student-progress__none">-</span>}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {rows.length === 0 && <p className="dashboard-empty">해당 상태의 학생이 없습니다.</p>}
                    </div>

                    <div className="worksheet-strip__legend">
                        <span>학습지별 결과</span>
                        <span><i className="worksheet-strip__dot worksheet-strip__dot--good" />정답률 75% 이상</span>
                        <span><i className="worksheet-strip__dot worksheet-strip__dot--warning" />60~74%</span>
                        <span><i className="worksheet-strip__dot worksheet-strip__dot--critical" />60% 미만</span>
                        <span><i className="worksheet-strip__dot worksheet-strip__dot--grading" />채점 대기</span>
                        <span><i className="worksheet-strip__dot worksheet-strip__dot--overdue" />기한 초과</span>
                        <span><i className="worksheet-strip__dot worksheet-strip__dot--waiting" />미제출·풀이 중</span>
                        <span><i className="worksheet-strip__dot worksheet-strip__dot--unassigned" />미배정</span>
                    </div>
                </>}
        </section>
    );
}

export default ClassStudentProgress;
