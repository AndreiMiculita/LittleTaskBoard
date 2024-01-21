import React, { useState } from 'react';
import HeaderBar from '../components/HeaderBar.tsx';
import Sidebar from '../components/Sidebar';
import UserPanel from '../components/UserPanel';
import { ToastContainer } from 'react-toastify';

function PageLayout({ children, auth }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isUserPanelOpen, setIsUserPanelOpen] = useState(false);

    const childrenWithProps = React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, { auth });
        }
        return child;
    });

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
}

export default PageLayout;