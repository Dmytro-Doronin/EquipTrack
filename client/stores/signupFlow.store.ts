import { create } from 'zustand';

import { SignupStepKey } from '@/lib/constants/signupSteps';
type SignupFlowState = {
    email: string | null;
    maxAllowedStep: SignupStepKey;
    setEmail: (email: string) => void;
    setMaxAllowedStep: (step: SignupStepKey) => void;
    resetSignupFlow: () => void;
};

export const useSignupFlowStore = create<SignupFlowState>((set) => ({
    email: null,
    maxAllowedStep: 'signup',
    setEmail: (email) => set({ email }),
    setMaxAllowedStep: (step) => set({ maxAllowedStep: step }),
    resetSignupFlow: () =>
        set({
            email: null,
            maxAllowedStep: 'signup',
        }),
}));
