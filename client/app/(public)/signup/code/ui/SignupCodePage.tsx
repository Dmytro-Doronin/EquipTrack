'use client';

import { useRouter } from 'next/navigation';

import { VerificationCodeForm } from '@/components/forms/verificationCodeForm/VerificationCodeForm';
import { useSignupStepGuard } from '@/hooks/useSignupStepGuard';
import { useSignupFlowStore } from '@/stores/signupFlow.store';

export const SignupCodePage = () => {
    const maxAllowedStep = useSignupFlowStore((state) => state.maxAllowedStep);
    const router = useRouter();
    const setMaxAllowedStep = useSignupFlowStore((state) => state.setMaxAllowedStep);

    useSignupStepGuard('code', maxAllowedStep);

    const onSubmit = () => {
        setMaxAllowedStep('success-verification');
        router.push('/signup/success-verification');
    };

    return <VerificationCodeForm onSubmit={onSubmit} />;
};
