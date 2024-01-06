import React from 'react';
import Planning from './Planning';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBrain } from '@fortawesome/free-solid-svg-icons';

const STATUS_MAP = {
    1: 'To Do',
    2: 'In Progress',
    3: 'Done'
};

const TaskRow = ({ task }) => {

    return (
        <Link to={`/tasks/${task.id}`} className="taskRow">
            <div className='taskRowTitle'>{task.title}</div>
            <div className='taskRowPriority'>{task.priority ? task.priority : "No Priority"}</div>
            <div className='taskRowPlannedAt'>{task.planned_at ? <Planning plannedAt={task.planned_at} duration={task.duration} /> : "Not Planned"}</div>
            <div className='taskRowDuration'>{task.duration ? task.duration : "No Duration"}</div>
            <div className='taskRowType'>{task.type === 1 ? <FontAwesomeIcon icon={faBrain} /> : null}</div>
            <div className='taskRowStatus'>{STATUS_MAP[task.status]}</div>
        </Link>
    );
};

export default TaskRow;

