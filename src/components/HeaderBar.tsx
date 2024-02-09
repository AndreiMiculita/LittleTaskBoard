import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UserProfileButton from './UserProfileButton';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface HeaderBarProps {
    onClickSidebarButton: () => void;
    onClickUserProfileButton: () => void;
}

function HeaderBar({ onClickSidebarButton, onClickUserProfileButton }: HeaderBarProps) {
    return (
        <header className="flex justify-between items-center w-full sticky backdrop-blur h-14 z-50 top-0 border-b border-border/40 px-4">
            <div className="flex items-center gap-4">
                <Button variant='ghost' onClick={onClickSidebarButton}>
                    <FontAwesomeIcon icon={faBars} />
                </Button>
                <h1 className='text-xl font-semibold text-orange-600 [text-shadow:_1px_1px_0_rgb(255_250_200_/_80%)]'>
                    Little Task Board
                </h1>
            </div>
            <Input
                type="search"
                placeholder="Search..."
                className="w-1/3"
            />
            <UserProfileButton onClickUserProfileButton={onClickUserProfileButton} />
        </header>
    );
};

export default HeaderBar;