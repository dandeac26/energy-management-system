import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import './styles/field-style.css';

function Field(props) {
    const [fieldClassName, setFieldClassName] = useState({});
    const [focused, setFocused] = useState((props.locked && props.focused) || false);
    const [value, setValue] = useState(props.value || '');
    const [error, setError] = useState(props.error || '');
    const [label, setLabel] = useState(props.label || '');

    function onChange(event) {
        const newVal = event.target.value;
        setValue((value) => (newVal));
        setError((error) => (''));
        return props.onChange(event);
    }

    return (
        <div className={`field ${(props.locked ? focused : focused || value) && 'focused'} ${props.locked && !focused && 'locked'}`}>
            <input
                id={props.id}
                type="text"
                value={value}
                placeholder={label}
                onChange={onChange}
                onFocus={() => !props.locked && setFocused((focused) => (true))}
                onBlur={() => !props.locked && setFocused((focused) => (false))}
            />
            <label htmlFor={props.id} className={error && 'error'}>
                {error || label}
            </label>
        </div>
    );
}

Field.propTypes = {
    id: PropTypes.string.isRequired,
    locked: PropTypes.bool,
    focused: PropTypes.bool,
    value: PropTypes.string,
    error: PropTypes.string,
    label: PropTypes.string,
    onChange: PropTypes.func,
};

Field.defaultProps = {
    locked: false,
    focused: false,
    value: '',
    error: '',
    label: '',
};

export default Field;
