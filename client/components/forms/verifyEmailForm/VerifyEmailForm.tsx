'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { VerifyEmailFormValues } from '@/components/forms/verifyEmailForm/verifyEmailForm.types';
import { verifyEmailSchema } from '@/components/forms/verifyEmailForm/verifyEmailForm.validation';
import { Button } from '@/components/ui/button/Button';
import { ControlledTextField } from '@/components/ui/controlled/controlledTextField/ControlledTextField';
import { useSignupStepGuard } from '@/hooks/useSignupStepGuard';
import { useSignupFlowStore } from '@/stores/signupFlow.store';

import Envelope from '../../icons/Envelope';

export const VerifyEmailForm = () => {
    const router = useRouter();
    const savedEmail = useSignupFlowStore((state) => state.email);
    const maxAllowedStep = useSignupFlowStore((state) => state.maxAllowedStep);
    const setEmail = useSignupFlowStore((state) => state.setEmail);
    const setMaxAllowedStep = useSignupFlowStore((state) => state.setMaxAllowedStep);

    useSignupStepGuard('code', maxAllowedStep);

    const { control, handleSubmit, reset } = useForm<VerifyEmailFormValues>({
        resolver: zodResolver(verifyEmailSchema),
        defaultValues: {
            email: savedEmail ?? '',
        },
    });

    const onSubmitForm = (data: VerifyEmailFormValues) => {
        setEmail(data.email);
        setMaxAllowedStep('code');

        reset();
        router.push('/signup/code');
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit(onSubmitForm)}>
            <div className="form-header mb-[32px]">
                <h2 className="font-bold text-[24px]">Verify your email</h2>
                <p className="text-[14px] text-sub-text mt-[8px]">
                    Enter your email to receive a verification code
                </p>
            </div>

            <div className="flex flex-col gap-5 justify-center mb-5">
                <ControlledTextField
                    placeholder="Ex: Johndoe@gmail.com"
                    control={control}
                    name="email"
                    Icon={Envelope}
                />
            </div>

            <Button className="mb-5" fullWidth>
                Continue
            </Button>
        </form>
    );
};
