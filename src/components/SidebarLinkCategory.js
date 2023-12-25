import React from 'react';
import SidebarLink from './SidebarLink';

function SidebarLinkCategory({ linkCategory }) {
    return (
        <div className="sidebarLinkCategory">
            <h3>{linkCategory.title}</h3>
            {linkCategory.links.map(link => <SidebarLink key={link.id} link={link} />)}
        </div>
    );
}

export default SidebarLinkCategory;