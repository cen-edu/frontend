import katex from 'katex';
import 'katex/dist/katex.min.css';
import './MathText.scss';

const isEscaped = (text, index) => {
    let slashCount = 0;

    for (let cursor = index - 1; cursor >= 0 && text[cursor] === '\\'; cursor -= 1) {
        slashCount += 1;
    }

    return slashCount % 2 === 1;
};

const findDelimiter = (text, delimiter, startIndex) => {
    for (let index = startIndex; index <= text.length - delimiter.length; index += 1) {
        if (text.startsWith(delimiter, index) && !isEscaped(text, index)) return index;
    }

    return -1;
};

const tokenize = (value) => {
    const text = String(value ?? '');
    const tokens = [];
    let textStart = 0;
    let cursor = 0;

    while (cursor < text.length) {
        if (text[cursor] !== '$' || isEscaped(text, cursor)) {
            cursor += 1;
            continue;
        }

        const displayMode = text[cursor + 1] === '$';
        const delimiter = displayMode ? '$$' : '$';
        const formulaStart = cursor + delimiter.length;
        const formulaEnd = findDelimiter(text, delimiter, formulaStart);

        if (formulaEnd < 0) break;

        if (cursor > textStart) tokens.push({ type: 'text', value: text.slice(textStart, cursor) });
        tokens.push({
            type: 'math',
            value: text.slice(formulaStart, formulaEnd),
            displayMode,
        });

        cursor = formulaEnd + delimiter.length;
        textStart = cursor;
    }

    if (textStart < text.length) tokens.push({ type: 'text', value: text.slice(textStart) });

    return tokens;
};

function MathText({ children, latex = false }) {
    const value = String(children ?? '');
    const tokens = latex && !value.includes('$')
        ? [{ type: 'math', value, displayMode: false }]
        : tokenize(value);

    return tokens.map((token, index) => {
        if (token.type === 'text') return token.value;

        const markup = katex.renderToString(token.value, {
            displayMode: token.displayMode,
            throwOnError: false,
            strict: 'ignore',
        });

        return (
            <span
                key={`math-${index}`}
                className={`math-text__formula${token.displayMode ? ' math-text__formula--block' : ''}`}
                dangerouslySetInnerHTML={{ __html: markup }}
            />
        );
    });
}

export default MathText;
