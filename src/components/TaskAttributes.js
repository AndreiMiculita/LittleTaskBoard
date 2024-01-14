import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBrain, faUsers } from '@fortawesome/free-solid-svg-icons';

function getPriorityColor(priority) {
    const maxPriority = 4; // replace with your maximum priority
    const minPriority = 1; // replace with your minimum priority
    const ratio = (priority - minPriority) / (maxPriority - minPriority);
    const hue = ratio * 120; // hue goes from 0 (red) to 120 (green)
    return `hsl(${hue}, 100%, 50%)`;
}

const TaskAttributes = ({ type, priority }) => (
    <div className="taskAttributes">
        <div className="taskPriority">
            <div className="taskPriorityColor" style={{ backgroundColor: getPriorityColor(priority) }}></div>
            <div className="taskPriorityNumber">{priority}</div>
        </div>
        {type === 1 && <FontAwesomeIcon icon={faBrain} className="taskType" />}
        {type === 2 && <FontAwesomeIcon icon={faUsers} className="taskType" />}
    </div>
);

export default TaskAttributes;