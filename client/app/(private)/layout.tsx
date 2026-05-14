import { ReactNode } from 'react';

import { Providers } from '@/providers/Providers';

export default function PublicLayout({ children }: { children: ReactNode }) {
    return (
        <div>
            <main className="h-dvh bg-gray-main">
                <Providers>{children}</Providers>
            </main>
        </div>
    );
}
