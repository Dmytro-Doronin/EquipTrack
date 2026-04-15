'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { AvatarChanger } from '@/components/avatarChanger/AvatarChanger';
import { SignUpFormFormValues } from '@/components/forms/signupForm/signUpForm.types';
import { signUpSchema } from '@/components/forms/signupForm/signUpForm.validation';
import { PasswordStrengthIndicator } from '@/components/passwordStrengthIndicator/PasswordStrengthIndicator';
import { Button } from '@/components/ui/button/Button';
import { ControlledTextField } from '@/components/ui/controlled/controlledTextField/ControlledTextField';
import { useSignupFlowStore } from '@/stores/signupFlow.store';

import Envelope from '../../icons/Envelope';
import KeyPass from '../../icons/KeyPass';
import Lock from '../../icons/Lock';
import User from '../../icons/User';

// type SignUpFormType = {
//     isLoading: boolean;
// };

export const SignupForm = () => {
    const [avatar, setAvatar] = useState<File | null>(null);
    const router = useRouter();

    const setEmail = useSignupFlowStore((state) => state.setEmail);
    const setMaxAllowedStep = useSignupFlowStore((state) => state.setMaxAllowedStep);
    const { control, handleSubmit, reset } = useForm<SignUpFormFormValues>({
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
    const onSubmitForm = (data: SignUpFormFormValues) => {
        const formData = new FormData();
        formData.append('login', data.login);
        formData.append('email', data.email);
        if (avatar) {
            formData.append('avatar', avatar);
        }

        formData.append('password', data.password);
        formData.append('confirmPassword', data.confirmPassword);
        console.log(formData.get('password'));
        setEmail(data.email);
        setMaxAllowedStep('verify-email');

        reset();
        router.push('/signup/verify-email');
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit(onSubmitForm)}>
            <div className="form-header mb-[32px]">
                <AvatarChanger sendAvatar={setAvatar} />
                <h2 className="font-bold text-[24px] mt-[24px]">Create a new account</h2>
                <p className="text-[14px] text-sub-text mt-[8px]">Enter your details to register</p>
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

            <Button className="mb-5" fullWidth>
                Sign Up
            </Button>
            <p className="text-[12px] text-sub-text">
                By clicking signup, you agree to accept ET Terms and Conditions
            </p>
        </form>
    );
};
