import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import UserProfileButton from './UserProfileButton';

function HeaderBar({ onClickSidebarButton }) {

    return (
        <div className="headerBar">
            <button className='sidebarButton' onClick={onClickSidebarButton}>
                <FontAwesomeIcon icon={faBars} />
                Menu
            </button>
            <h1>Little Task Board</h1>
            <UserProfileButton />
        </div>
    );
}

export default HeaderBar;