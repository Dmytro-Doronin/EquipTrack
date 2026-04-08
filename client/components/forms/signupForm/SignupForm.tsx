'use client';

import { AvatarChanger } from '@/components/avatarChanger/AvatarChanger';
import { TextField } from '@/components/ui/textField/TextField';

import Eye from '../../icons/Eye';

export const SignupForm = () => {
    return (
        <form className="auth-form">
            <div className="form-header">
                <AvatarChanger />
                <h2 className="font-bold text-[24px] mt-[24px]">Create a new account</h2>
                <p className="text-[14px] text-sub-text mt-[8px]">Enter your details to register</p>
            </div>

            <div>
                <TextField placeholder="asd" Icon={Eye} />
            </div>
        </form>
    );
};
