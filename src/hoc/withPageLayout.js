import React, { useState } from 'react';
import HeaderBar from '../components/HeaderBar';
import Sidebar from '../components/Sidebar';
import UserPanel from '../components/UserPanel';
import AuthService from '../Services/AuthService';
import { ToastContainer } from 'react-toastify';

function withPageLayout(WrappedComponent) {
    return function PageLayout(props) {
        const [isSidebarOpen, setIsSidebarOpen] = useState(true);
        const [isUserPanelOpen, setIsUserPanelOpen] = useState(false);

        const auth = new AuthService();

        return (
            <div className="App">
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

                    <WrappedComponent {...props} auth={auth} />

                    <UserPanel auth={auth} isUserPanelOpen={isUserPanelOpen} />
                </div>
            </div>
        );
    };
}

export default withPageLayout;