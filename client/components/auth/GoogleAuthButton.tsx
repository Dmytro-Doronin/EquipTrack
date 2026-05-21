'use client';

import { GoogleLogin } from '@react-oauth/google';
import { twMerge } from 'tailwind-merge';

import { useGoogleAuthMutation } from '@/hooks/mutations/useGoogleAuthMutation';
import { useNotificationStore } from '@/stores/notification.store';

type GoogleAuthButtonProps = {
    className?: string;
};

export const GoogleAuthButton = ({ className }: GoogleAuthButtonProps) => {
    const googleAuthMutation = useGoogleAuthMutation();
    const notifyError = useNotificationStore((state) => state.error);

    return (
        <div
            className={twMerge(
                'flex justify-center',
                googleAuthMutation.isPending && 'pointer-events-none opacity-70',
                className,
            )}
        >
            <GoogleLogin
                onSuccess={(response) => {
                    const idToken = response.credential;

                    if (!idToken) {
                        notifyError('Google token was not returned');
                        return;
                    }

                    googleAuthMutation.mutate(idToken);
                }}
                onError={() => {
                    notifyError('Google sign-in failed');
                }}
                useOneTap={false}
                size="large"
                shape="circle"
                text="continue_with"
            />
        </div>
    );
};
