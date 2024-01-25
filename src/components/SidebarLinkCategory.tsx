import { SidebarLinkCategoryProps } from '../components/Sidebar';
import SidebarLink from '../components/SidebarLink';

function SidebarLinkCategory({ linkCategory }: { linkCategory: SidebarLinkCategoryProps }) {
    return (
        <div className="sidebarLinkCategory">
            <h3>{linkCategory.title}</h3>
            {linkCategory.links.map((link) => (
                <SidebarLink key={link.id || Math.random()} link={link} />
            ))}
        </div>
    );
}

export default SidebarLinkCategory;
