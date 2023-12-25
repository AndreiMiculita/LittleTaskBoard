import React from 'react';
import SidebarLinkCategory from './SidebarLinkCategory';

function Sidebar({ sidebar, isSidebarOpen }) {
    return (
        <div className={`sidebar ${isSidebarOpen ? '' : 'hide'}`}>
            {sidebar.linksByCategory.map(linkCategory => <SidebarLinkCategory key={linkCategory.id} linkCategory={linkCategory} />)}
        </div>
    );
}

export default Sidebar;