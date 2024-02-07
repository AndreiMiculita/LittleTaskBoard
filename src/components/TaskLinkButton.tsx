import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

interface TaskLinkButtonProps {
    taskId: number;
}

function TaskLinkButton({ taskId }: TaskLinkButtonProps) {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/tasks/${taskId}`);
    };

    return (
        <Button variant='ghost' onClick={handleClick} className='aspect-square'>
            <FontAwesomeIcon icon={faUpRightFromSquare} />
        </Button>
    );
};

export default TaskLinkButton;