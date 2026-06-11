'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { resetPasswordConfirm } from '@/api/auth/authApi';
import { ResetPasswordFormValues } from '@/components/forms/resetPasswordForm/resetPasswordForm.types';
import { resetPasswordSchema } from '@/components/forms/resetPasswordForm/resetPasswordForm.validation';
import { Loader } from '@/components/loader/Loader';
import { PasswordStrengthIndicator } from '@/components/passwordStrengthIndicator/PasswordStrengthIndicator';
import { Button } from '@/components/ui/button/Button';
import { ControlledTextField } from '@/components/ui/controlled/controlledTextField/ControlledTextField';

import KeyPass from '../../icons/KeyPass';
import Lock from '../../icons/Lock';

export const ResetPasswordForm = () => {
    const [serverError, setServerError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token') ?? '';

    const { control, handleSubmit, reset } = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    });

    const password = useWatch({
        control,
        name: 'password',
        defaultValue: '',
    });

    const onSubmitForm = async (data: ResetPasswordFormValues) => {
        setServerError(null);

        if (!token) {
            setServerError('Invalid or expired password recovery link');
            return;
        }

        setIsLoading(true);

        try {
            const result = await resetPasswordConfirm({
                token,
                password: data.password,
                confirmPassword: data.confirmPassword,
            });

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

            reset();
            router.push('/reset-password/success');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit(onSubmitForm)}>
            <div className="form-header mb-8">
                <h2 className="font-bold text-[24px]">Reset password</h2>
                <p className="text-[14px] text-sub-text mt-2">
                    Create a new password for your account
                </p>
            </div>

            <div className="flex flex-col gap-5 justify-center mb-5">
                <ControlledTextField
                    placeholder="Enter your new password"
                    control={control}
                    name="password"
                    type="password"
                    Icon={Lock}
                />

                <ControlledTextField
                    placeholder="Confirm your new password"
                    control={control}
                    name="confirmPassword"
                    type="password"
                    Icon={KeyPass}
                />

                <p className="text-[12px] text-sub-text">
                    Must contain 1 uppercase letter, 1 number, min. 8 characters
                </p>
            </div>

            {password.length > 0 && <PasswordStrengthIndicator password={password} />}

            {serverError && <p className="text-red-500 text-sm mb-4">{serverError}</p>}

            <Button className="mb-5" fullWidth disabled={isLoading || !token}>
                {isLoading ? 'Changing password...' : 'Change Password'}
            </Button>

            {!token && (
                <Button as={Link} href="/forgot-password" variant="link" className="text-main p-0">
                    Request a new link
                </Button>
            )}

            {isLoading && <Loader />}
        </form>
    );
};
