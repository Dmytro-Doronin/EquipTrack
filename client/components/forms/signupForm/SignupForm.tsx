'use client';

import { AvatarChanger } from '@/components/avatarChanger/AvatarChanger';
import { PasswordStrengthIndicator } from '@/components/PasswordStrengthIndicator/PasswordStrengthIndicator';
import { Button } from '@/components/ui/button/Button';
import { TextField } from '@/components/ui/textField/TextField';

import Envelope from '../../icons/Envelope';
import Lock from '../../icons/Lock';
import User from '../../icons/User';

export const SignupForm = () => {
    return (
        <form className="auth-form">
            <div className="form-header mb-[32px]">
                <AvatarChanger />
                <h2 className="font-bold text-[24px] mt-[24px]">Create a new account</h2>
                <p className="text-[14px] text-sub-text mt-[8px]">Enter your details to register</p>
            </div>

            <div className="flex flex-col gap-[20px] justify-center">
                <TextField placeholder="asd" Icon={User} />
                <TextField placeholder="asd" Icon={Envelope} />
                <TextField placeholder="asd" Icon={Lock} />
                <p className="text-[12px] text-sub-text">
                    Must contain 1 uppercase letter, 1 number, min. 8 characters
                </p>
            </div>
            <PasswordStrengthIndicator password="a3" />
            <Button className="mb-5" fullWidth>
                Sign Up
            </Button>
            <p className="text-[12px] text-sub-text">
                By clicking signup, you agree to accept ET Terms and Conditions
            </p>
        </form>
    );
};
