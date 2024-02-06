import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

interface UserProfileButtonProps {
  onClickUserProfileButton: () => void;
}

function UserProfileButton({ onClickUserProfileButton }: UserProfileButtonProps) {
    return (
        <button className='flex gap-3 items-center px-8' onClick={onClickUserProfileButton}>
            <FontAwesomeIcon icon={faUser} />
            Profile
        </button>
    );
}

export default UserProfileButton;