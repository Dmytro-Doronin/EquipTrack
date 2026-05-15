'use client';
import { useRouter } from 'next/navigation';

import Checked from '@/components/icons/Checked';
import Envelope from '@/components/icons/Envelope';
import { Button } from '@/components/ui/button/Button';
import { useSignupStepGuard } from '@/hooks/useSignupStepGuard';
import { useSignupFlowStore } from '@/stores/signupFlow.store';

export const SuccessVerification = () => {
    const maxAllowedStep = useSignupFlowStore((state) => state.maxAllowedStep);
    useSignupStepGuard('success-verification', maxAllowedStep);
    const signupEmail = useSignupFlowStore((state) => state.email);
    const resetSignupFlow = useSignupFlowStore((state) => state.resetSignupFlow);
    const router = useRouter();
    const onContinue = () => {
        resetSignupFlow();
        router.push('/signin');
    };

    return (
        <div className="auth-page">
            <div className="auth-form flex flex-col items-center">
                <div className="relative w-20 h-20 flex items-center justify-center bg-success-light rounded-full">
                    <Envelope className="w-6 h-6 text-success" />
                    <Checked className="absolute top-3 right-3 w-6 h-6 text-success" />
                </div>
                <div className="form-header mb-8">
                    <h2 className="font-bold text-[24px] mt-6">Email verified</h2>
                    <p className="text-[14px] text-sub-text mt-2 text-justify">
                        Your email address <b>{signupEmail}</b> has been verified. In the future you
                        need to use this email address when logging in to ET.
                    </p>
                </div>

                <Button onClick={onContinue} className="mb-5" fullWidth>
                    Continue
                </Button>
                <p className="text-[12px] text-sub-text">
                    By clicking signup, you agree to accept ET Terms and Conditions
                </p>
            </div>
        </div>
    );
};
