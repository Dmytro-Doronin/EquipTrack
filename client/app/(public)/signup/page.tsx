import { Suspense } from 'react';

import { SignupForm } from '@/components/forms/signupForm/SignupForm';
import { Loader } from '@/components/loader/Loader';

export default function SingUp() {
    return (
        <Suspense fallback={<Loader />}>
            <div className="auth-page">
                <SignupForm />
            </div>
        </Suspense>
    );
}
