import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faTableList, faChartSimple, faTableCells } from '@fortawesome/free-solid-svg-icons';

function SidebarLink({ link }) {
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
        <a href={link.url} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="sidebarLink">
                {icon}
                {link.title}
            </div>
        </a>
    );
}

export default SidebarLink;