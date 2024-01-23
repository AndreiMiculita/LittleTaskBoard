import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import AuthService from '../Services/AuthService.tsx';

function RegisterPage({ setAuth }: { setAuth: (auth: AuthService) => void }) {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [redirectToReferrer, setRedirectToReferrer] = useState<boolean>(false);

    const auth = new AuthService();

    if (auth.isLoggedIn()) {
        setAuth(auth);
        return <Navigate to="/" />;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (e.target.name === 'username') {
            setUsername(e.target.value);
        } else if (e.target.name === 'password') {
            setPassword(e.target.value);
        } else if (e.target.name === 'confirmPassword') {
            setConfirmPassword(e.target.value);
        }
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        auth.register(username, password)
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
            <div className="register">
                <h1>Register</h1>
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
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    <br />
                    <input type="submit" value="Submit" />
                </form>
                <p>
                    Already have an account? <a href="/login">Log in</a>
                </p>
            </div>
        </>
    );
};

export default RegisterPage;
