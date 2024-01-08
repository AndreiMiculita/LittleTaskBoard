import React from 'react';
import Task from './Task';
import { Droppable } from 'react-beautiful-dnd';

function Column({ column }) {
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
                        {tasks.map((task, index) => <Task key={task.id || Math.random()} task={task} index={index} />)}
                    </div>
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );
}

export default Column;