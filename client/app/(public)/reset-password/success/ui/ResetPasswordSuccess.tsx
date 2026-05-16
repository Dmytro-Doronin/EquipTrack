import Link from 'next/link';

import Checked from '@/components/icons/Checked';
import Lock from '@/components/icons/Lock';
import { Button } from '@/components/ui/button/Button';

export const ResetPasswordSuccess = () => {
    return (
        <div className="auth-page">
            <div className="auth-form flex flex-col items-center">
                <div className="relative w-20 h-20 flex items-center justify-center bg-success/10 rounded-full">
                    <Lock className="w-6 h-6 text-success" />
                    <Checked className="absolute top-3 right-3 w-6 h-6 text-success" />
                </div>

                <div className="form-header mb-8">
                    <h2 className="font-bold text-[24px] mt-6">Password changed</h2>
                    <p className="text-[14px] text-sub-text mt-2 text-center">
                        Your password has been changed successfully. You can now sign in with your
                        new password.
                    </p>
                </div>

                <Button as={Link} href="/signin" className="mb-5" fullWidth>
                    Back to Sign In
                </Button>
            </div>
        </div>
    );
};
