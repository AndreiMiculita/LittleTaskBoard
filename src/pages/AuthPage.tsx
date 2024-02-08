import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import AuthService from '../Services/AuthService';
import { UserLoginForm } from '../components/auth_forms/UserLoginForm';
import { UserRegisterForm } from '../components/auth_forms/UserRegisterForm';
import { buttonVariants } from '../components/ui/button';
import { cn } from '../lib/utils';

interface AuthPageProps {
    setAuth: (auth: AuthService) => void;
    isLogin: boolean;
}

function AuthPage({ setAuth, isLogin }: AuthPageProps) {

    document.title = `${isLogin ? 'Login' : 'Register'} - Little Task Board`;

    return (
        <>
            <ToastContainer />
            <div className="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
                <Link
                    to={isLogin ? "/register" : "/login"}
                    className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "hidden md:block absolute right-4 top-4 md:right-8 md:top-8"
                    )}
                >
                    {isLogin ? "Register" : "Login"}
                </Link>
                <div className="relative hidden h-full flex-col bg-gradient-to-br from-zinc-900 to-amber-950 p-10 text-white lg:flex dark:border-r">
                    <div className='relative z-20 flex items-center text-xl italic font-semibold'>
                        Little Task Board
                    </div>
                    <div className="relative z-20 mt-auto">
                        <p className="text-lg">
                            Get working 👏
                        </p>
                    </div>
                </div>
                <div className="lg:p-8 mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                {isLogin ? <UserLoginForm setAuth={setAuth} /> : <UserRegisterForm setAuth={setAuth} />}
                </div>
            </div>
        </>
    );
};

export default AuthPage;
