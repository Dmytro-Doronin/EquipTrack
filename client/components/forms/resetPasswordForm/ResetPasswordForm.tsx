'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { ResetPasswordFormValues } from '@/components/forms/resetPasswordForm/resetPasswordForm.types';
import { resetPasswordSchema } from '@/components/forms/resetPasswordForm/resetPasswordForm.validation';
import { Loader } from '@/components/loader/Loader';
import { PasswordStrengthIndicator } from '@/components/passwordStrengthIndicator/PasswordStrengthIndicator';
import { Button } from '@/components/ui/button/Button';
import { ControlledTextField } from '@/components/ui/controlled/controlledTextField/ControlledTextField';
import { useResetPasswordConfirmMutation } from '@/hooks/mutations/useResetPasswordConfirmMutation';

import KeyPass from '../../icons/KeyPass';
import Lock from '../../icons/Lock';

export const ResetPasswordForm = () => {
    const [tokenError, setTokenError] = useState<string | null>(null);
    const resetPasswordMutation = useResetPasswordConfirmMutation();
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

    const onSubmitForm = (data: ResetPasswordFormValues) => {
        setTokenError(null);

        if (!token) {
            setTokenError('Invalid or expired password recovery link');
            return;
        }

        resetPasswordMutation.mutate(
            {
                token,
                password: data.password,
                confirmPassword: data.confirmPassword,
            },
            {
                onSuccess: () => {
                    reset();
                },
            },
        );
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

            {(tokenError || resetPasswordMutation.error) && (
                <p className="text-red-500 text-sm mb-4">
                    {tokenError ?? resetPasswordMutation.error?.message}
                </p>
            )}

            <Button className="mb-5" fullWidth disabled={resetPasswordMutation.isPending || !token}>
                {resetPasswordMutation.isPending ? 'Changing password...' : 'Change Password'}
            </Button>

            {!token && (
                <Button as={Link} href="/forgot-password" variant="link" className="text-main p-0">
                    Request a new link
                </Button>
            )}

            {resetPasswordMutation.isPending && <Loader />}
        </form>
    );
};
