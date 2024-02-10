import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import AuthService from "../../Services/AuthService";
import { Button } from '../ui/button';
import { Input } from '../ui/input';

function UserRegisterForm({ setAuth }: { setAuth: (auth: AuthService) => void }) {
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
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Create an account
                </h1>
                <p className="text-sm text-muted-foreground">
                    Enter your email below to create your account
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
                <Input
                    className='mb-4'
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={handleChange}
                    required
                />
                <Button type="submit"> Register </Button>
                <p className="text-sm flex justify-center items-center mt-4">
                    Already have an account? <Link to='/Login'><Button variant='link' >Log in</Button></Link>
                </p>
                <p className="mt-4 text-center text-sm text-muted-foreground">
                    By clicking "Register", you agree to our{" "}
                    <Link
                        to="/terms"
                        className="underline underline-offset-4 hover:text-primary"
                    >
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                        to="/privacy"
                        className="underline underline-offset-4 hover:text-primary"
                    >
                        Privacy Policy
                    </Link>
                    .
                </p>
            </form>
        </>
    );
};

export { UserRegisterForm };
