const MINUTE_IN_MS = 60 * 1000;
const HOUR_IN_MS = 60 * MINUTE_IN_MS;
const DAY_IN_MS = 24 * HOUR_IN_MS;

const parseDueDate = (value) => {
    const [datePart, timePart = '00:00'] = value.split(' ');
    const [year, month, day] = datePart.split('.').map(Number);
    const [hour, minute] = timePart.split(':').map(Number);

    return new Date(year, month - 1, day, hour, minute);
};

const formatRelativeDueDate = (dueAt, now = new Date()) => {
    const dueDate = parseDueDate(dueAt);

    if (Number.isNaN(dueDate.getTime())) return dueAt;

    const difference = Math.abs(dueDate.getTime() - now.getTime());

    if (difference < HOUR_IN_MS) {
        return `${Math.max(1, Math.floor(difference / MINUTE_IN_MS))}분 전`;
    }

    if (difference < DAY_IN_MS) {
        return `${Math.floor(difference / HOUR_IN_MS)}시간 전`;
    }

    return `${Math.floor(difference / DAY_IN_MS)}일 전`;
};

export default formatRelativeDueDate;
