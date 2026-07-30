import './CustomCheckbox.scss';

function CustomCheckbox({ label, checked, onChange, disabled = false, className = '' }) {
    return (
        <label
            className={`custom-checkbox${disabled ? ' custom-checkbox--disabled' : ''}${className ? ` ${className}` : ''}`}
            onClick={(event) => event.stopPropagation()}
        >
            <input
                className="custom-checkbox__input"
                type="checkbox"
                aria-label={label}
                checked={checked}
                disabled={disabled}
                onChange={onChange}
            />
            <span className="custom-checkbox__box" aria-hidden="true">
                <i className="bi bi-check-lg" />
            </span>
        </label>
    );
}

export default CustomCheckbox;
