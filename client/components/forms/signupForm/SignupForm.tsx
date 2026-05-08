'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import { signUpAction } from '@/actions/SignUpAction';
import { AvatarChanger } from '@/components/avatarChanger/AvatarChanger';
import { SignUpFormFormValues } from '@/components/forms/signupForm/signUpForm.types';
import { avatarSchema, signUpSchema } from '@/components/forms/signupForm/signUpForm.validation';
import { PasswordStrengthIndicator } from '@/components/passwordStrengthIndicator/PasswordStrengthIndicator';
import { Button } from '@/components/ui/button/Button';
import { ControlledTextField } from '@/components/ui/controlled/controlledTextField/ControlledTextField';
import { useSignupFlowStore } from '@/stores/signupFlow.store';

import Envelope from '../../icons/Envelope';
import KeyPass from '../../icons/KeyPass';
import Lock from '../../icons/Lock';
import User from '../../icons/User';

export const SignupForm = () => {
    const [avatar, setAvatar] = useState<File | null>(null);
    const [serverError, setServerError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const setEmail = useSignupFlowStore((state) => state.setEmail);
    const setMaxAllowedStep = useSignupFlowStore((state) => state.setMaxAllowedStep);

    const { control, handleSubmit, reset, setError } = useForm<SignUpFormFormValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            login: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const password = useWatch({
        control,
        name: 'password',
        defaultValue: '',
    });

    const onSubmitForm = async (data: SignUpFormFormValues) => {
        setServerError(null);

        const avatarValidationResult = avatarSchema.safeParse(avatar);

        if (!avatarValidationResult.success) {
            const avatarErrors = z.flattenError(avatarValidationResult.error).formErrors;
            setServerError(avatarErrors[0] ?? 'Invalid avatar');
            return;
        }

        const formData = new FormData();

        formData.append('login', data.login);
        formData.append('email', data.email);
        formData.append('password', data.password);
        formData.append('confirmPassword', data.confirmPassword);

        if (avatar !== null) {
            formData.append('avatar', avatar);
        }

        setIsLoading(true);

        try {
            const result = await signUpAction(formData);

            if (!result.success) {
                let hasFieldError = false;

                if (result.errors) {
                    Object.entries(result.errors).forEach(([field, messages]) => {
                        if (!messages?.[0]) {
                            return;
                        }

                        hasFieldError = true;

                        if (field === 'avatar') {
                            setServerError(messages[0]);
                            return;
                        }

                        setError(field as keyof SignUpFormFormValues, {
                            type: 'server',
                            message: messages[0],
                        });
                    });
                }

                if (!hasFieldError) {
                    setServerError(result.message ?? 'Something went wrong');
                }

                return;
            }

            setEmail(data.email);
            setMaxAllowedStep('code');

            reset();
            setAvatar(null);
            router.push('/signup/code');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit(onSubmitForm)}>
            <div className="form-header mb-8">
                <AvatarChanger sendAvatar={setAvatar} />

                <h2 className="font-bold text-[24px] mt-6">Create a new account</h2>

                <p className="text-[14px] text-sub-text mt-2">Enter your details to register</p>
            </div>

            <div className="flex flex-col gap-5 justify-center mb-5">
                <ControlledTextField
                    placeholder="Ex: John Doe"
                    control={control}
                    name="login"
                    Icon={User}
                />

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

                <ControlledTextField
                    placeholder="Confirm your password"
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

            <Button className="mb-5" fullWidth disabled={isLoading}>
                {isLoading ? 'Signing up...' : 'Sign Up'}
            </Button>

            <p className="text-[12px] text-sub-text">
                By clicking signup, you agree to accept ET Terms and Conditions
            </p>
        </form>
    );
};
