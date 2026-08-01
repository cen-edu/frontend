export const assignmentPeriodOptions = [
    { value: 'all', label: '전체' },
    { value: 'current-term', label: '이번 학기' },
    { value: 'previous-term', label: '지난 학기' },
    { value: 'recent-7-days', label: '최근 7일' },
    { value: 'recent-30-days', label: '최근 30일' },
    { value: 'custom', label: '직접 선택' },
];

const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const shiftDate = (date, days) => {
    const shifted = new Date(date);
    shifted.setDate(shifted.getDate() + days);
    return shifted;
};

const toDateInputValue = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const parseAssignedDate = (value) => {
    const match = value?.match(/^(\d{4})[.-](\d{2})[.-](\d{2})/);
    if (!match) return null;
    return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
};

const getTermRange = (date, previous = false) => {
    const month = date.getMonth();
    let start;
    let end;

    if (month >= 2 && month <= 7) {
        start = new Date(date.getFullYear(), 2, 1);
        end = new Date(date.getFullYear(), 8, 0);
    } else if (month >= 8) {
        start = new Date(date.getFullYear(), 8, 1);
        end = new Date(date.getFullYear() + 1, 2, 0);
    } else {
        start = new Date(date.getFullYear() - 1, 8, 1);
        end = new Date(date.getFullYear(), 2, 0);
    }

    if (!previous) return { start, end };

    const previousReferenceDate = new Date(start);
    previousReferenceDate.setDate(previousReferenceDate.getDate() - 1);
    return getTermRange(previousReferenceDate);
};

export const getDefaultAssignmentDateRange = () => {
    const today = startOfDay(new Date());
    return {
        startDate: toDateInputValue(shiftDate(today, -29)),
        endDate: toDateInputValue(today),
    };
};

export const isValidAssignmentDateRange = (startDate, endDate) =>
    Boolean(startDate && endDate && startDate <= endDate);

export const isAssignedWithinPeriod = (assignedAt, period, startDate, endDate) => {
    if (period === 'all') return true;

    const assignedDate = parseAssignedDate(assignedAt);
    if (!assignedDate) return false;

    if (period === 'custom') {
        return isValidAssignmentDateRange(startDate, endDate)
            && assignedDate >= new Date(`${startDate}T00:00:00`)
            && assignedDate <= new Date(`${endDate}T23:59:59`);
    }

    if (period === 'current-term' || period === 'previous-term') {
        const term = getTermRange(startOfDay(new Date()), period === 'previous-term');
        return assignedDate >= term.start && assignedDate <= term.end;
    }

    if (period !== 'recent-7-days' && period !== 'recent-30-days') return false;

    const today = startOfDay(new Date());
    const startDateOffset = period === 'recent-7-days' ? -6 : -29;
    return assignedDate >= shiftDate(today, startDateOffset) && assignedDate <= today;
};
