'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

import { SignInFormValues } from '@/components/forms/signinForm/signInForm.types';
import { signInSchema } from '@/components/forms/signinForm/signInForm.validation';
import { Button } from '@/components/ui/button/Button';
import { ControlledTextField } from '@/components/ui/controlled/controlledTextField/ControlledTextField';

import Envelope from '../../icons/Envelope';
import Lock from '../../icons/Lock';

export const SignInForm = () => {
    const { control, handleSubmit, reset } = useForm<SignInFormValues>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmitForm = (data: SignInFormValues) => {
        console.log(data);
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

            <Button as={Link} href="/forgot-password" variant="link" className="self-end text-main">
                Forgot password?
            </Button>

            <Button className="mb-5" fullWidth>
                Sign In
            </Button>
        </form>
    );
};
