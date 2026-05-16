'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { signInAction } from '@/actions/SignInAction';
import { SignInFormValues } from '@/components/forms/signinForm/signInForm.types';
import { signInSchema } from '@/components/forms/signinForm/signInForm.validation';
import { Loader } from '@/components/loader/Loader';
import { Button } from '@/components/ui/button/Button';
import { ControlledTextField } from '@/components/ui/controlled/controlledTextField/ControlledTextField';
import { useAuthStore } from '@/stores/auth.store';
import { setAuthHint } from '@/utils/authHint';

import Envelope from '../../icons/Envelope';
import Lock from '../../icons/Lock';

export const SignInForm = () => {
    const [serverError, setServerError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const setAccessToken = useAuthStore((state) => state.setAccessToken);
    const setUser = useAuthStore((state) => state.setUser);

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

        setIsLoading(true);

        try {
            const result = await signInAction(formData);

            if (!result.success) {
                let hasFieldError = false;

                if (result.errors) {
                    Object.entries(result.errors).forEach(([messages]) => {
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

            if (result.data?.user && result.data?.accessToken) {
                setUser(result.data.user);
                setAccessToken(result.data.accessToken);

                setAuthHint();
            }

            reset();
            router.push('/dashboard');
        } finally {
            setIsLoading(false);
        }
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

            <Button className="mb-5" fullWidth disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>

            {isLoading && <Loader />}
        </form>
    );
};
