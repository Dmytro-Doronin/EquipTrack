'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { forgotPasswordAction } from '@/actions/ForgotPasswordAction';
import { ForgotPasswordFormValues } from '@/components/forms/forgotPasswordForm/forgotPasswordForm.types';
import { forgotPasswordSchema } from '@/components/forms/forgotPasswordForm/forgotPasswordForm.validation';
import { Loader } from '@/components/loader/Loader';
import { Button } from '@/components/ui/button/Button';
import { ControlledTextField } from '@/components/ui/controlled/controlledTextField/ControlledTextField';
import { useForgotPasswordFlowStore } from '@/stores/forgotPasswordFlow.store';

import Envelope from '../../icons/Envelope';

export const ForgotPasswordForm = () => {
    const [serverError, setServerError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const setEmail = useForgotPasswordFlowStore((state) => state.setEmail);

    const { control, handleSubmit, reset } = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
    });

    const onSubmitForm = async (data: ForgotPasswordFormValues) => {
        setServerError(null);
        setIsLoading(true);

        try {
            const result = await forgotPasswordAction(data.email);

            if (!result.success) {
                let hasFieldError = false;

                if (result.errors) {
                    Object.entries(result.errors).forEach(([, messages]) => {
                        if (!messages?.[0]) {
                            return;
                        }

                        hasFieldError = true;
                        setServerError(messages[0]);
                    });
                }

                if (!hasFieldError) {
                    setServerError(result.message ?? 'Something went wrong');
                }

                return;
            }

            setEmail(data.email);

            reset();
            router.push('/forgot-password/success-send-link');
        } finally {
            setIsLoading(false);
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

            {serverError && <p className="text-red-500 text-sm mb-4">{serverError}</p>}

            <Button className="mb-5" fullWidth disabled={isLoading}>
                {isLoading ? 'Sending link...' : 'Send Link'}
            </Button>

            {isLoading && <Loader />}
        </form>
    );
};
