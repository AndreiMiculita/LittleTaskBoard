import React from 'react';
import Task from './Task';
import { Droppable } from 'react-beautiful-dnd';

function Column({ column }) {
    const tasks = column.tasks;
    tasks.sort((a, b) => a.priority - b.priority);

    return (
        <div className="column">
            <h2>{column.title}</h2>
            <Droppable droppableId={column.id.toString()}>
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        <div className="tasks">
                            {tasks.map(task => <Task key={task.id} task={task} />)}
                        </div>
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
}

export default Column;