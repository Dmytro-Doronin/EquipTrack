'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton';
import { SignInFormValues } from '@/components/forms/signinForm/signInForm.types';
import { signInSchema } from '@/components/forms/signinForm/signInForm.validation';
import { Loader } from '@/components/loader/Loader';
import { Button } from '@/components/ui/button/Button';
import { ControlledTextField } from '@/components/ui/controlled/controlledTextField/ControlledTextField';
import { useSigninMutation } from '@/hooks/mutations/useSigninMutation';

import Envelope from '../../icons/Envelope';
import Lock from '../../icons/Lock';

export const SignInForm = () => {
    const [serverError, setServerError] = useState<string | null>(null);
    const signinMutation = useSigninMutation();

    const { control, handleSubmit, reset } = useForm<SignInFormValues>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmitForm = async (data: SignInFormValues) => {
        setServerError(null);

        const formData = new FormData();

        formData.append('email', data.email);
        formData.append('password', data.password);

        const result = await signinMutation.mutateAsync(formData);

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
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit(onSubmitForm)}>
            <div className="form-header mb-[32px]">
                <h2 className="font-bold text-[24px]">Welcome back</h2>
                <p className="text-[14px] text-sub-text mt-[8px]">Enter your details to sign in</p>
            </div>

            <div className="flex flex-col gap-5 justify-center mb-5">
                <ControlledTextField
                    placeholder="Ex: Johndoe@gmail.com"
                    control={control}
                    name="email"
                    Icon={Envelope}
                />

                <ControlledTextField
                    placeholder="Enter your password"
                    control={control}
                    name="password"
                    type="password"
                    Icon={Lock}
                />
            </div>

            <Button
                as={Link}
                href="/forgot-password"
                variant="link"
                className="self-end text-main p-0 mb-4"
            >
                Forgot password?
            </Button>

            {serverError && <p className="text-red-500 text-sm mb-4">{serverError}</p>}

            <Button className="mb-5" fullWidth disabled={signinMutation.isPending}>
                {signinMutation.isPending ? 'Signing in...' : 'Sign In'}
            </Button>

            <div className="mb-5 flex items-center gap-3 text-xs text-sub-text">
                <span className="h-px flex-1 bg-round" />
                <span>or</span>
                <span className="h-px flex-1 bg-round" />
            </div>

            <GoogleAuthButton className="mb-5" />

            {signinMutation.isPending && <Loader />}
        </form>
    );
};
