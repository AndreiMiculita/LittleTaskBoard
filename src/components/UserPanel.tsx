import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AuthService from '../Services/AuthService';
import userPanelData from '../example_responses/userPanel.json';
import UserPanelRow from './UserPanelRow';

export interface UserPanelRowProps {
    id: number;
    title: string;
    url: string;
}

interface UserPanelData {
    links: UserPanelRowProps[];
}

interface UserPanelProps {
    auth: AuthService;
    isUserPanelOpen: boolean;
}

function UserPanel({ auth, isUserPanelOpen }: UserPanelProps) {
    const [userPanel, setUserPanel] = useState<UserPanelData>(userPanelData as UserPanelData);

    useEffect(() => {
        auth.fetch('http://localhost:5000/api/user/',
            {
                method: 'GET'
            })
            .then((data: UserPanelData) => {
                setUserPanel(data);
            })
            .catch(err => {
                console.error(err);
                toast.error('Failed to load user data');
            });
    }, []);

    return (
        <div className={`userPanel ${isUserPanelOpen ? '' : 'flex-[0_0_0%]'}`}>
            {userPanel.links.map(userPanelRow => <UserPanelRow key={userPanelRow.id} userPanelRow={userPanelRow} />)}
        </div>
    );
};

export default UserPanel;