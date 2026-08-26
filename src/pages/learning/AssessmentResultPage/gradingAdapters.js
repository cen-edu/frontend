const byDisplayOrder = (left, right) => (
    (left.displayOrder ?? 0) - (right.displayOrder ?? 0)
);

const formatDate = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(date).replaceAll(' ', '').replace(/\.$/, '');
};

const normalizeContentBlocks = (blocks = []) => [...blocks]
    .sort(byDisplayOrder)
    .map((block) => ({
        ...block,
        blockKind: block.blockKind?.toLowerCase(),
        asset: block.imageUrl ? {
            url: block.imageUrl,
            altText: block.text || '문항 참고 자료',
        } : undefined,
    }));

const getPrompt = (blocks) => blocks
    .filter((block) => block.blockKind === 'text')
    .map((block) => block.text || block.markup)
    .filter(Boolean)
    .join('\n');

const normalizeCustomLearning = (customLearning, parentWorksheet) => {
    if (!customLearning) return null;

    return {
        ...customLearning,
        students: [...(customLearning.students ?? [])]
            .sort((left, right) => (left.displayNumber ?? 0) - (right.displayNumber ?? 0))
            .map((student) => ({
            ...student,
            sessions: [...(student.sessions ?? [])]
                .sort((left, right) => (left.sessionNumber ?? 0) - (right.sessionNumber ?? 0))
                .map((session) => ({
                ...session,
                id: String(session.assignmentId),
                origin: 'custom',
                className: parentWorksheet.className,
                studentId: student.studentId,
                studentName: student.name,
                studentDisplayNumber: student.displayNumber,
                assignedAt: formatDate(session.assignedAt),
                })),
            })),
    };
};

export const normalizeGradingWorksheet = (worksheet) => ({
    ...worksheet,
    id: String(worksheet.assignmentId),
    assignedAt: formatDate(worksheet.assignedAt),
    customLearning: normalizeCustomLearning(worksheet.customLearning, worksheet),
});

export const normalizeScoreTable = (scoreTable) => {
    const questions = [...(scoreTable.questions ?? [])]
        .sort(byDisplayOrder)
        .map((question) => ({
            ...question,
            id: question.worksheetItemId,
            no: question.displayOrder,
        }));

    return {
        ...scoreTable,
        id: String(scoreTable.assignmentId),
        questions,
        students: (scoreTable.students ?? []).map((student) => ({
            ...student,
            id: student.assignmentStudentId,
            number: student.studentNumber,
            name: student.name,
            graded: student.gradingComplete,
            answers: questions.map((question) => {
                const cell = student.cells?.find((item) => item.worksheetItemId === question.worksheetItemId);
                return {
                    ...cell,
                    no: question.no,
                    score: cell?.score ?? null,
                };
            }),
        })),
    };
};

const normalizeRubric = (rubric = []) => rubric.map((item) => ({
    id: item.rubricItemId,
    label: item.description,
    score: Number(item.weight),
    satisfied: item.satisfied === true,
    evidence: item.evidence,
}));

const normalizePracticeItem = (item, contentBlocks, prompt) => {
    // TODO(API): 채점 상세에 steps가 추가되면 학생 풀이 화면과 동일한 단계/수식 구조를 사용한다.
    // 현재는 answerUnits만으로 칸별 판정 기능을 유지하는 대체 단계를 구성한다.
    const units = [...(item.answerUnits ?? [])].sort(byDisplayOrder);
    return {
        ...item,
        id: item.worksheetItemId,
        no: item.displayOrder,
        title: '풀이 문제',
        prompt: prompt || '문제의 발문을 확인하세요.',
        contentBlocks,
        steps: units.map((unit, index) => ({
            id: `grading-step-${item.worksheetItemId}-${unit.answerUnitId}`,
            label: `풀이 과정 ${index + 1}`,
            instruction: '학생 답안과 정답을 비교해 판정합니다.',
            segments: [{
                type: 'blank',
                id: String(unit.answerUnitId),
                answer: unit.correctAnswer,
            }],
        })),
    };
};

const normalizeAssessmentItem = (item, contentBlocks, prompt) => {
    const unit = [...(item.answerUnits ?? [])].sort(byDisplayOrder)[0];
    // TODO(API): 미판정/자동채점 실패 서술형에도 rubric 기준 목록이 내려오면 루브릭 체크 UI를 사용한다.
    // 현재 빈 배열이면 서버가 허용하는 직접 점수 입력으로 채점한다.
    const rubric = normalizeRubric(unit?.rubric ?? []);
    return {
        ...item,
        id: item.worksheetItemId,
        no: item.displayOrder,
        prompt: prompt || '문제의 발문을 확인하세요.',
        contentBlocks,
        choices: [...(item.choices ?? [])].sort(byDisplayOrder).map((choice) => ({
            id: choice.choiceId,
            text: choice.text,
            displayOrder: choice.displayOrder,
        })),
        answer: unit?.correctAnswer ?? '',
        correctChoiceId: unit?.correctChoiceId ?? null,
        rubric,
        gradingStatus: unit?.gradedBy === 'auto' ? 'auto' : 'pending',
    };
};

const normalizePracticeAnswer = (item) => ({
    no: item.displayOrder,
    blanks: [...(item.answerUnits ?? [])].sort(byDisplayOrder).map((unit) => ({
        submissionAnswerId: unit.submissionAnswerId,
        stepId: `grading-step-${item.worksheetItemId}-${unit.answerUnitId}`,
        blankId: String(unit.answerUnitId),
        input: unit.studentAnswer,
        answerImage: unit.handwritingUrl,
        autoCorrect: Number(unit.autoScore) > 0,
        correct: Number(unit.finalScore) > 0,
        gradedBy: unit.gradedBy,
        gradingStatus: unit.gradingStatus,
    })),
});

const normalizeAssessmentAnswer = (item) => {
    const unit = [...(item.answerUnits ?? [])].sort(byDisplayOrder)[0];
    const rubric = normalizeRubric(unit?.rubric ?? []);
    return {
        no: item.displayOrder,
        submissionAnswerId: unit?.submissionAnswerId,
        input: unit?.studentAnswer,
        selectedChoiceId: unit?.selectedChoiceId ?? null,
        answerImage: unit?.handwritingUrl,
        score: unit?.finalScore ?? null,
        autoScore: unit?.autoScore ?? null,
        gradedBy: unit?.gradedBy,
        gradingStatus: unit?.gradingStatus,
        rubricChecks: rubric.map((entry) => entry.satisfied),
        rubricResults: rubric.map((entry) => ({
            satisfied: entry.satisfied,
            evidence: entry.evidence,
        })),
    };
};

export const mergeStudentDetail = (worksheet, detail) => {
    const items = [...(detail.items ?? [])].sort(byDisplayOrder);
    const questions = items.map((item) => {
        const contentBlocks = normalizeContentBlocks(item.contentBlocks);
        const prompt = getPrompt(contentBlocks);
        return worksheet.type === 'practice'
            ? normalizePracticeItem(item, contentBlocks, prompt)
            : normalizeAssessmentItem(item, contentBlocks, prompt);
    });
    const detailStudent = worksheet.students.find((student) => (
        student.assignmentStudentId === detail.assignmentStudentId
    ));
    const student = {
        ...detailStudent,
        id: detail.assignmentStudentId,
        name: detail.studentName,
        number: detail.studentNumber,
        totalScore: detail.totalScore,
        answers: items.map((item) => worksheet.type === 'practice'
            ? normalizePracticeAnswer(item)
            : normalizeAssessmentAnswer(item)),
    };

    return { ...worksheet, questions, currentStudent: student };
};
