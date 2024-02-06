import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UserProfileButton from './UserProfileButton';
import { Input } from './ui/input';

interface HeaderBarProps {
    onClickSidebarButton: () => void;
    onClickUserProfileButton: () => void;
}

function HeaderBar({ onClickSidebarButton, onClickUserProfileButton }: HeaderBarProps) {
    return (
        <header className="flex justify-between items-center w-full sticky backdrop-blur h-14 z-50 top-0 border-b border-border/40">
            <div className="flex items-center">
                <button className='px-8' onClick={onClickSidebarButton}>
                    <FontAwesomeIcon icon={faBars} />
                </button>
                <h1 className='text-xl italic font-semibold'>
                    Little Task Board
                </h1>
            </div>
            <Input
                type="search"
                placeholder="Search"
                className="w-1/3"
            />
            <UserProfileButton onClickUserProfileButton={onClickUserProfileButton} />
        </header>
    );
};

export default HeaderBar;