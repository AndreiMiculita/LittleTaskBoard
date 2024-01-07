import React from 'react';
import Planning from './Planning';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBrain } from '@fortawesome/free-solid-svg-icons';

const STATUS_MAP = {
    1: 'To Do',
    2: 'In Progress',
    3: 'Done'
};

const TaskRow = ({ task }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/tasks/${task.id}`);
    };

    return (
        <tr onClick={handleClick} className="taskRow">
            <td className='taskRowTitle'>{task.title}</td>
            <td>{task.priority ? task.priority : "No Priority"}</td>
            <td>{task.planned_at ? <Planning plannedAt={task.planned_at} duration={task.duration} /> : "Not Planned"}</td>
            <td>{task.duration ? task.duration : "No Duration"}</td>
            <td>{task.type === 1 ? <FontAwesomeIcon icon={faBrain} /> : null}</td>
            <td>{STATUS_MAP[task.status]}</td>
        </tr>
    );
};

export default TaskRow;
