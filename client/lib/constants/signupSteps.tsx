import Account from '@/components/icons/Account';
import Envelope from '@/components/icons/Envelope';
import Secure from '@/components/icons/Secure';
import SecureSuccess from '@/components/icons/SecureSuccess';

export const SIGNUP_STEPS = [
    {
        key: 'signup',
        label: 'Account',
        icon: Account,
        path: '/signup',
        order: 0,
    },
    {
        key: 'verify-email',
        label: 'Email',
        path: '/signup/verify-email',
        icon: Envelope,
        order: 1,
    },
    {
        key: 'code',
        label: 'Code',
        path: '/signup/code',
        icon: Secure,
        order: 2,
    },
    {
        key: 'success-verification',
        label: 'Success',
        path: '/signup/success-verification',
        icon: SecureSuccess,
        order: 3,
    },
] as const;

export type SignupStepKey = (typeof SIGNUP_STEPS)[number]['key'];
