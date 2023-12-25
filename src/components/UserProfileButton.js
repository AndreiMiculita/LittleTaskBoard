import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

function UserProfileButton() {
    return (
        <a className="userProfileButton" href='/user' style={{ textDecoration: 'none', color: 'inherit' }}>
            <FontAwesomeIcon icon={faUser} />
            Profile
        </a>
    );
}

export default UserProfileButton;