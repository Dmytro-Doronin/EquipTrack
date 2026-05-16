import { Suspense } from 'react';

import { ResetPasswordForm } from '@/components/forms/resetPasswordForm/ResetPasswordForm';

export default function ResetPasswordPage() {
    return (
        <div className="auth-page">
            <Suspense>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
