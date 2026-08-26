const gradeValues = {
    'middle-1': 1,
    'middle-2': 2,
    'middle-3': 3,
};

const semesterValues = {
    1: 'first',
    2: 'second',
    first: 'first',
    second: 'second',
    common: 'common',
};

const questionTypeValues = {
    MULTIPLE_CHOICE: 'choice',
    SHORT_INPUT: 'short',
    STEP_FILL: 'step',
    ESSAY: 'essay',
    choice: 'choice',
    short: 'short',
    step: 'step',
    essay: 'essay',
};

const getQuestionType = (problem) => (
    questionTypeValues[problem.questionType]
    ?? questionTypeValues[problem.format]
    ?? 'short'
);

const buildGenerationSpec = (problems) => {
    const specs = new Map();

    problems.forEach((problem) => {
        const subUnitId = Number(problem.unitId);
        const questionType = getQuestionType(problem);
        const key = `${subUnitId}:${questionType}:${problem.difficulty}`;
        const current = specs.get(key);

        if (current) {
            current.count += 1;
            return;
        }

        specs.set(key, {
            subUnitId,
            questionType,
            difficulty: problem.difficulty,
            count: 1,
        });
    });

    return [...specs.values()];
};

export const buildWorksheetSavePayload = ({
    title,
    type,
    gradeId,
    semester: semesterValues[semester] ?? semester,
    problems,
    supports,
    origin = 'manual',
    sourceAssignmentId,
    parentWorksheetId,
}) => ({
    title,
    type,
    origin,
    grade: gradeValues[gradeId] ?? Number(gradeId),
    semester,
    ...(sourceAssignmentId == null ? {} : { sourceAssignmentId: Number(sourceAssignmentId) }),
    ...(parentWorksheetId == null ? {} : { parentWorksheetId: Number(parentWorksheetId) }),
    genSpec: buildGenerationSpec(problems),
    items: problems.map((problem, index) => ({
        ...(problem.sessionId
            ? { sessionId: Number(problem.sessionId) }
            : { questionId: Number(problem.id) }),
        displayOrder: index + 1,
        supportMode: supports[problem.id],
        ...(type === 'assessment' ? { maxScore: Number(problem.maxScore) } : {}),
        ...(problem.stage ? { customStage: problem.stage } : {}),
    })),
});
