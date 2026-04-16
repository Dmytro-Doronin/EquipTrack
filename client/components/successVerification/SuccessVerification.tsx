'use client';
import { useSignupStepGuard } from '@/hooks/useSignupStepGuard';
import { useSignupFlowStore } from '@/stores/signupFlow.store';

export const SuccessVerification = () => {
    const maxAllowedStep = useSignupFlowStore((state) => state.maxAllowedStep);
    useSignupStepGuard('success-verification', maxAllowedStep);

    return <div>asd</div>;
};
