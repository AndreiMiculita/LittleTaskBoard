import React, { ReactNode, useState, Children, isValidElement, cloneElement, Attributes } from 'react';
import { ToastContainer } from 'react-toastify';
import AuthService from '../Services/AuthService.js';
import HeaderBar from '../components/HeaderBar.tsx';
import Sidebar from '../components/Sidebar.tsx';
import UserPanel from '../components/UserPanel.tsx';

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
                    <header className="App-header">
                        <HeaderBar
                            onClickSidebarButton={() => setIsSidebarOpen(!isSidebarOpen)}
                            onClickUserProfileButton={() => setIsUserPanelOpen(!isUserPanelOpen)}
                        />
                    </header>
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

                        <div className="main">
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