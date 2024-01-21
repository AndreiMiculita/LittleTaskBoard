import { faBrain, faNoteSticky, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Task } from '../types';
import Planning from './Planning.tsx';

const STATUS_MAP = {
    1: 'To Do',
    2: 'In Progress',
    3: 'Done'
};

const taskTypes = {
    '0': <FontAwesomeIcon icon={faNoteSticky} />,
    '1': <FontAwesomeIcon icon={faBrain} />,
    '2': <FontAwesomeIcon icon={faUsers} />
};

function TaskRow({ task }: { task: Task }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/tasks/${task.id}`);
    };

    return (
        <tr onClick={handleClick} className="taskRow">
            <td className='taskRowTitle'>{task.title}</td>
            <td>{task.priority ? task.priority : "No Priority"}</td>
            <td>{task.planned_at ? <Planning planned_at={task.planned_at} duration={task.duration} /> : "Not Planned"}</td>
            <td>{task.duration ? task.duration : "No Duration"}</td>
            <td>{taskTypes[task.task_type]}</td>
            <td>{STATUS_MAP[task.status] ? STATUS_MAP[task.status] : "No Status"}</td>
        </tr>
    );
};

export default TaskRow;
