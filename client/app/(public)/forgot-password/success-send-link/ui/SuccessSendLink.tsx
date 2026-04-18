'use client';

import Link from 'next/link';

import Checked from '@/components/icons/Checked';
import Envelope from '@/components/icons/Envelope';
import { Button } from '@/components/ui/button/Button';
import { useForgotPasswordFlowStore } from '@/stores/forgotPasswordFlow.store';

export const SuccessSendLink = () => {
    const forgotPasswordEmail = useForgotPasswordFlowStore((state) => state.email);

    return (
        <div className="auth-page">
            <div className="auth-form flex flex-col items-center">
                <div className="relative w-20 h-20 flex items-center justify-center bg-success/10 rounded-full">
                    <Envelope className="w-6 h-6 text-success" />
                    <Checked className="absolute top-3 right-3 w-6 h-6 text-success" />
                </div>
                <div className="form-header mb-8">
                    <h2 className="font-bold text-[24px] mt-6">Link sent</h2>
                    <p className="text-[14px] text-sub-text mt-2 text-center">
                        We sent a password reset link to{' '}
                        <b>{forgotPasswordEmail ?? 'your email address'}</b>. Check your inbox and
                        follow the instructions.
                    </p>
                </div>

                <Button as={Link} href="/signin" className="mb-5" fullWidth>
                    Back to Sign In
                </Button>
            </div>
        </div>
    );
};
