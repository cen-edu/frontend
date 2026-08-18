import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAcademicContexts } from '../../../../api/teachers/academicContextsApi.js';

const EMPTY_FILTERS = {
    academicYear: '',
    grade: '',
    classId: '',
    semester: '',
};

const toValue = (value) => value === null || value === undefined ? '' : String(value);

const findAcademicYear = (academicYears, academicYear) => (
    academicYears.find(({ year }) => toValue(year) === academicYear)
);

const findGrade = (academicYear, grade) => (
    academicYear?.grades.find((item) => toValue(item.grade) === grade)
);

const getAvailableFilters = (data, filters) => {
    const academicYears = data?.academicYears ?? [];
    const year = findAcademicYear(academicYears, filters.academicYear) ?? academicYears[0];
    const grade = findGrade(year, filters.grade) ?? year?.grades[0];
    const classItem = grade?.classes.find(({ id }) => toValue(id) === filters.classId) ?? grade?.classes[0];
    const semesters = data?.semesters ?? [];
    const semester = semesters.find(({ value }) => toValue(value) === filters.semester) ?? semesters[0];

    return {
        academicYear: toValue(year?.year),
        grade: toValue(grade?.grade),
        classId: toValue(classItem?.id),
        semester: toValue(semester?.value),
    };
};

const getDefaultFilters = (data) => getAvailableFilters(data, {
    academicYear: toValue(data?.defaults?.academicYear),
    grade: toValue(data?.defaults?.grade),
    classId: toValue(data?.defaults?.classId),
    semester: toValue(data?.defaults?.semester),
});

export const academicContextQueryKeys = {
    all: ['teacher', 'academic-contexts'],
};

export const useAcademicContextsQuery = () => useQuery({
    queryKey: academicContextQueryKeys.all,
    queryFn: ({ signal }) => getAcademicContexts({ signal }),
});

export function useAcademicContextFilters() {
    const query = useAcademicContextsQuery();
    const [filters, setFilters] = useState(EMPTY_FILTERS);

    useEffect(() => {
        if (!query.data) return;
        setFilters((current) => {
            const next = current.academicYear
                ? getAvailableFilters(query.data, current)
                : getDefaultFilters(query.data);
            return Object.keys(next).every((key) => next[key] === current[key]) ? current : next;
        });
    }, [query.data]);

    const options = useMemo(() => {
        const academicYears = query.data?.academicYears ?? [];
        const selectedYear = findAcademicYear(academicYears, filters.academicYear);
        const selectedGrade = findGrade(selectedYear, filters.grade);

        return {
            academicYears: academicYears.map(({ year }) => ({
                value: toValue(year),
                label: `${year}학년도`,
            })),
            grades: (selectedYear?.grades ?? []).map(({ grade }) => ({
                value: toValue(grade),
                label: `${grade}학년`,
            })),
            classes: (selectedGrade?.classes ?? []).map((classItem) => ({
                value: toValue(classItem.id),
                label: classItem.name,
            })),
            semesters: (query.data?.semesters ?? []).map(({ value, label }) => ({
                value: toValue(value),
                label,
            })),
        };
    }, [filters.academicYear, filters.grade, query.data]);

    const changeFilter = (key, value) => {
        setFilters((current) => {
            const next = { ...current, [key]: value };
            if (key === 'academicYear') {
                next.grade = '';
                next.classId = '';
            } else if (key === 'grade') {
                next.classId = '';
            }
            return query.data ? getAvailableFilters(query.data, next) : next;
        });
    };

    return { filters, options, changeFilter, query };
}
