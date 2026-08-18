export function getRecommendedQuestions(context = []) {
    return context.slice(0, 3).map((concept) => {
        if (concept.conceptId === 'common') return '최대공약수에서 작은 지수를 고르는 이유는?';
        if (concept.conceptId === 'exponent') return '최소공배수의 지수는 어떻게 고르나요?';
        if (concept.conceptId === 'prime') return '소인수분해 순서를 알려 주세요';
        return `${concept.conceptLabel}의 핵심 원리는 무엇인가요?`;
    });
}
