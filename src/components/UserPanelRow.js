import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOut, faCog } from '@fortawesome/free-solid-svg-icons';

function UserPanelRow({ userPanelRow }) {
    let icon = null;
    if (userPanelRow.title === 'Settings') {
        icon = <FontAwesomeIcon icon={faCog} />
    }
    if (userPanelRow.title === 'Log Out') {
        icon = <FontAwesomeIcon icon={faSignOut} />
    }
    return (
        <a href={userPanelRow.url} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="userPanelRow">
                {icon}
                {userPanelRow.title}
            </div>
        </a>
    );
}

export default UserPanelRow;