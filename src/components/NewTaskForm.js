import React, { useState } from 'react';

const FIELDS = [
    [
        {
            type: 'number',
            min: 1,
            max: 4,
            placeholder: 'Priority (1-4)',
            state: 'priority',
        },
        {
            type: 'checkbox',
            placeholder: 'Requires Focus',
            state: 'focus',
        },
    ],
    [
        {
            type: 'datetime-local',
            placeholder: 'Planned at',
            state: 'plannedAt',
        },
        {
            type: 'number',
            min: 1,
            placeholder: 'Duration (mins)',
            state: 'duration',
        },
    ],
];

function NewTaskForm({ onCreate }) {
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState('');
    const [focus, setFocus] = useState(false);
    const [plannedAt, setPlannedAt] = useState('');
    const [duration, setDuration] = useState('');
    const [isFocused, setIsFocused] = useState(false);


    const handleFocus = () => {
        (!isFocused) && setIsFocused(true);
    };

    const handleBlur = () => {
        (isFocused) && setIsFocused(false);
    };

    const stateSetters = {
        priority: setPriority,
        focus: setFocus,
        plannedAt: setPlannedAt,
        duration: setDuration,
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onCreate({ title, priority, plannedAt, duration });
        // Reset the form
        setTitle('');
        setPriority('');
        setFocus(false);
        setPlannedAt('');
        setDuration('');
    };

    return (
        <div>
            {isFocused && <div className="overlay"></div>}
            <form className="newTaskForm" onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder="New task title"
                    required
                />
                <div className="taskDetails">
                    {FIELDS.map((row, index) => (
                        <div className="taskDetailsRow" key={index}>
                            {row.map((field, index) => (
                                <React.Fragment key={index}>
                                    <div className="taskDetailsField">
                                        {field.type === 'checkbox' && <label htmlFor={field.state}>{field.placeholder}</label>}
                                        <input
                                            id={field.state}
                                            type={field.type}
                                            min={field.min}
                                            max={field.max}
                                            placeholder={field.placeholder}
                                            value={field.state}
                                            onChange={(e) => stateSetters[field.state](e.target.value)}
                                            onFocus={handleFocus}
                                            onBlur={handleBlur}
                                        />
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>
                    ))}
                </div>
                <button type="submit">Add Task</button>
            </form>
        </div>
    );
}

export default NewTaskForm;