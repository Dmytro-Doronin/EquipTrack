'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { ForgotPasswordFormValues } from '@/components/forms/forgotPasswordForm/forgotPasswordForm.types';
import { forgotPasswordSchema } from '@/components/forms/forgotPasswordForm/forgotPasswordForm.validation';
import { Loader } from '@/components/loader/Loader';
import { Button } from '@/components/ui/button/Button';
import { ControlledTextField } from '@/components/ui/controlled/controlledTextField/ControlledTextField';
import { useForgotPasswordStartMutation } from '@/hooks/mutations/useForgotPasswordStartMutation';

import Envelope from '../../icons/Envelope';

export const ForgotPasswordForm = () => {
    const forgotPasswordMutation = useForgotPasswordStartMutation();

    const { control, handleSubmit, reset } = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
    });

    const onSubmitForm = (data: ForgotPasswordFormValues) => {
        const formData = new FormData();

        formData.append('email', data.email);

        forgotPasswordMutation.mutate(
            { email: data.email, formData },
            {
                onSuccess: () => {
                    reset();
                },
            },
        );
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit(onSubmitForm)}>
            <div className="form-header mb-[32px]">
                <h2 className="font-bold text-[24px]">Forgot password?</h2>
                <p className="text-[14px] text-sub-text mt-[8px]">
                    Enter your email and we will send you a reset link
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

            {forgotPasswordMutation.error && (
                <p className="text-red-500 text-sm mb-4">{forgotPasswordMutation.error.message}</p>
            )}

            <Button className="mb-5" fullWidth disabled={forgotPasswordMutation.isPending}>
                {forgotPasswordMutation.isPending ? 'Sending link...' : 'Send Link'}
            </Button>

            {forgotPasswordMutation.isPending && <Loader />}
        </form>
    );
};
