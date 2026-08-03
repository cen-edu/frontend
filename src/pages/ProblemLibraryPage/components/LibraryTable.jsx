import { libraryTypeLabels } from '../../../mocks/problemLibrary';

function LibraryTable({ worksheets, onOpen, onAssign, onDuplicate, onDelete }) {
    return <div className="library-table__scroll"><table className="library-table"><thead><tr><th>제목</th><th>유형</th><th>출제 범위</th><th className="library-table__number">문항</th><th>생성일</th><th>출제 상태</th><th><span className="library-sr-only">동작</span></th></tr></thead>
        <tbody>{worksheets.map((worksheet) => <tr key={worksheet.id} tabIndex={0} onClick={() => onOpen(worksheet.id)} onKeyDown={(event) => { if (event.key === 'Enter') onOpen(worksheet.id); }}>
            <td><strong>{worksheet.title}</strong></td><td><span className={`library-type-badge library-type-badge--${worksheet.origin === 'custom' ? 'custom' : worksheet.type}`}>{libraryTypeLabels[worksheet.origin === 'custom' ? 'custom' : worksheet.type]}</span></td><td>{worksheet.unitSummary}</td><td className="library-table__number">{worksheet.problemCount}문항{worksheet.totalScore ? ` · ${worksheet.totalScore}점` : ''}</td><td>{worksheet.createdAt}</td><td><span className={`library-status library-status--${worksheet.assignments.length ? 'assigned' : 'draft'}`}>{worksheet.assignments.length ? `출제 ${worksheet.assignments.length}회` : '미출제'}</span></td>
            <td><div className="library-table__actions">{worksheet.origin !== 'custom' && <button type="button" className="library-table__primary-action" aria-label={`${worksheet.title} 출제`} onClick={(event) => { event.stopPropagation(); onAssign(worksheet); }}>출제</button>}<button type="button" aria-label={`${worksheet.title} 복제 후 재구성`} title="복제 후 재구성" onClick={(event) => { event.stopPropagation(); onDuplicate(worksheet); }}><i className="bi bi-copy" aria-hidden="true" /></button><button type="button" className="library-table__delete" aria-label={`${worksheet.title} 삭제`} title="삭제" onClick={(event) => { event.stopPropagation(); onDelete(worksheet); }}><i className="bi bi-trash3" aria-hidden="true" /></button></div></td>
        </tr>)}</tbody></table></div>;
}

export default LibraryTable;
