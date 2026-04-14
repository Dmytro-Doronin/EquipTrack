export const SIGNUP_STEPS = [
    {
        key: 'signup',
        label: 'Account',
        path: '/signup',
        order: 0,
    },
    {
        key: 'verify-email',
        label: 'Email',
        path: '/signup/verify-email',
        order: 1,
    },
    {
        key: 'code',
        label: 'Code',
        path: '/signup/code',
        order: 2,
    },
] as const;

export type SignupStepKey = (typeof SIGNUP_STEPS)[number]['key'];
