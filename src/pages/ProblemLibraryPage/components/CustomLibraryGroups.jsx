function CustomLibraryGroups({ worksheets, onOpen }) {
    const groups = Object.values(worksheets.reduce((acc, worksheet) => {
        const key = worksheet.custom.sourceWorksheetId;
        if (!acc[key]) acc[key] = { title: worksheet.custom.sourceTitle, items: [] };
        acc[key].items.push(worksheet);
        return acc;
    }, {}));

    return <div className="custom-library-groups">{groups.map((group) => <section className="custom-library-group" key={group.title}><header><div><span>원본 학습지</span><h2>{group.title}</h2></div><strong>{group.items.length}명</strong></header><div className="custom-library-group__rows">{group.items.map((worksheet) => <button type="button" key={worksheet.id} onClick={() => onOpen(worksheet.id)}><span><strong>{worksheet.custom.studentName}</strong><small>{worksheet.custom.weakConcept}</small></span><span className="custom-library-group__stages">되짚기 {worksheet.custom.stageCounts.retrace} · 기본 {worksheet.custom.stageCounts.basic} · 스스로 {worksheet.custom.stageCounts.independent}</span><span>{worksheet.createdAt}</span><span className="library-status library-status--assigned">배정 완료</span><i className="bi bi-chevron-right" aria-hidden="true" /></button>)}</div></section>)}</div>;
}

export default CustomLibraryGroups;
