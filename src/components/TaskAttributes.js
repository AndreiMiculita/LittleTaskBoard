import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBrain, faUsers } from '@fortawesome/free-solid-svg-icons';

const TaskAttributes = ({ type, priority, priorityColor }) => (
    <div className="taskAttributes">
        <div className="taskPriority">
            <div className="taskPriorityColor" style={{ backgroundColor: priorityColor }}></div>
            <div className="taskPriorityNumber">{priority}</div>
        </div>
        {type === 1 && <FontAwesomeIcon icon={faBrain} className="taskType" />}
        {type === 2 && <FontAwesomeIcon icon={faUsers} className="taskType" />}
    </div>
);

export default TaskAttributes;