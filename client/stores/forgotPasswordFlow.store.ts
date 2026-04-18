import { create } from 'zustand';

type ForgotPasswordFlowState = {
    email: string | null;
    setEmail: (email: string) => void;
    resetForgotPasswordFlow: () => void;
};

export const useForgotPasswordFlowStore = create<ForgotPasswordFlowState>((set) => ({
    email: null,
    setEmail: (email) => set({ email }),
    resetForgotPasswordFlow: () => set({ email: null }),
}));
