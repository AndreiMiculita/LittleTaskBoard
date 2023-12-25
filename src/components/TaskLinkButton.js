import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

const TaskLinkButton = ({ taskId }) => {
    const handleClick = () => {
        // Handle click event here
        console.log(`Clicked on task ${taskId}`);
        // Navigate to the task page
    };

    return (
        <button className="taskLinkButton" onClick={handleClick}>
            <FontAwesomeIcon icon={faUpRightFromSquare} />
        </button>
    );
};

export default TaskLinkButton;