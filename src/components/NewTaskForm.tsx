import React, { useState, ChangeEvent, FocusEvent, FormEvent } from 'react';
import { Task } from '../types';

type TaskType = 'regular' | 'focus' | 'meeting';

interface Field {
    type: 'number' | 'radio' | 'datetime-local';
    min?: number;
    max?: number;
    placeholder: string;
    state: string;
    options?: TaskType[];
}

interface NewTaskFormProps {
    onCreateTask: (task: Task) => void;
}

const taskTypes: TaskType[] = ['regular', 'focus', 'meeting'];

const FIELDS: Field[][] = [
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
            state: 'planned_at',
        },
        {
            type: 'number',
            min: 1,
            placeholder: 'Duration (mins)',
            state: 'duration',
        },
    ],
];

function NewTaskForm({ onCreateTask }: NewTaskFormProps) {
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState('');
    const [type, setType] = useState < TaskType > ('regular');
    const [planned_at, setPlannedAt] = useState('');
    const [duration, setDuration] = useState('');
    const [isFormFocused, setIsFormFocused] = useState(false);

    const handleFocus = () => {
        if (!isFormFocused) setIsFormFocused(true);
    };

    const handleBlur = () => {
        if (isFormFocused) setIsFormFocused(false);
    };

    const stateSetters: { [key: string]: React.Dispatch<React.SetStateAction<string>> } = {
        priority: setPriority,
        type: setType,
        planned_at: setPlannedAt,
        duration: setDuration,
    };

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        onCreateTask({
            title,
            priority,
            type: taskTypes.indexOf(type),
            planned_at,
            duration,
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
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
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
                                        {field.type === 'radio' ? (
                                            field.options?.map(option => (
                                                <label key={option}>
                                                    <input
                                                        id={`${field.state}-${option}`}
                                                        type="radio"
                                                        name={field.state}
                                                        value={option}
                                                        checked={type === option}
                                                        onChange={(e: ChangeEvent<HTMLInputElement>) => stateSetters[field.state](e.target.value)}
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
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => stateSetters[field.state](e.target.value)}
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
};

export default NewTaskForm;