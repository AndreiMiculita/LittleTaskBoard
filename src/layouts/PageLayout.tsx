import { Attributes, Children, ReactNode, cloneElement, isValidElement, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import AuthService from '../Services/AuthService.js';
import HeaderBar from '../components/HeaderBar';
import Sidebar from '../components/Sidebar';
import UserPanel from '../components/UserPanel';
import { Separator } from '../components/ui/separator';

type PageLayoutProps = {
    children: ReactNode;
    auth: AuthService
};

const mapChildrenWithProps = (children: ReactNode, auth: AuthService) => {
    return Children.map(children, (child) => {
        if (isValidElement(child)) {
            return cloneElement(child, { auth: auth } as Attributes);
        }
        return child;
    });
};

function PageLayout({ children, auth }: PageLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isUserPanelOpen, setIsUserPanelOpen] = useState(false);

    const childrenWithProps = mapChildrenWithProps(children, auth);

    return (
        <div>
            {auth && auth.isLoggedIn() ? (
                <div className="min-h-screen flex flex-col flex-grow">
                    <HeaderBar
                        onClickSidebarButton={() => setIsSidebarOpen(!isSidebarOpen)}
                        onClickUserProfileButton={() => setIsUserPanelOpen(!isUserPanelOpen)}
                    />
                    <div className="grow flex flex-row justify-center items-stretch">
                        <ToastContainer
                            position="bottom-right"
                            autoClose={5000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            draggable
                        />
                        <Sidebar auth={auth} isSidebarOpen={isSidebarOpen} />
                        <Separator className='h-auto' orientation="vertical" />

                        <div className='grow p-4 min-w-0'>
                            {childrenWithProps}
                        </div>

                        <Separator className='h-auto' orientation="vertical" />
                        <UserPanel auth={auth} isUserPanelOpen={isUserPanelOpen} />
                    </div>
                </div>
            ) : (
                <>
                    {childrenWithProps}
                </>
            )}
        </div>
    );
};

export default PageLayout;