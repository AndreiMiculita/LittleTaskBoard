import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from './ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "./ui/tooltip";

interface UserProfileButtonProps {
  onClickUserProfileButton: () => void;
}

function UserProfileButton({ onClickUserProfileButton }: UserProfileButtonProps) {
    return (

        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant='ghost' className='flex gap-4 items-center' onClick={onClickUserProfileButton}>
                        <FontAwesomeIcon icon={faUser} />
                        Profile
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p> Your account </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export default UserProfileButton;