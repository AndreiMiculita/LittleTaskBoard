import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UserProfileButton from './UserProfileButton';

interface HeaderBarProps {
    onClickSidebarButton: () => void;
    onClickUserProfileButton: () => void;
}

function HeaderBar({ onClickSidebarButton, onClickUserProfileButton }: HeaderBarProps) {
    return (
        <header className="flex justify-between items-center w-full sticky backdrop-blur h-14 z-50 top-0">
            <button className='sidebarButton' onClick={onClickSidebarButton}>
                <FontAwesomeIcon icon={faBars} />
                Menu
            </button>
            <h1 className='text-2xl italic font-semibold'>
                Little Task Board
            </h1>
            <UserProfileButton onClickUserProfileButton={onClickUserProfileButton} />
        </header>
    );
};

export default HeaderBar;