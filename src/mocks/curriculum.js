export const curriculumFilterOptions = {
    grades: [
        { value: 'middle-1', label: '1학년' },
        { value: 'middle-2', label: '2학년' },
        { value: 'middle-3', label: '3학년' },
    ],
    subjects: [{ value: 'math', label: '수학' }],
    terms: [
        { value: 'first', label: '1학기' },
        { value: 'second', label: '2학기' },
    ],
};

const concept = (title, summary, points, example) => ({ title, summary, points, example });
const small = (id, name, unitConcept) => ({ id, name, ...(unitConcept ? { concept: unitConcept } : {}) });

export const curriculumUnits = [
    {
        gradeId: 'middle-1', subjectId: 'math', term: 'first',
        majorUnits: [
            {
                id: 'm1s1-major-1', name: '수와 연산', middleUnits: [
                    { id: 'm1s1-mid-1', name: '소인수분해', smallUnits: [
                        small('m1s1-prime-number', '소수와 합성수', concept('소수와 합성수', '자연수는 약수의 개수에 따라 소수와 합성수로 구분할 수 있습니다.', ['소수는 약수가 1과 자기 자신뿐입니다.', '1은 소수도 합성수도 아닙니다.'], '2, 3, 5, 7은 소수입니다.')),
                        small('m1s1-prime-factor', '소인수분해', concept('소인수분해', '합성수를 소수인 인수들의 곱으로 나타내는 방법입니다.', ['거듭제곱을 사용해 간단히 나타냅니다.', '곱셈 순서가 달라도 같은 소인수분해입니다.'], '12 = 2² × 3')),
                        small('m1s1-gcd-lcm', '최대공약수와 최소공배수', concept('최대공약수와 최소공배수', '소인수분해를 이용하면 두 수의 공약수와 공배수를 체계적으로 구할 수 있습니다.', ['공통 소인수의 작은 지수로 최대공약수를 구합니다.', '모든 소인수의 큰 지수로 최소공배수를 구합니다.'], '12와 18의 최대공약수는 6입니다.')),
                    ] },
                    { id: 'm1s1-mid-2', name: '정수와 유리수', smallUnits: [
                        small('m1s1-integer-rational', '정수와 유리수'),
                        small('m1s1-number-line', '수의 대소 관계'),
                        small('m1s1-integer-add-subtract', '정수의 덧셈과 뺄셈', concept('정수의 덧셈과 뺄셈', '부호가 있는 수의 덧셈과 뺄셈은 부호와 절댓값을 함께 살펴 계산합니다.', ['부호가 같으면 절댓값을 더합니다.', '뺄셈은 빼는 수의 부호를 바꾸어 덧셈으로 계산합니다.'], '(-3) + 7 = 4')),
                        small('m1s1-integer-multiply-divide', '정수의 곱셈과 나눗셈'),
                    ] },
                ],
            },
            {
                id: 'm1s1-major-2', name: '문자와 식', middleUnits: [
                    { id: 'm1s1-mid-3', name: '문자의 사용과 식', smallUnits: [
                        small('m1s1-literal-expression', '문자의 사용과 식의 값'),
                        small('m1s1-monomial-polynomial', '일차식과 수의 곱셈·나눗셈'),
                        small('m1s1-linear-expression', '일차식의 덧셈과 뺄셈'),
                    ] },
                    { id: 'm1s1-mid-4', name: '일차방정식', smallUnits: [
                        small('m1s1-equation-basic', '방정식과 그 해'),
                        small('m1s1-linear-equation', '일차방정식의 풀이', concept('일차방정식의 풀이', '등식의 성질을 이용하여 미지수를 한쪽에 모아 해를 구합니다.', ['이항하면 항의 부호가 바뀝니다.', '양변을 미지수의 계수로 나누어 해를 구합니다.'], 'x + 5 = 12이면 x = 7입니다.')),
                        small('m1s1-linear-equation-use', '일차방정식의 활용'),
                    ] },
                ],
            },
            {
                id: 'm1s1-major-3', name: '좌표평면과 그래프', middleUnits: [
                    { id: 'm1s1-mid-5', name: '좌표와 그래프', smallUnits: [small('m1s1-coordinate', '순서쌍과 좌표'), small('m1s1-graph', '그래프')] },
                    { id: 'm1s1-mid-6', name: '정비례와 반비례', smallUnits: [small('m1s1-direct-proportion', '정비례'), small('m1s1-inverse-proportion', '반비례')] },
                ],
            },
        ],
    },
    {
        gradeId: 'middle-1', subjectId: 'math', term: 'second',
        majorUnits: [
            { id: 'm1s2-major-1', name: '기본 도형', middleUnits: [
                { id: 'm1s2-mid-1', name: '기본 도형', smallUnits: [small('m1s2-point-line-plane', '점, 선, 면'), small('m1s2-angle', '각'), small('m1s2-position', '위치 관계')] },
                { id: 'm1s2-mid-2', name: '작도와 합동', smallUnits: [small('m1s2-construction', '삼각형의 작도'), small('m1s2-congruence', '삼각형의 합동')] },
            ] },
            { id: 'm1s2-major-2', name: '평면도형과 입체도형', middleUnits: [
                { id: 'm1s2-mid-3', name: '평면도형의 성질', smallUnits: [small('m1s2-polygon', '다각형'), small('m1s2-circle-sector', '원과 부채꼴')] },
                { id: 'm1s2-mid-4', name: '입체도형의 성질', smallUnits: [small('m1s2-polyhedron', '다면체와 회전체'), small('m1s2-solid-measure', '입체도형의 겉넓이와 부피')] },
            ] },
            { id: 'm1s2-major-3', name: '통계', middleUnits: [
                { id: 'm1s2-mid-5', name: '자료의 정리와 해석', smallUnits: [small('m1s2-frequency-table', '도수분포표'), small('m1s2-histogram', '히스토그램과 도수분포다각형'), small('m1s2-relative-frequency', '상대도수')] },
            ] },
        ],
    },
    {
        gradeId: 'middle-2', subjectId: 'math', term: 'first',
        majorUnits: [
            { id: 'm2s1-major-1', name: '수와 식', middleUnits: [
                { id: 'm2s1-mid-1', name: '유리수와 순환소수', smallUnits: [small('m2s1-rational-decimal', '유리수와 소수'), small('m2s1-repeating-decimal', '순환소수')] },
                { id: 'm2s1-mid-2', name: '식의 계산', smallUnits: [small('m2s1-exponent-law', '지수법칙'), small('m2s1-polynomial', '다항식의 계산')] },
            ] },
        ],
    },
    {
        gradeId: 'middle-2', subjectId: 'math', term: 'second',
        majorUnits: [{ id: 'm2s2-major-1', name: '도형의 성질', middleUnits: [{ id: 'm2s2-mid-1', name: '삼각형의 성질', smallUnits: [small('m2s2-isosceles', '이등변삼각형'), small('m2s2-right-triangle', '직각삼각형의 합동')] }] }],
    },
    {
        gradeId: 'middle-3', subjectId: 'math', term: 'first',
        majorUnits: [{ id: 'm3s1-major-1', name: '실수와 그 계산', middleUnits: [{ id: 'm3s1-mid-1', name: '제곱근과 실수', smallUnits: [small('m3s1-square-root', '제곱근의 뜻과 성질'), small('m3s1-real-number', '무리수와 실수')] }] }],
    },
    {
        gradeId: 'middle-3', subjectId: 'math', term: 'second',
        majorUnits: [{ id: 'm3s2-major-1', name: '삼각비와 원', middleUnits: [{ id: 'm3s2-mid-1', name: '삼각비', smallUnits: [small('m3s2-trig-ratio', '삼각비'), small('m3s2-trig-use', '삼각비의 활용')] }] }],
    },
];
