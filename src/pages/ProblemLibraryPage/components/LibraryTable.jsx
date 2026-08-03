import { Fragment, useState } from 'react';
import { libraryTypeLabels } from '../../../mocks/problemLibrary';

function LibraryTable({ worksheets, allWorksheets, defaultExpandAll = false, onOpen, onAssign, onDuplicate, onDelete }) {
    const sourceWorksheets = allWorksheets.filter((worksheet) => worksheet.origin !== 'custom');
    const visibleIds = new Set(worksheets.map((worksheet) => worksheet.id));
    const visibleCustomWorksheets = worksheets.filter((worksheet) => worksheet.origin === 'custom');
    const groups = sourceWorksheets.map((source) => ({
        source,
        children: visibleCustomWorksheets.filter((worksheet) => worksheet.custom?.sourceWorksheetId === source.id),
        sourceVisible: visibleIds.has(source.id),
    })).filter((group) => group.sourceVisible || group.children.length);
    const groupedCustomIds = new Set(groups.flatMap((group) => group.children.map((worksheet) => worksheet.id)));
    const standaloneWorksheets = worksheets.filter((worksheet) => worksheet.origin === 'custom' && !groupedCustomIds.has(worksheet.id));
    const expandableSourceIds = groups.filter((group) => group.children.length).map((group) => group.source.id);
    const [expandedSources, setExpandedSources] = useState(() => new Set(defaultExpandAll ? expandableSourceIds : []));

    const toggleSource = (sourceId) => {
        setExpandedSources((current) => {
            const next = new Set(current);
            if (next.has(sourceId)) next.delete(sourceId);
            else next.add(sourceId);
            return next;
        });
    };

    const renderActions = (worksheet) => <div className="library-table__actions">
        {worksheet.origin !== 'custom' && <button type="button" className="library-table__primary-action" aria-label={`${worksheet.title} 출제`} onClick={(event) => { event.stopPropagation(); onAssign(worksheet); }}>출제</button>}
        <button type="button" aria-label={`${worksheet.title} 복제 후 재구성`} title="복제 후 재구성" onClick={(event) => { event.stopPropagation(); onDuplicate(worksheet); }}><i className="bi bi-copy" aria-hidden="true" /></button>
        <button type="button" className="library-table__delete" aria-label={`${worksheet.title} 삭제`} title="삭제" onClick={(event) => { event.stopPropagation(); onDelete(worksheet); }}><i className="bi bi-trash3" aria-hidden="true" /></button>
    </div>;

    const renderRow = (worksheet, { children = [], child = false, context = false } = {}) => {
        const expanded = expandedSources.has(worksheet.id);
        const kind = worksheet.origin === 'custom' ? 'custom' : worksheet.type;
        return <tr key={worksheet.id} className={`${child ? 'library-table__row--child' : 'library-table__row--source'}${context ? ' library-table__row--context' : ''}`} tabIndex={0} onClick={() => onOpen(worksheet.id)} onKeyDown={(event) => { if (event.target === event.currentTarget && event.key === 'Enter') onOpen(worksheet.id); }}>
            <td><div className="library-table__title-cell">
                {children.length ? <button type="button" className="library-table__disclosure" aria-expanded={expanded} aria-label={`${worksheet.title}의 맞춤 문제 ${expanded ? '접기' : '펼치기'}`} onClick={(event) => { event.stopPropagation(); toggleSource(worksheet.id); }}><i className={`bi bi-chevron-${expanded ? 'down' : 'right'}`} aria-hidden="true" /></button> : <span className="library-table__disclosure-placeholder" aria-hidden="true" />}
                <span className="library-table__title-text"><strong>{worksheet.title}</strong>{child && worksheet.custom && <small>{worksheet.custom.studentName} · {worksheet.custom.weakConcept}</small>}</span>
                {children.length > 0 && <span className="library-table__custom-count">맞춤 {children.length}</span>}
            </div></td>
            <td><span className={`library-type-badge library-type-badge--${kind}`}>{libraryTypeLabels[kind]}</span></td><td>{worksheet.unitSummary}</td><td className="library-table__number">{worksheet.problemCount}문항{worksheet.totalScore ? ` · ${worksheet.totalScore}점` : ''}</td><td>{worksheet.createdAt}</td><td><span className={`library-status library-status--${worksheet.assignments.length ? 'assigned' : 'draft'}`}>{worksheet.assignments.length ? `출제 ${worksheet.assignments.length}회` : '미출제'}</span></td>
            <td>{renderActions(worksheet)}</td>
        </tr>;
    };

    return <div className="library-table__scroll"><table className="library-table"><colgroup><col className="library-table__column-title" /><col className="library-table__column-type" /><col className="library-table__column-scope" /><col className="library-table__column-count" /><col className="library-table__column-date" /><col className="library-table__column-status" /><col className="library-table__column-actions" /></colgroup><thead><tr><th>제목</th><th>유형</th><th>출제 범위</th><th className="library-table__number">문항</th><th>생성일</th><th>출제 상태</th><th className="library-table__action-heading"><span className="library-sr-only">동작</span></th></tr></thead>
        <tbody>{groups.map(({ source, children, sourceVisible }) => <Fragment key={source.id}>{renderRow(source, { children, context: !sourceVisible })}{children.length > 0 && expandedSources.has(source.id) && children.map((worksheet) => renderRow(worksheet, { child: true }))}</Fragment>)}{standaloneWorksheets.map((worksheet) => renderRow(worksheet, { child: true }))}</tbody></table></div>;
}

export default LibraryTable;
