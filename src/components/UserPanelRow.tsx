import { faCog, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { UserPanelRowProps } from './UserPanel';

function UserPanelRow({ userPanelRow }: { userPanelRow: UserPanelRowProps }) {
    let icon: JSX.Element | null = null;
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
};

export default UserPanelRow;