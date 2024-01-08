import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faTableList, faChartSimple, faTableCells } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

function SidebarLink({ link }) {
    if (Object.keys(link).length === 0) {
        return (
            <div className="sidebarLink sidebarLinkPlaceholder">
                &nbsp;
            </div>
        );
    }

    let icon = null;
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
            <div className="sidebarLink">
                {icon}
                {link.title}
            </div>
        </Link>
    );
}

export default SidebarLink;