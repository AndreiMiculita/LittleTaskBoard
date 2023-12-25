import React, { useState } from 'react';

const FIELDS = [
    {
        type: 'number',
        min: 1,
        max: 4,
        placeholder: 'Task priority (1-4) (Optional)',
        state: 'priority',
    },
    {
        type: 'datetime-local',
        placeholder: 'Planned at (Optional)',
        state: 'plannedAt',
    },
    {
        type: 'number',
        min: 1,
        placeholder: 'Duration (minutes) (Optional)',
        state: 'duration',
    },
];

function NewTaskForm({ onCreate }) {
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState('');
    const [plannedAt, setPlannedAt] = useState('');
    const [duration, setDuration] = useState('');

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
        <form onSubmit={handleSubmit} className="newTaskForm">
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
                        placeholder={placeholder}
                    />
                ))}
            </div>
            <button type="submit">Add Task</button>
        </form>
    );
}

export default NewTaskForm;