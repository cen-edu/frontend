import './SearchInput.scss';

function SearchInput({
    value,
    onChange,
    placeholder = '검색',
    label = placeholder,
    width = 190,
}) {
    return (
        <label
            className="common-search-input"
            style={{ '--search-input-width': typeof width === 'number' ? `${width}px` : width }}
        >
            <span className="common-search-input__label">{label}</span>
            <input
                type="search"
                value={value}
                placeholder={placeholder}
                onChange={(event) => onChange(event.target.value)}
            />
            <i className="bi bi-search" aria-hidden="true" />
        </label>
    );
}

export default SearchInput;
