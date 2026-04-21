import { ReactNode } from 'react';

export default function OnboardingLayout({ children }: { children: ReactNode }) {
    return (
        <div>
            <div>{children}</div>
        </div>
    );
}
