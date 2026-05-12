'use client';

import { Logo } from '@/components/logo/Logo';
import { Button } from '@/components/ui/button/Button';
import { useAuthStore } from '@/stores/auth.store';

export const Header = () => {
    const user = useAuthStore((state) => state.user);

    return (
        <header className="h-20 bg-white">
            <div className="h-full w-full flex items-center justify-between container-centered">
                <Logo />
                <div className="flex items-center gap-2">
                    <span>Have an account?</span>
                    {user && <div>{user.login}</div>}
                    <Button className="text-main font-bold" variant="link">
                        Login
                    </Button>
                </div>
            </div>
        </header>
    );
};
