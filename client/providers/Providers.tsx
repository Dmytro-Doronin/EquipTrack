import { PropsWithChildren } from 'react';

import { AuthBootstrap } from '@/components/auth/authBootstrap/AuthBootstrap';

export const Providers = ({ children }: PropsWithChildren) => {
    return <AuthBootstrap>{children}</AuthBootstrap>;
};
