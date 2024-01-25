import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

interface TaskLinkButtonProps {
    taskId: number;
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