'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { SignupStepKey } from '@/lib/constants/signupSteps';

type SignupFlowState = {
    email: string | null;
    maxAllowedStep: SignupStepKey;
    setEmail: (email: string) => void;
    setMaxAllowedStep: (step: SignupStepKey) => void;
    resetSignupFlow: () => void;
};

export const useSignupFlowStore = create<SignupFlowState>()(
    persist(
        (set) => ({
            email: null,
            maxAllowedStep: 'signup',

            setEmail: (email) => set({ email }),

            setMaxAllowedStep: (step) => set({ maxAllowedStep: step }),

            resetSignupFlow: () =>
                set({
                    email: null,
                    maxAllowedStep: 'signup',
                }),
        }),
        {
            name: 'signup-flow',
        },
    ),
);
