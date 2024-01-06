import React, { useState } from 'react';

const taskTypes = ['regular', 'focus', 'meeting'];

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
            type: 'radio',
            options: taskTypes,
            placeholder: 'Task Type',
            state: 'type',
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

function NewTaskForm({ onCreateTask }) {
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState('');
    const [type, setType] = useState('regular');
    const [plannedAt, setPlannedAt] = useState('');
    const [duration, setDuration] = useState('');
    const [isFormFocused, setIsFormFocused] = useState(false);


    const handleFocus = () => {
        (!isFormFocused) && setIsFormFocused(true);
    };

    const handleBlur = () => {
        (isFormFocused) && setIsFormFocused(false);
    };

    const stateSetters = {
        priority: setPriority,
        type: setType,
        plannedAt: setPlannedAt,
        duration: setDuration,
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onCreateTask({
            title,
            priority: priority,
            type: taskTypes.indexOf(type),
            plannedAt,
            duration
        });
        // Reset the form
        setTitle('');
        setPriority('');
        setType('regular');
        setPlannedAt('');
        setDuration('');
    };

    return (
        <div>
            {isFormFocused && <div className="overlay"></div>}
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
                                        {field.type === 'radio' ? (
                                            field.options.map(option => (
                                                <label key={option}>
                                                    <input
                                                        id={`${field.state}-${option}`}
                                                        type="radio"
                                                        name={field.state}
                                                        value={option}
                                                        checked={type === option}
                                                        onChange={(e) => stateSetters[field.state](e.target.value)}
                                                        onFocus={handleFocus}
                                                        onBlur={handleBlur}
                                                    />
                                                    {option}
                                                </label>
                                            ))
                                        ) : (
                                            <input
                                                id={field.state}
                                                type={field.type}
                                                min={field.min}
                                                max={field.max}
                                                value={field.state.value}
                                                onChange={(e) => stateSetters[field.state](e.target.value)}
                                                onFocus={handleFocus}
                                                onBlur={handleBlur}
                                                placeholder={field.placeholder}
                                            />
                                        )}
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