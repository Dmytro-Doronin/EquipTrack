'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { SignupStepKey } from '@/lib/constants/signupSteps';
import { SIGNUP_STEP_ORDER } from '@/utils/signupStep';

export const useSignupStepGuard = (
    currentStep: SignupStepKey,
    maxAllowedStep: SignupStepKey,
    fallbackPath: string = '/signup',
) => {
    const router = useRouter();

    useEffect(() => {
        if (SIGNUP_STEP_ORDER[currentStep] > SIGNUP_STEP_ORDER[maxAllowedStep]) {
            router.replace(fallbackPath);
        }
    }, [currentStep, maxAllowedStep, fallbackPath, router]);
};
