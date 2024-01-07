import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const TaskLinkButton = ({ taskId }) => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/tasks/${taskId}`);
    };

    return (
        <button className="taskLinkButton" onClick={handleClick}>
            <FontAwesomeIcon icon={faUpRightFromSquare} />
        </button>
    );
};

export default TaskLinkButton;