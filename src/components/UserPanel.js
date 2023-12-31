import React, { useState, useEffect } from 'react';
import UserPanelRow from './UserPanelRow';
import userPanelData from '../example_responses/userPanel.json';
import { toast } from 'react-toastify';

function UserPanel({ auth, isUserPanelOpen }) {
    const [userPanel, setUserPanel] = useState(userPanelData);

    useEffect(() => {
        auth.fetch('http://localhost:5000/api/user/',
            {
                method: 'GET'
            })
            .then(data => {
                setUserPanel(data);
            })
            .catch(err => {
                console.error(err);
                toast.error('Failed to load user data');
            });
    }, []);

    return (
        <div className={`userPanel ${isUserPanelOpen ? '' : 'hide'}`}>
            {userPanel.links.map(userPanelRow => <UserPanelRow key={userPanelRow.id} userPanelRow={userPanelRow} />)}
        </div>
    );
}

export default UserPanel;