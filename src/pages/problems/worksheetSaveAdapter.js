const gradeValues = {
    'middle-1': 1,
    'middle-2': 2,
    'middle-3': 3,
};

const questionTypeValues = {
    MULTIPLE_CHOICE: 'choice',
    SHORT_INPUT: 'short',
    ESSAY: 'essay',
    choice: 'choice',
    short: 'short',
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
    semester,
    problems,
    supports,
    origin = 'manual',
    sourceAssignmentId,
}) => ({
    title,
    type,
    origin,
    grade: gradeValues[gradeId],
    semester,
    ...(sourceAssignmentId == null ? {} : { sourceAssignmentId: Number(sourceAssignmentId) }),
    genSpec: buildGenerationSpec(problems),
    items: problems.map((problem, index) => ({
        questionId: Number(problem.id),
        displayOrder: index + 1,
        supportMode: supports[problem.id],
        ...(problem.stage ? { customStage: problem.stage } : {}),
    })),
});
