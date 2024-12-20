import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AuthService from '../Services/AuthService';
import sidebarData from '../example_responses/sidebar.json';
import SidebarLinkCategory from './SidebarLinkCategory';

export interface SidebarLinkProps {
    id: number;
    title: string;
    url: string;
}

export interface SidebarLinkCategoryProps {
    id: number;
    title: string;
    links: SidebarLinkProps[];
}

interface SidebarData {
    linksByCategory: SidebarLinkCategoryProps[];
}

interface SidebarProps {
    auth: AuthService;
    isSidebarOpen: boolean;
}

function Sidebar({ auth, isSidebarOpen }: SidebarProps) {
    // We use empty objects for the links to control the placeholders better, this means we need to cast
    const [sidebar, setSidebar] = useState<SidebarData>(sidebarData as SidebarData);

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
        <div className={`transition-all overflow-hidden whitespace-nowrap ${isSidebarOpen ? 'flex-[0_0_200px]' : 'flex-[0_0_0%]'}`}>
            {sidebar.linksByCategory.map(linkCategory => <SidebarLinkCategory key={linkCategory.id} linkCategory={linkCategory} />)}
        </div>
    );
};

export default Sidebar;