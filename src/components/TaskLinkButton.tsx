import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

interface TaskLinkButtonProps {
  taskId: string;
}

function TaskLinkButton({ taskId }: TaskLinkButtonProps) {
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