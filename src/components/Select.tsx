import React from 'react';

interface Option {
    value: string;
    label: string;
}

interface SelectProps {
    id: string;
    label: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    options: Option[];
}

function Select({ id, label, value, onChange, options }: SelectProps) {
    return (
        <div>
            <label htmlFor={id}> {label}: </label>
            <select
                id={id}
                value={value}
                onChange={onChange}
            >
                {options.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                ))}
            </select>
        </div>
    );
};

export default Select;