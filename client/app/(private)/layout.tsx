import { ReactNode } from 'react';

import { Header } from '@/components/header/Header';

export default function PublicLayout({ children }: { children: ReactNode }) {
    return (
        <div>
            <main className="h-dvh bg-gray-main">
                <Header />
                {children}
            </main>
        </div>
    );
}
