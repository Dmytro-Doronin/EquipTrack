'use client';

import { Logo } from '@/components/logo/Logo';
import { Button } from '@/components/ui/button/Button';

export const Header = () => {
    return (
        <header className="h-20 bg-white">
            <div className="h-full w-full flex items-center justify-between container-centered">
                <Logo />
                <div className="flex items-center gap-2">
                    <span>Have an account?</span>
                    <Button className="text-main font-bold" variant="link">
                        Login
                    </Button>
                </div>
            </div>
        </header>
    );
};
