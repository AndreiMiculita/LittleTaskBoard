import React from 'react';
import Planning from './Planning';
import { Draggable } from 'react-beautiful-dnd';

function Task({ task }) {
    const maxPriority = 4;
    const priorityColor = `hsl(${task.priority * 360 / maxPriority}, 100%, 50%)`;

    return (
        <Draggable draggableId={task.id.toString()} index={task.priority - 1}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <div className="task">
                        <div className="taskTitle">
                            {task.title}
                        </div>
                        <div className="taskPriority">
                            <div className="taskPriorityColor" style={{ backgroundColor: priorityColor }}></div>
                            <div className="taskPriorityNumber">{task.priority}</div>
                        </div>
                        <Planning plannedAt={task.plannedAt} duration={task.duration} />
                    </div>
                </div>
            )}
        </Draggable>
    );
}

export default Task;