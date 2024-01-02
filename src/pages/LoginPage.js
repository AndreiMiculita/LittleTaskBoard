import React, { useState } from 'react';
import AuthService from '../Services/AuthService';
import { Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

function LoginPage({setAuth}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirectToReferrer, setRedirectToReferrer] = useState(false);

    const auth = new AuthService();

    if (auth.isLoggedIn()) {
        setAuth(auth);
        return <Navigate to="/" />;
    }

    const handleChange = (e) => {
        if (e.target.name === 'username') {
            setUsername(e.target.value);
        } else if (e.target.name === 'password') {
            setPassword(e.target.value);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        auth.login(username, password)
            .then(() => {
                setRedirectToReferrer(true);
            })
            .catch((err) => {
                alert(err);
            });
    };

    if (redirectToReferrer) {
        return <Navigate to="/" />;
    }

    return (
        <>
            <ToastContainer />
            <div className="login">
                <h1>Log in</h1>
                <form onSubmit={handleFormSubmit}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={username}
                        onChange={handleChange}
                        required
                    />
                    <br />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={handleChange}
                        required
                    />
                    <br />
                    <input type="submit" value="Submit" />
                </form>
                <p>
                    <a href="/forgotpassword">Forgot password?</a>
                </p>
                <p>
                    Don't have an account? <a href="/register">Register</a>
                </p>
            </div>
        </>
    );
};

export default LoginPage;