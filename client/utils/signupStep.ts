import { SignupStepKey } from '@/lib/constants/signupSteps';

export const SIGNUP_STEP_ORDER: Record<SignupStepKey, number> = {
    signup: 0,
    'verify-email': 1,
    code: 2,
};

export const isStepAvailable = (step: SignupStepKey, maxAllowedStep: SignupStepKey) => {
    return SIGNUP_STEP_ORDER[step] <= SIGNUP_STEP_ORDER[maxAllowedStep];
};

export const isStepCompleted = (step: SignupStepKey, currentStep: SignupStepKey) => {
    return SIGNUP_STEP_ORDER[step] < SIGNUP_STEP_ORDER[currentStep];
};

export const getNextStep = (step: SignupStepKey): SignupStepKey | null => {
    switch (step) {
        case 'signup':
            return 'verify-email';
        case 'verify-email':
            return 'code';
        case 'code':
            return null;
        default:
            return null;
    }
};
