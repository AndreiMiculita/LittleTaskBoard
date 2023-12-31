import React from 'react';
import Planning from './Planning';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBrain } from '@fortawesome/free-solid-svg-icons';

const STATUS_MAP = {
    0: 'To Do',
    1: 'In Progress',
    2: 'Done'
};

const TaskRow = ({ task }) => {

    return (
        <div className="taskRow">
            <div className='taskRowTitle'>{task.title}</div>
            <div className='taskRowPriority'>{task.priority ? task.priority : "No Priority"}</div>
            <div className='taskRowPlannedAt'>{task.plannedAt ? <Planning plannedAt={task.plannedAt} duration={task.duration} /> : "Not Planned"}</div>
            <div className='taskRowDuration'>{task.duration ? task.duration : "No Duration"}</div>
            <div className='taskRowFocus'>{task.focus ? <FontAwesomeIcon icon={faBrain} /> : null}</div>
            <div className='taskRowStatus'>{STATUS_MAP[task.status]}</div>
        </div>
    );
};

export default TaskRow;

