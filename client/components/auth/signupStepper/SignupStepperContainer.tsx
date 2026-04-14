'use client';

import { useSignupFlowStore } from '@/stores/signupFlow.store';

import { SignupStepper } from './SignupStepper';

export const SignupStepperContainer = () => {
    const maxAllowedStep = useSignupFlowStore((state) => state.maxAllowedStep);

    return <SignupStepper maxAllowedStep={maxAllowedStep} />;
};
