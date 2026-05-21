import { Suspense } from 'react';

import { ForgotPasswordForm } from '@/components/forms/forgotPasswordForm/ForgotPasswordForm';
import { Loader } from '@/components/loader/Loader';

export default function ForgotPasswordPage() {
    return (
        <Suspense fallback={<Loader />}>
            <div className="auth-page">
                <ForgotPasswordForm />
            </div>
        </Suspense>
    );
}
