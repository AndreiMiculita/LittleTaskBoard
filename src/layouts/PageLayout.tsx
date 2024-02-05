import { Attributes, Children, ReactNode, cloneElement, isValidElement, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import AuthService from '../Services/AuthService.js';
import HeaderBar from '../components/HeaderBar';
import Sidebar from '../components/Sidebar';
import UserPanel from '../components/UserPanel';

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
        <div className="App">
            {auth && auth.isLoggedIn() ? (
                <>
                    <HeaderBar
                        onClickSidebarButton={() => setIsSidebarOpen(!isSidebarOpen)}
                        onClickUserProfileButton={() => setIsUserPanelOpen(!isUserPanelOpen)}
                    />
                    <div className="content">
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

                        <div className='flex-1 p-4 min-w-0'>
                            {childrenWithProps}
                        </div>

                        <UserPanel auth={auth} isUserPanelOpen={isUserPanelOpen} />
                    </div>
                </>
            ) : (
                <>
                    {childrenWithProps}
                </>
            )}
        </div>
    );
};

export default PageLayout;