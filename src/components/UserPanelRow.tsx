import { faCog, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { UserPanelRowProps } from './UserPanel';
import { Button } from './ui/button';

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
            <Button variant="link" className="p-6 flex justify-start gap-3 w-full text-base font-normal text-muted-foreground">
                {icon}
                {userPanelRow.title}
            </Button>
        </Link>
    );
};

export default UserPanelRow;