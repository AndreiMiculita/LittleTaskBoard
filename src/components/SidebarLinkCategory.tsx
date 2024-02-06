import { SidebarLinkCategoryProps } from '../components/Sidebar';
import SidebarLink from '../components/SidebarLink';

function SidebarLinkCategory({ linkCategory }: { linkCategory: SidebarLinkCategoryProps }) {
    return (
        <div className="flex flex-col">
            <h3 className='p-5 text-lg font-medium'>{linkCategory.title}</h3>
            {linkCategory.links.map((link) => (
                <SidebarLink key={link.id || Math.random()} link={link} />
            ))}
        </div>
    );
}

export default SidebarLinkCategory;
