import { useMemo } from 'react';

import { getPasswordStrength, getStrengthColor } from '@/utils/getPasswordStrength';

type PasswordStrengthIndicatorProps = {
    password: string;
};

export const PasswordStrengthIndicator = ({ password }: PasswordStrengthIndicatorProps) => {
    const strength = useMemo(() => getPasswordStrength(password), [password]);

    return (
        <div className="mt-2 flex gap-2 mb-5">
            {[1, 2, 3, 4].map((level) => (
                <div
                    key={level}
                    className={['h-2 flex-1 rounded', getStrengthColor(strength, level)].join(' ')}
                />
            ))}
        </div>
    );
};
