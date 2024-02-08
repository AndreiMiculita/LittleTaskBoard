import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import AuthService from "../../Services/AuthService";
import { Input } from '../ui/input';
import { Button } from '../ui/button';

function UserLoginForm({ setAuth }: { setAuth: (auth: AuthService) => void }) {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
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
        }
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
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
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Log in
                </h1>
                <p className="text-sm text-muted-foreground">
                    Enter your details below to log in
                </p>
            </div>
            <form onSubmit={handleFormSubmit} className="flex flex-col">
                <Input
                    className='mb-4'
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={username}
                    onChange={handleChange}
                    required
                />
                <Input
                    className='mb-4'
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={handleChange}
                    required
                />
                <Button type="submit"> Log in </Button>
                <p className="text-sm flex justify-center items-center mt-4">
                    Forgot your password? <Link to='/forgot-password'><Button variant='link' >Reset it</Button></Link>
                </p>
                <p className="text-sm flex justify-center items-center">
                    Don't have an account? <Link to='/register'><Button variant='link' >Register</Button></Link>
                </p>
            </form>
        </>
    );
};

export { UserLoginForm };