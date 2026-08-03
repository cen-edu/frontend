import { customUnitIndex } from './customCreation';

const scenarios = [
    { keywords: ['소인수분해', '소인수'], conceptId: 'prime', reply: '소인수분해는 합성수를 소수인 인수들의 곱으로 나타내는 방법입니다. 작은 소수부터 차례로 나누고, 같은 소수는 거듭제곱으로 묶어 보세요.' },
    { keywords: ['최대공약수', '공통소인수', '공통 소인수', 'gcd'], conceptId: 'common', reply: '최대공약수는 두 수에 공통으로 들어 있는 소인수의 작은 지수를 골라 곱합니다. 먼저 두 수를 각각 소인수분해하면 공통 부분이 잘 보입니다.' },
    { keywords: ['지수', '최소공배수', 'lcm'], conceptId: 'exponent', reply: '최소공배수는 두 수에 나타난 모든 소인수를 모으고, 각 소인수의 큰 지수를 골라 곱합니다. 최대공약수의 작은 지수 규칙과 구분해 보세요.' },
];

export function getConceptChatReply(message, context = []) {
    const normalized = message.trim().toLowerCase();
    const scenario = scenarios.find((item) => item.keywords.some((keyword) => normalized.includes(keyword.toLowerCase())));
    if (!scenario) return { text: '해당 개념을 찾지 못했습니다. 단원명이나 궁금한 풀이 단계를 포함해 다시 질문해 주세요.', relatedUnitIds: [] };
    const unitId = context.find((concept) => concept.conceptId === scenario.conceptId)?.unitId;
    return { text: scenario.reply, relatedUnitIds: unitId && customUnitIndex.has(unitId) ? [unitId] : [] };
}

export function getRecommendedQuestions(context = []) {
    return context.slice(0, 3).map((concept) => {
        if (concept.conceptId === 'common') return '최대공약수에서 작은 지수를 고르는 이유는?';
        if (concept.conceptId === 'exponent') return '최소공배수의 지수는 어떻게 고르나요?';
        if (concept.conceptId === 'prime') return '소인수분해 순서를 알려 주세요';
        return `${concept.conceptLabel}의 핵심 원리는 무엇인가요?`;
    });
}
