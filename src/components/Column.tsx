import React from 'react';
import TaskCard from './TaskCard.tsx';
import { Droppable } from 'react-beautiful-dnd';
import { Task } from '../types';


interface ColumnProps {
    column: {
        id: number;
        title: string;
        tasks: Task[];
    };
}

const Column = ({ column }: ColumnProps) => {
    const tasks = column.tasks;
    tasks.sort((a, b) => a.priority - b.priority);

    return (
        <Droppable droppableId={column.id.toString()}>
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
        </Droppable>
    );
};

export default Column;