const terminalPeriodPattern = /^\s*\.\s*$/;

export const omitPeriodAfterTerminalBlank = (segments = []) => {
    const lastSegment = segments.at(-1);
    const previousSegment = segments.at(-2);

    if (previousSegment?.type !== 'blank'
        || lastSegment?.type !== 'text'
        || !terminalPeriodPattern.test(lastSegment.value ?? '')) {
        return segments;
    }

    return segments.slice(0, -1);
};
