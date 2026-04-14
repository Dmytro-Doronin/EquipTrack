'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { SIGNUP_STEPS, SignupStepKey } from '@/lib/constants/signupSteps';
import { isStepAvailable, SIGNUP_STEP_ORDER } from '@/utils/signupStep';

type Props = {
    maxAllowedStep: SignupStepKey;
};

export const SignupStepper = ({ maxAllowedStep }: Props) => {
    const pathname = usePathname();

    return (
        <div className="mb-8 flex items-center justify-between gap-2">
            {SIGNUP_STEPS.map((step, index) => {
                const isActive = pathname === step.path;
                const available = isStepAvailable(step.key, maxAllowedStep);
                const isCompleted = SIGNUP_STEP_ORDER[step.key] < SIGNUP_STEP_ORDER[maxAllowedStep];

                return (
                    <div key={step.key} className="flex flex-1 items-center gap-2">
                        {available ? (
                            <Link
                                href={step.path}
                                className={clsx(
                                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-medium transition',
                                    isActive && 'border-primary',
                                    isCompleted && 'bg-black text-white',
                                    !isActive && !isCompleted && 'bg-white text-black',
                                )}
                            >
                                {index + 1}
                            </Link>
                        ) : (
                            <div className="flex h-10 w-10 shrink-0 cursor-not-allowed items-center justify-center rounded-full border text-sm font-medium opacity-40">
                                {index + 1}
                            </div>
                        )}

                        {index !== SIGNUP_STEPS.length - 1 && (
                            <div className="h-[1px] flex-1 bg-border" />
                        )}
                    </div>
                );
            })}
        </div>
    );
};
