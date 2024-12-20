import { faCalendarAlt, faChartSimple, faTableCells, faTableList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { SidebarLinkProps } from '../components/Sidebar';
import { Button } from './ui/button';
import { Skeleton } from "./ui/skeleton";

function SidebarLink({ link }: { link: SidebarLinkProps }) {
    if (Object.keys(link).length === 0) {
        return (
            <div className="w-full p-1" >
                <Skeleton className="h-8" />
            </div >
        );
    }

    let icon: JSX.Element | null = null;
    if (link.title === 'Calendar') {
        icon = <FontAwesomeIcon icon={faCalendarAlt} />
    }
    if (link.title === 'Tasks') {
        icon = <FontAwesomeIcon icon={faTableList} />
    }
    if (link.title === 'Insights') {
        icon = <FontAwesomeIcon icon={faChartSimple} />
    }
    if (icon === null) {
        icon = <FontAwesomeIcon icon={faTableCells} />
    }

    return (
        <Link to={link.url} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Button variant="link" className='p-6 flex justify-start gap-3 w-full text-base font-normal text-muted-foreground'>
                {icon}
                {link.title}
            </Button>
        </Link>
    );
}

export default SidebarLink;