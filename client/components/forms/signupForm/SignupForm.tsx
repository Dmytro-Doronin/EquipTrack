'use client';

import { AvatarChanger } from '@/components/avatarChanger/AvatarChanger';

export const SignupForm = () => {
    return (
        <form className="auth-form">
            <AvatarChanger />
        </form>
    );
};
