import React from 'react';
import { StrictModeDroppable } from './StrictModeDroppable.tsx';
import { Task } from '../types';
import TaskCard from './TaskCard.tsx';

export interface ColumnProps {
    id: number;
    title: string;
    tasks: Task[];
}

function Column({ column }: { column: ColumnProps }) {
    const tasks = column.tasks;
    tasks.sort((a, b) => a.priority - b.priority);

    return (
        <StrictModeDroppable droppableId={column.id.toString()}>
            {(provided, snapshot) => (
                <div
                    className={`column ${snapshot.isDraggingOver ? 'draggingOver' : ''}`}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                >
                    <h2>{column.title}</h2>
                    <div className={`tasks ${snapshot.isDraggingOver ? 'draggingOver' : ''}`}>
                        {tasks.map((task, index) => <TaskCard key={task.id || Math.random()} task={task} index={index} />)}
                    </div>
                    {provided.placeholder}
                </div>
            )}
        </StrictModeDroppable>
    );
};

export default Column;