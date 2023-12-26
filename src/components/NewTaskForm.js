import React, { useState } from 'react';

const FIELDS = [
    {
        type: 'number',
        min: 1,
        max: 4,
        placeholder: 'Priority (1-4)',
        state: 'priority',
    },
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
];

function NewTaskForm({ onCreate }) {
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState('');
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
        plannedAt: setPlannedAt,
        duration: setDuration,
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onCreate({ title, priority, plannedAt, duration });
        setTitle('');
        setPriority('');
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
                    {FIELDS.map(({ type, min, max, placeholder, state }) => (
                        <input
                            key={state}
                            type={type}
                            min={min}
                            max={max}
                            value={{ priority, plannedAt, duration }[state]}
                            onChange={(e) => stateSetters[state](e.target.value)}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            placeholder={placeholder}
                        />
                    ))}
                </div>
                <button type="submit">Add Task</button>
            </form>
        </div>
    );
}

export default NewTaskForm;