import { useMutation } from '@tanstack/react-query';
import { generatePracticeProblems } from '../../api/problems/problemGenerationApi.js';
import { buildProblemGenerationItems, normalizeGeneratedProblems } from './problemGenerationAdapter.js';

export const useProblemGenerationMutation = () => useMutation({
    mutationFn: async (configs) => {
        const items = buildProblemGenerationItems(configs);
        const problems = await generatePracticeProblems({ items });

        if (!problems?.length) {
            throw new Error('생성된 문제가 없습니다. 출제 구성을 확인한 뒤 다시 시도해 주세요.');
        }

        return normalizeGeneratedProblems(problems);
    },
});
