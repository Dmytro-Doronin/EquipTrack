'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { VerifyEmailFormValues } from '@/components/forms/verifyEmailForm/verifyEmailForm.types';
import { verifyEmailSchema } from '@/components/forms/verifyEmailForm/verifyEmailForm.validation';
import { Loader } from '@/components/loader/Loader';
import { Button } from '@/components/ui/button/Button';
import { ControlledTextField } from '@/components/ui/controlled/controlledTextField/ControlledTextField';
import { useResendSignupCodeMutation } from '@/hooks/mutations/useResendSignupCodeMutation';
import { useSignupStepGuard } from '@/hooks/useSignupStepGuard';
import { useSignupFlowStore } from '@/stores/signupFlow.store';

import Envelope from '../../icons/Envelope';

export const ResendEmailForm = () => {
    const savedEmail = useSignupFlowStore((state) => state.email);
    const maxAllowedStep = useSignupFlowStore((state) => state.maxAllowedStep);
    const resendSignupCodeMutation = useResendSignupCodeMutation();

    useSignupStepGuard('code', maxAllowedStep);

    const { control, handleSubmit } = useForm<VerifyEmailFormValues>({
        resolver: zodResolver(verifyEmailSchema),
        defaultValues: {
            email: savedEmail ?? '',
        },
    });

    const onSubmitForm = (data: VerifyEmailFormValues) => {
        const formData = new FormData();

        formData.append('email', savedEmail ?? data.email);

        resendSignupCodeMutation.mutate(formData);
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

            {resendSignupCodeMutation.error && (
                <span className="mt-1 text-sm text-[12px] text-danger">
                    {resendSignupCodeMutation.error.message}
                </span>
            )}

            <Button className="mb-5" disabled={resendSignupCodeMutation.isPending} fullWidth>
                {resendSignupCodeMutation.isPending ? 'Continue...' : 'Continue'}
            </Button>
            {resendSignupCodeMutation.isPending && <Loader />}
        </form>
    );
};
