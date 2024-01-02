import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOut, faCog } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

function UserPanelRow({ userPanelRow }) {
    let icon = null;
    if (userPanelRow.title === 'Settings') {
        icon = <FontAwesomeIcon icon={faCog} />
    }
    if (userPanelRow.title === 'Log Out') {
        icon = <FontAwesomeIcon icon={faSignOut} />
    }
    return (
        <Link to={userPanelRow.url} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="userPanelRow">
                {icon}
                {userPanelRow.title}
            </div>
        </Link>
    );
}

export default UserPanelRow;