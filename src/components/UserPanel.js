import React from 'react';
import UserPanelRow from './UserPanelRow';

function UserPanel({ userPanel, isUserPanelOpen }) {
    return (
        <div className={`userPanel ${isUserPanelOpen ? '' : 'hide'}`}>
            {userPanel.links.map(userPanelRow => <UserPanelRow key={userPanelRow.id} userPanelRow={userPanelRow} />)}
        </div>
    );
}

export default UserPanel;