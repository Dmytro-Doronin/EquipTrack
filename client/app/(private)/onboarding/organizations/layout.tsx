import { ReactNode } from 'react';

import { Header } from '@/components/header/Header';

export default function OnboardingLayout({ children }: { children: ReactNode }) {
    return (
        <div>
            <Header />
            <div>{children}</div>
        </div>
    );
}
