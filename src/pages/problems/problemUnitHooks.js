import { useQuery } from '@tanstack/react-query';
import { getProblemUnits } from '../../api/problems/problemUnitsApi.js';

const gradeValues = {
    'middle-1': 1,
    'middle-2': 2,
    'middle-3': 3,
};

const semesterValues = {
    first: 'first',
    second: 'second',
    common: 'common',
};

const sortUnits = (units = []) => [...units]
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((unit) => ({
        ...unit,
        children: sortUnits(unit.children),
    }));

export const problemUnitQueryKeys = {
    all: ['teacher', 'problems', 'units'],
    scope: ({ grade, semester }) => [...problemUnitQueryKeys.all, { grade, semester }],
};

export const useProblemUnitsQuery = ({ gradeId, term }) => {
    const grade = gradeValues[gradeId];
    const semester = semesterValues[term];

    return useQuery({
        queryKey: problemUnitQueryKeys.scope({ grade, semester }),
        queryFn: ({ signal }) => getProblemUnits({ grade, semester, signal }),
        select: sortUnits,
        enabled: Boolean(grade && semester),
    });
};
