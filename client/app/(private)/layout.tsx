import { ReactNode } from 'react';

export default function PublicLayout({ children }: { children: ReactNode }) {
    return (
        <div>
            <main className="h-dvh bg-gray-main">{children}</main>
        </div>
    );
}
