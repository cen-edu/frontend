// 학생앱 채점 결과·해설 화면의 데이터.
// 학생이 실제로 푼 문제(studentWorksheetSolving)에 채점 결과를 얹어 만들고,
// 문항 판정 규칙은 교사용 채점(assessmentResult)과 같은 셀렉터를 사용한다.
import { getPracticeQuestionResult, practiceWrongInputs } from './assessmentResult';
import { getStudentCustomProblems, getStudentPracticeProblems, getStudentWorksheetProblems } from './studentWorksheetSolving';

// 개념 챗봇 문맥에서 쓰는 개념 키. 소단원 id를 챗봇 시나리오 개념으로 옮긴다.
const chatConceptIdByUnit = { 'm1s1-prime-factor': 'prime', 'm1s1-gcd-lcm': 'common' };

// 일반 학습·맞춤 학습은 학습지별로 학생이 틀린 필기 입력 칸(blank)만 지정하고 나머지는 정답으로 본다.
const practiceWrongBlanks = {
    'integer-practice': ['gcd-answer', 'conclusion-answer'],
    'equation-practice': ['divide-answer', 'factor-answer', 'answer'],
    'function-practice': ['common-factor-answer'],
    'statistics-practice': [],
};

// 종합 평가는 틀린 문항 번호와 서술형 채점 기준 충족 여부를 지정하고,
// 그 결과의 점수 합이 학습지에 저장된 총점(score)과 같아야 한다.
const assessmentOutcomes = {
    'integer-assessment': { wrongNumbers: [9], rubricSatisfied: [true, true] },
    'probability-assessment': { wrongNumbers: [6], rubricSatisfied: [false, true] },
    'quadratic-assessment': { wrongNumbers: [], rubricSatisfied: [true, false] },
};

// 자동 채점이 오답으로 본 문항에 채워 넣을 학생 답안. 실제 연동에서는 필기 인식 결과가 내려온다.
const assessmentWrongInputs = {
    1: '9',
    2: '2 × 18',
    3: '2, 3, 5',
    4: '6',
    5: '270',
    6: '48',
    8: '15',
    9: '3',
    10: '5',
};

// 서술형은 채점 기준 충족 조합에 따라 학생이 쓴 답안이 달라진다.
const essayAnswers = {
    'true,true': '84 = 2² × 3 × 7, 60 = 2² × 3 × 5이므로 최대공약수는 12이다. 따라서 한 변의 길이는 12cm이고 (84 ÷ 12) × (60 ÷ 12) = 7 × 5 = 35개가 만들어진다.',
    'true,false': '84 = 2² × 3 × 7, 60 = 2² × 3 × 5이므로 두 수의 최대공약수는 12이다.',
    'false,true': '한 변의 길이는 12cm이고 정사각형은 모두 35개가 만들어진다.',
    'false,false': '가로와 세로를 반으로 나누면 되므로 한 변의 길이는 42cm이다.',
};

const essayEvidences = ['84 = 2² × 3 × 7, 60 = 2² × 3 × 5이므로 최대공약수는 12', '(84 ÷ 12) × (60 ÷ 12) = 7 × 5 = 35개'];

const getAssessmentResultKey = (score, maxScore) => {
    if (score >= maxScore) return 'correct';
    return score > 0 ? 'partial' : 'wrong';
};

// 풀이 과정 한 줄을 정답으로 채운 문자열. 해설의 단계별 풀이에 사용한다.
const getStepFormula = (step) => step.segments
    .map((segment) => (segment.type === 'blank' ? segment.answer : segment.value))
    .join(' ');

const buildPracticeQuestions = (problems, wrongBlankIds) => problems.map((problem, index) => {
    const steps = problem.steps.map((step) => ({
        ...step,
        segments: step.segments.map((segment) => {
            if (segment.type !== 'blank') return { ...segment };
            const correct = !wrongBlankIds.includes(segment.id);
            return {
                ...segment,
                correct,
                input: correct ? segment.answer : practiceWrongInputs[segment.id] ?? '풀이 미완성',
            };
        }),
    }));
    const blanks = steps.flatMap((step) => step.segments.filter((segment) => segment.type === 'blank'));

    return {
        ...problem,
        no: index + 1,
        steps,
        result: getPracticeQuestionResult({ blanks }),
        chatContext: [{
            conceptId: chatConceptIdByUnit[problem.steps[0]?.conceptId] ?? 'common',
            conceptLabel: problem.concept.title,
            unitId: problem.steps[0]?.conceptId,
        }],
        explanation: {
            answerText: blanks.map((blank) => blank.answer).join(' · '),
            summary: problem.explanation,
            steps: steps.map((step, stepIndex) => ({
                id: step.id,
                label: step.label ?? `풀이 과정 ${stepIndex + 1}`,
                instruction: step.instruction,
                formula: getStepFormula(step),
            })),
            concept: problem.concept,
        },
    };
});

const buildAssessmentQuestions = (outcome) => {
    const { wrongNumbers = [], rubricSatisfied = [true, true] } = outcome;

    return getStudentWorksheetProblems().map((problem) => {
        const isEssay = problem.format === 'essay';
        const rubricResults = isEssay
            ? problem.rubric.map((item, index) => ({
                ...item,
                satisfied: rubricSatisfied[index] ?? false,
                evidence: rubricSatisfied[index] ? essayEvidences[index] ?? '' : '',
            }))
            : [];
        const isWrong = wrongNumbers.includes(problem.no);
        const score = isEssay
            ? rubricResults.reduce((sum, item) => sum + (item.satisfied ? item.score : 0), 0)
            : (isWrong ? 0 : problem.maxScore);
        const input = isEssay
            ? essayAnswers[rubricResults.map((item) => item.satisfied).join(',')]
            : (isWrong ? assessmentWrongInputs[problem.no] ?? '' : problem.answer);

        return {
            ...problem,
            input,
            score,
            rubricResults,
            result: getAssessmentResultKey(score, problem.maxScore),
            chatContext: [{
                conceptId: chatConceptIdByUnit[problem.unitId] ?? 'common',
                conceptLabel: problem.prompt,
                unitId: problem.unitId,
            }],
            explanation: {
                answerText: problem.answer,
                summary: problem.explanation,
            },
        };
    });
};

const countResults = (questions, key) => questions.filter((question) => question.result === key).length;

// 학습지 하나에 대한 학생 본인의 채점 결과와 해설.
// 채점이 끝나지 않은(resultReady: false) 학습지는 호출하는 화면에서 먼저 걸러 낸다.
export const getStudentWorksheetReview = (assignment) => {
    const isAssessment = assignment.type === 'assessment';
    const questions = isAssessment
        ? buildAssessmentQuestions(assessmentOutcomes[assignment.id] ?? {})
        : buildPracticeQuestions(
            assignment.origin === 'custom' ? getStudentCustomProblems(assignment.id) : getStudentPracticeProblems(assignment.id),
            practiceWrongBlanks[assignment.id] ?? [],
        );

    return {
        questions,
        summary: {
            type: isAssessment ? 'assessment' : 'practice',
            totalCount: questions.length,
            correctCount: countResults(questions, 'correct'),
            partialCount: countResults(questions, 'partial'),
            wrongCount: countResults(questions, 'wrong'),
            score: isAssessment ? questions.reduce((sum, question) => sum + question.score, 0) : null,
            maxScore: isAssessment ? questions.reduce((sum, question) => sum + question.maxScore, 0) : null,
        },
    };
};
