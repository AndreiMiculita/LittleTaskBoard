import React, { useState, useEffect } from 'react';
import SidebarLinkCategory from './SidebarLinkCategory';
import sidebarData from '../example_responses/sidebar.json';
import { toast } from 'react-toastify';

function Sidebar({ auth, isSidebarOpen }) {
    const [sidebar, setSidebar] = useState(sidebarData);

    useEffect(() => {
        auth.fetch('http://localhost:5000/api/sidebar/',
            {
                method: 'GET'
            })
            .then(data => {
                setSidebar(data);
            })
            .catch(err => {
                console.error(err);
                toast.error('Failed to load sidebar data');
            });
    }, []);

    return (
        <div className={`sidebar ${isSidebarOpen ? '' : 'hide'}`}>
            {sidebar.linksByCategory.map(linkCategory => <SidebarLinkCategory key={linkCategory.id} linkCategory={linkCategory} />)}
        </div>
    );
}

export default Sidebar;