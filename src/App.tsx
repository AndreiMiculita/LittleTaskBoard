import { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from './PrivateRoute';
import AuthService from './Services/AuthService';
import PageLayout from './layouts/PageLayout';
import BoardPage from './pages/BoardPage';
import CalendarPage from './pages/CalendarPage';
import InsightsPage from './pages/InsightsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TaskDetailPage from './pages/TaskDetailPage';
import TasksPage from './pages/TasksPage';

function LogoutHandler({ setAuth }: { setAuth: (auth: AuthService) => void }) {
    const navigate = useNavigate();

    useEffect(() => {
        if (window.location.pathname === '/logout') {
            const authService = new AuthService();
            authService.logout();
            setAuth(authService); // This will cause a re-render, which we want, to hide other elements in PageLayout
            toast("You have been logged out.");
            navigate('/login')
        }
    }, [navigate]);

    return null;
}

function App() {
    const [auth, setAuth] = useState<AuthService>(new AuthService());

    return (
        <Router>
            <PageLayout auth={auth}>
                <Routes>
                    <Route path="/login" element={<LoginPage setAuth={setAuth} />} />
                    <Route path="/register" element={<RegisterPage setAuth={setAuth} />} />
                    <Route path="/" element={
                        <PrivateRoute>
                            <BoardPage auth={auth} />
                        </PrivateRoute>
                    } />
                    <Route path="/tasks" element={
                        <PrivateRoute>
                            <TasksPage auth={auth} />
                        </PrivateRoute>
                    } />
                    <Route path="/tasks/:id" element={
                        <PrivateRoute>
                            <TaskDetailPage auth={auth} />
                        </PrivateRoute>
                    } />
                    <Route path="/calendar" element={
                        <PrivateRoute>
                            <CalendarPage auth={auth} />
                        </PrivateRoute>
                    } />
                    <Route path="/insights" element={
                        <PrivateRoute>
                            <InsightsPage auth={auth} />
                        </PrivateRoute>
                    } />
                </Routes>
                <LogoutHandler setAuth={setAuth} />
            </PageLayout>
        </Router>
    );
}

export default App;