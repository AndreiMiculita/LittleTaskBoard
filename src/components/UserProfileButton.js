import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

function UserProfileButton({ onClickUserProfileButton }) {
    return (
        <button className='userProfileButton' onClick={onClickUserProfileButton}>
            <FontAwesomeIcon icon={faUser} />
            Profile
        </button>
    );
}

export default UserProfileButton;