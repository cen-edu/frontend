import { useMutation } from '@tanstack/react-query';
import { generateAssessmentProblems } from '../../api/problems/assessmentGenerationApi.js';
import {
    buildAssessmentGenerationItems,
    normalizeGeneratedAssessmentProblems,
} from './assessmentGenerationAdapter.js';

export const useAssessmentGenerationMutation = () => useMutation({
    mutationFn: async (groups) => {
        const items = buildAssessmentGenerationItems(groups);
        const problems = await generateAssessmentProblems({ items });

        if (!problems?.length) {
            throw new Error('생성된 평가 문항이 없습니다. 출제 구성을 확인한 뒤 다시 시도해 주세요.');
        }

        return normalizeGeneratedAssessmentProblems(problems);
    },
});
