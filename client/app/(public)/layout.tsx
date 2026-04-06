import { ReactNode } from 'react';

export default function PublicLayout({ children }: { children: ReactNode }) {
    return (
        <div>
            <main className="h-dvh bg-background container-centered">
                <div className="text-black">HEADER</div>
                {children}
            </main>
        </div>
    );
}
