import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import BoardPage from './pages/BoardPage';
import TasksPage from './pages/TasksPage';
import TaskDetailPage from './pages/TaskDetailPage';
import PrivateRoute from './PrivateRoute';
import AuthService from './Services/AuthService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function LogoutHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.pathname === '/logout') {
      const authService = new AuthService();
      authService.logout();
      toast("You have been logged out.");
      navigate('/login')
    }
  }, [navigate]);

  return null;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={
          <PrivateRoute>
            <BoardPage />
          </PrivateRoute>
        } />
        <Route path="/tasks" element={
          <PrivateRoute>
            <TasksPage />
          </PrivateRoute>
        } />
        <Route path="/tasks/:id" element={
          <PrivateRoute>
            <TaskDetailPage />
          </PrivateRoute>
        } />
        <Route path="/calendar" element={
          <PrivateRoute>
            <div>Calendar</div> TODO: Add calendar
          </PrivateRoute>
        } />
        <Route path="/insights" element={
          <PrivateRoute>
            <div>Insights</div> TODO: Add insights
          </PrivateRoute>
        } />
      </Routes>
      <LogoutHandler />
    </Router>
  );
}

export default App;