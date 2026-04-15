import { ReactNode } from 'react';

import { SignupStepperContainer } from '@/components/auth/signupStepper/SignupStepperContainer';

export default function SignUpLayout({ children }: { children: ReactNode }) {
    return (
        <div>
            <SignupStepperContainer />
            <div>{children}</div>
        </div>
    );
}
