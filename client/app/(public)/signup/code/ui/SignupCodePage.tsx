'use client';

import { VerificationCodeForm } from '@/components/forms/verificationCodeForm/VerificationCodeForm';
import { useSignupStepGuard } from '@/hooks/useSignupStepGuard';
import { useSignupFlowStore } from '@/stores/signupFlow.store';

export const SignupCodePage = () => {
    const maxAllowedStep = useSignupFlowStore((state) => state.maxAllowedStep);

    useSignupStepGuard('code', maxAllowedStep);

    return <VerificationCodeForm />;
};
