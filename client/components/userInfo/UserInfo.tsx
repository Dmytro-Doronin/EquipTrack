import { cva, VariantProps } from 'class-variance-authority';
import Image from 'next/image';

import { User } from '@/actions/types';

export const userLoginTextVariants = cva('truncate text-sm font-semibold text-start', {
    variants: {
        variant: {
            light: 'text-white',
            dark: 'text-dark',
        },
    },
    defaultVariants: {
        variant: 'light',
    },
});

type UserLoginTextVariantProps = VariantProps<typeof userLoginTextVariants>;

type UserInfoProps = {
    user: User;
    variant?: UserLoginTextVariantProps['variant'];
};

export const UserInfo = ({ user, variant }: UserInfoProps) => {
    const { avatarUrl, email, login } = user;
    return (
        <>
            <div className="grid size-10 shrink-0 place-items-center rounded-full bg-gray-200 text-sm font-bold text-dark">
                {avatarUrl ? (
                    <Image src={avatarUrl ?? ''} alt="avatar" />
                ) : (
                    <span>{login.slice(0, 1)}</span>
                )}
            </div>
            <div className="min-w-0 flex-1">
                <h2 className={userLoginTextVariants({ variant })}>{login}</h2>
                <p className="truncate text-xs text-gray-400">{email}</p>
            </div>
        </>
    );
};
