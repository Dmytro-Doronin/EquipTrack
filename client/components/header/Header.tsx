'use client';

import { Logo } from '@/components/logo/Logo';

export const Header = () => {
    return (
        <header className="h-20 bg-white">
            <div className="h-full w-full flex items-center justify-between container-centered">
                <Logo />
                <div>Have an account? Login</div>
            </div>
        </header>
    );
};
