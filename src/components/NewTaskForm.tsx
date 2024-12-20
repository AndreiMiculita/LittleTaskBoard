import React, { ChangeEvent, Dispatch, FormEvent, SetStateAction, useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
    RadioGroup,
    RadioGroupItem
} from './ui/radio-group';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "./ui/tooltip";

type TaskType = 'regular' | 'focus' | 'meeting';

interface Field {
    type: 'number' | 'radio' | 'datetime-local' | 'select';
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
            type: 'select',
            min: 1,
            max: 4,
            placeholder: 'Priority (Optional)',
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
            <Card className='mx-auto max-w-lg p-4 z-40'>
                <form className="flex flex-col z-40 gap-4" onSubmit={handleSubmit}>
                    <Input
                        className='border-none shadow-none bg-transparent text-xl font-semibold'
                        type="text"
                        value={title}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                        placeholder="Type a title here to add a new task."
                    />
                    <Input
                        className='border-none shadow-none bg-transparent'
                        type="text"
                        value={description}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
                        placeholder="Description"
                    />
                    <div className="flex gap-4 flex-col">
                        {FIELDS.map((row, index) => (
                            <div className="flex flex-row justify-between gap-4 items-center" key={index}>
                                {row.map((field, index) => (
                                    <React.Fragment key={index}>
                                        <div className="w-full">
                                            {field.type === 'radio' ? (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <RadioGroup
                                                                className="flex flex-row items-center"
                                                                onValueChange={(value: TaskType) => setType(value)}
                                                            >
                                                                {field.options?.map((option, index) => (
                                                                    <>
                                                                        <RadioGroupItem
                                                                            key={index}
                                                                            value={option}
                                                                            checked={type === option}
                                                                            id={option} />
                                                                        <Label htmlFor={option}>{option}</Label>
                                                                    </>
                                                                ))}
                                                            </RadioGroup>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Select the type of the task</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            ) : field.type === 'select' ? (
                                                <Select
                                                    value={priority}
                                                    onValueChange={(value: string) => setPriority(value)}
                                                >
                                                    <SelectTrigger className='border-none shadow-none'>
                                                        <SelectValue placeholder={field.placeholder} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Array.from({ length: field.max! - field.min! + 1 }, (_, i) => (
                                                            <SelectItem key={i} value={String(i + field.min!)}>Priority {i + field.min!}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <Input
                                                    className='border-none shadow-none'
                                                    id={field.state}
                                                    type={field.type}
                                                    min={field.min}
                                                    max={field.max}
                                                    // @ts-ignore Lord forgive me (on Andrei's todo list)
                                                    value={field.state.value}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => stateSetters[field.state](e.target.value)}
                                                    placeholder={field.placeholder}
                                                />
                                            )}
                                        </div>
                                    </React.Fragment>
                                ))}
                            </div>
                        ))}
                    </div>
                    <Button type="submit">Add Task</Button>
                </form>
            </Card>
        </div>
    );
};

export default NewTaskForm;