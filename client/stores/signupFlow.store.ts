'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { SignupPageKey } from '@/lib/constants/signupSteps';

type SignupFlowState = {
    email: string | null;
    maxAllowedStep: SignupPageKey;
    setEmail: (email: string) => void;
    setMaxAllowedStep: (step: SignupPageKey) => void;
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
