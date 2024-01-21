import React from 'react';
import Planning from './Planning';
import { Draggable } from 'react-beautiful-dnd';
import TaskLinkButton from './TaskLinkButton';
import TaskAttributes from './TaskAttributes';
import { Task } from '../types';

function TaskCard({ task, index }: { task: Task, index: number }) {

    // Before the api call, task is an empty object, so we show a placeholder
    if (Object.keys(task).length === 0) {
        return (
            <div className="task taskPlaceholder">
                <div className="taskHeader">
                    <div className="taskTitle">
                    </div>
                </div>
            </div>
        );
    }

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
                            <TaskAttributes type={task.task_type} priority={task.priority} />
                            <Planning planned_at={task.planned_at} duration={task.duration} />
                        </div>
                    </div>
                );
            }}
        </Draggable>
    );
}

export default TaskCard;