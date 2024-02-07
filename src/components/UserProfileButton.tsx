import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Button } from './ui/button';

interface UserProfileButtonProps {
  onClickUserProfileButton: () => void;
}

function UserProfileButton({ onClickUserProfileButton }: UserProfileButtonProps) {
    return (
        <Button variant='ghost' className='flex gap-4 items-center' onClick={onClickUserProfileButton}>
            <FontAwesomeIcon icon={faUser} />
            Profile
        </Button>
    );
}

export default UserProfileButton;