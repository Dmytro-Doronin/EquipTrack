'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { codeResendAction } from '@/actions/ResendCodeAction';
import { VerifyEmailFormValues } from '@/components/forms/verifyEmailForm/verifyEmailForm.types';
import { verifyEmailSchema } from '@/components/forms/verifyEmailForm/verifyEmailForm.validation';
import { Loader } from '@/components/loader/Loader';
import { Button } from '@/components/ui/button/Button';
import { ControlledTextField } from '@/components/ui/controlled/controlledTextField/ControlledTextField';
import { useSignupStepGuard } from '@/hooks/useSignupStepGuard';
import { useSignupFlowStore } from '@/stores/signupFlow.store';

import Envelope from '../../icons/Envelope';

export const ResendEmailForm = () => {
    const router = useRouter();
    const savedEmail = useSignupFlowStore((state) => state.email);
    const maxAllowedStep = useSignupFlowStore((state) => state.maxAllowedStep);
    const setMaxAllowedStep = useSignupFlowStore((state) => state.setMaxAllowedStep);
    const [serverError, setServerError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [codeError, setCodeError] = useState<string | null>(null);
    const finalErrorMessage = serverError ?? codeError;

    useSignupStepGuard('code', maxAllowedStep);

    const { control, handleSubmit } = useForm<VerifyEmailFormValues>({
        resolver: zodResolver(verifyEmailSchema),
        defaultValues: {
            email: savedEmail ?? '',
        },
    });

    const onSubmitForm = async (data: VerifyEmailFormValues) => {
        setServerError(null);

        const formData = new FormData();

        formData.append('email', data.email);

        setIsLoading(true);

        try {
            const result = await codeResendAction(savedEmail ?? '');

            if (!result.success) {
                const resendError = result.errors?.resend?.[0];

                setServerError(resendError ?? result.message ?? 'Resend code failed');

                return;
            }

            setMaxAllowedStep('code');
            router.push('/signup/code');
        } catch {
            setCodeError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
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

            {finalErrorMessage && (
                <span className="mt-1 text-sm text-[12px] text-danger">{finalErrorMessage}</span>
            )}

            <Button className="mb-5" disabled={isLoading} fullWidth>
                {isLoading ? 'Continue...' : 'Continue'}
            </Button>
            {isLoading && <Loader />}
        </form>
    );
};
