'use client';

import Link from 'next/link';

import { ControlPanelTrigger } from '@/components/controlPanel/ControlPanelTrigger';
import { Logo } from '@/components/logo/Logo';
import { Button } from '@/components/ui/button/Button';
import { linkOptions } from '@/mock/linkOptions';
import { useAuthStore } from '@/stores/auth.store';

export const Header = () => {
    const user = useAuthStore((state) => state.user);
    const isAuth = !!user?.login;
    return (
        <header className="h-20 bg-white">
            <div className="h-full w-full flex items-center justify-between container-centered">
                <Logo />
                <div className="flex items-center gap-2">
                    {isAuth ? (
                        <ControlPanelTrigger user={user} options={linkOptions} />
                    ) : (
                        <>
                            <Button as={Link} href="/signup">
                                Registration
                            </Button>
                            <Button as={Link} href="/signin" variant="secondary">
                                Log In
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};
