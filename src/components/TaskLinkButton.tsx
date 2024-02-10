import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "./ui/tooltip";

interface TaskLinkButtonProps {
    taskId: number;
}

function TaskLinkButton({ taskId }: TaskLinkButtonProps) {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/tasks/${taskId}`);
    };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant='ghost' onClick={handleClick} className='aspect-square'>
                        <FontAwesomeIcon icon={faUpRightFromSquare} />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>View task details</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default TaskLinkButton;