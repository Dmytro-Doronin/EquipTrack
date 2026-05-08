import { SignupPageKey, SignupStepKey } from '@/lib/constants/signupSteps';

export const SIGNUP_STEP_ORDER: Record<SignupPageKey, number> = {
    signup: 0,
    code: 2,
    'resend-email': 2,
    'success-verification': 3,
};

export const isStepAvailable = (step: SignupPageKey, maxAllowedStep: SignupStepKey) => {
    return SIGNUP_STEP_ORDER[step] <= SIGNUP_STEP_ORDER[maxAllowedStep];
};

// export const isStepCompleted = (step: SignupStepKey, currentStep: SignupStepKey) => {
//     return SIGNUP_STEP_ORDER[step] < SIGNUP_STEP_ORDER[currentStep];
// };
//
// export const getNextStep = (step: SignupPageKey): SignupStepKey | null => {
//     switch (step) {
//         case 'signup':
//             return 'code';
//         case 'resend-email':
//             return 'code';
//         case 'code':
//             return 'success-verification';
//         case 'success-verification':
//             return null;
//         default:
//             return null;
//     }
// };
