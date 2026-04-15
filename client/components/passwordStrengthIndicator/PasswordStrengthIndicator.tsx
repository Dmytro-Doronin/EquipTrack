import { useMemo } from 'react';

import { getPasswordStrength, getStrengthColor } from '@/utils/getPasswordStrength';

type PasswordStrengthIndicatorProps = {
    password: string;
};

export const PasswordStrengthIndicator = ({ password }: PasswordStrengthIndicatorProps) => {
    const strength = useMemo(() => getPasswordStrength(password), [password]);

    return (
        <div className="mb-5">
            <p className="mb-2 text-[13px] font-bold text-sub-text">Password strength indicator</p>

            <div className="flex w-full gap-2">
                {[1, 2, 3, 4].map((level) => (
                    <div
                        key={level}
                        className={`h-2 flex-1 rounded ${getStrengthColor(strength, level)}`}
                    />
                ))}
            </div>
        </div>
    );
};
