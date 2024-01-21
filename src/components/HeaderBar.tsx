// HeaderBar.tsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import UserProfileButton from './UserProfileButton';

interface HeaderBarProps {
    onClickSidebarButton: () => void;
    onClickUserProfileButton: () => void;
}

const HeaderBar = ({ onClickSidebarButton, onClickUserProfileButton }: HeaderBarProps) => {
    return (
        <div className="headerBar">
            <button className='sidebarButton' onClick={onClickSidebarButton}>
                <FontAwesomeIcon icon={faBars} />
                Menu
            </button>
            <h1>Little Task Board</h1>
            <UserProfileButton onClickUserProfileButton={onClickUserProfileButton} />
        </div>
    );
}

export default HeaderBar;