import { Suspense } from 'react';

import { SignInForm } from '@/components/forms/signinForm/SigninForm';
import { Loader } from '@/components/loader/Loader';

export default function SignIn() {
    return (
        <Suspense fallback={<Loader />}>
            <div className="auth-page">
                <SignInForm />
            </div>
        </Suspense>
    );
}
