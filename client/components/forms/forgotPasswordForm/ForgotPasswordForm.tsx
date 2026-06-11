'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { ForgotPasswordFormValues } from '@/components/forms/forgotPasswordForm/forgotPasswordForm.types';
import { forgotPasswordSchema } from '@/components/forms/forgotPasswordForm/forgotPasswordForm.validation';
import { Loader } from '@/components/loader/Loader';
import { Button } from '@/components/ui/button/Button';
import { ControlledTextField } from '@/components/ui/controlled/controlledTextField/ControlledTextField';
import { useForgotPasswordStartMutation } from '@/hooks/mutations/useForgotPasswordStartMutation';
import { useForgotPasswordFlowStore } from '@/stores/forgotPasswordFlow.store';

import Envelope from '../../icons/Envelope';

export const ForgotPasswordForm = () => {
    const router = useRouter();
    const forgotPasswordMutation = useForgotPasswordStartMutation();
    const setEmail = useForgotPasswordFlowStore((state) => state.setEmail);

    const { control, handleSubmit, reset } = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
    });

    const onSubmitForm = async (data: ForgotPasswordFormValues) => {
        const formData = new FormData();

        formData.append('email', data.email);

        try {
            await forgotPasswordMutation.mutateAsync(formData);

            setEmail(data.email);

            reset();
            router.push('/forgot-password/success-send-link');
        } catch {
            // Error display is handled by the mutation state.
        }
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
