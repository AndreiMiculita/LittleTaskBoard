import React from 'react';
import Planning from './Planning';
import { Draggable } from 'react-beautiful-dnd';
import TaskLinkButton from './TaskLinkButton';
import TaskAttributes from './TaskAttributes';

function getPriorityColor(priority) {
    const maxPriority = 4; // replace with your maximum priority
    const minPriority = 1; // replace with your minimum priority
    const ratio = (priority - minPriority) / (maxPriority - minPriority);
    const hue = ratio * 120; // hue goes from 0 (red) to 120 (green)
    return `hsl(${hue}, 100%, 50%)`;
}

function Task({ task, index }) {
    const priorityColor = getPriorityColor(task.priority);

    return (
        <Draggable draggableId={task.id.toString()} index={index}>
            {(provided, snapshot) => {
                return (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                    >
                        <div className={`task ${snapshot.isDragging ? 'dragging' : ''}`}>
                            <div className="taskHeader">
                                <div className="taskTitle">
                                    {task.title}
                                </div>
                                <TaskLinkButton taskId={task.id} />
                            </div>
                            <TaskAttributes type={task.type} priority={task.priority} priorityColor={priorityColor} />
                            <Planning plannedAt={task.plannedAt} duration={task.duration} />
                        </div>
                    </div>
                );
            }}
        </Draggable>
    );
}

export default Task;