import React, { ChangeEvent, Dispatch, FormEvent, SetStateAction, useState } from 'react';
import { Button } from './ui/button';

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
    onCreateTask: (task: any) => void;
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
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('');
    const [type, setType] = useState<TaskType>('regular');
    const [planned_at, setPlannedAt] = useState('');
    const [duration, setDuration] = useState('');
    const [isFormFocused, setIsFormFocused] = useState(false);

    const handleFocus = () => {
        if (!isFormFocused) setIsFormFocused(true);
    };

    const handleBlur = () => {
        if (isFormFocused) setIsFormFocused(false);
    };

    const stateSetters: { [key: string]: Dispatch<SetStateAction<string | TaskType>> } = {
        description: setDescription,
        priority: setPriority,
        type: setType as Dispatch<SetStateAction<string | TaskType>>,
        planned_at: setPlannedAt,
        duration: setDuration,
    };

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        onCreateTask({
            title,
            description,
            priority: parseInt(priority),
            task_type: taskTypes.indexOf(type),
            planned_at,
            duration: parseInt(duration),
        });
        // Reset the form
        setTitle('');
        setDescription('');
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
                    placeholder="Task Title"
                />
                <input
                    type="text"
                    value={description}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder="Description"
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
                                                // @ts-ignore Lord forgive me (on Andrei's todo list)
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
                <Button variant="outline" type="submit">Add Task</Button>
            </form>
        </div>
    );
};

export default NewTaskForm;