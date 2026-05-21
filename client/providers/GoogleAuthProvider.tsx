'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { PropsWithChildren } from 'react';

export const GoogleAuthProvider = ({ children }: PropsWithChildren) => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!clientId) {
        throw new Error('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not defined');
    }

    return <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>;
};
