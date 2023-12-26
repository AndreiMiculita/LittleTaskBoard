import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBrain } from '@fortawesome/free-solid-svg-icons';

const TaskAttributes = ({ focus, priority, priorityColor }) => (
    <div className="taskAttributes">
        <div className="taskPriority">
            <div className="taskPriorityColor" style={{ backgroundColor: priorityColor }}></div>
            <div className="taskPriorityNumber">{priority}</div>
        </div>
        {focus && <FontAwesomeIcon icon={faBrain} />}
    </div>
);

export default TaskAttributes;