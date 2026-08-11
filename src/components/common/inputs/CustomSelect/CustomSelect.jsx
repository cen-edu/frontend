import { useEffect, useId, useRef, useState } from 'react';
import './CustomSelect.scss';

function CustomSelect({
    label,
    value,
    options,
    onChange,
    width = 124,
    disabled = false,
    placement = 'bottom',
    className = '',
}) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);
    const listId = useId();
    const selectedOption = options.find((option) => option.value === value) ?? options[0];

    useEffect(() => {
        const closeOnOutsideClick = (event) => {
            if (!containerRef.current?.contains(event.target)) setIsOpen(false);
        };
        const closeOnEscape = (event) => {
            if (event.key === 'Escape') setIsOpen(false);
        };

        document.addEventListener('mousedown', closeOnOutsideClick);
        document.addEventListener('keydown', closeOnEscape);
        return () => {
            document.removeEventListener('mousedown', closeOnOutsideClick);
            document.removeEventListener('keydown', closeOnEscape);
        };
    }, []);

    const selectOption = (option) => {
        if (option.disabled) return;
        onChange(option.value);
        setIsOpen(false);
    };

    return (
        <div
            ref={containerRef}
            className={`custom-select custom-select--${placement}${isOpen ? ' custom-select--open' : ''}${disabled ? ' custom-select--disabled' : ''}${className ? ` ${className}` : ''}`}
            style={{ '--custom-select-width': typeof width === 'number' ? `${width}px` : width }}
        >
            <button
                type="button"
                className="custom-select__toggle"
                aria-label={label}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-controls={listId}
                disabled={disabled}
                onClick={() => setIsOpen((current) => !current)}
            >
                <span>{selectedOption?.label ?? ''}</span>
                <i className="bi bi-caret-down-fill" aria-hidden="true" />
            </button>

            {isOpen && (
                <ul id={listId} className="custom-select__options" role="listbox" aria-label={label}>
                    {options.map((option) => (
                        <li key={option.value} role="option" aria-selected={option.value === value}>
                            <button
                                type="button"
                                className={`custom-select__option${option.value === value ? ' custom-select__option--selected' : ''}`}
                                disabled={option.disabled}
                                onClick={() => selectOption(option)}
                            >
                                {option.label}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default CustomSelect;
