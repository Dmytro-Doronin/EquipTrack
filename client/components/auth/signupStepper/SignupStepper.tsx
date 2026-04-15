'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import Checked from '@/components/icons/Checked';
import { SIGNUP_STEPS, SignupStepKey } from '@/lib/constants/signupSteps';
import { isStepAvailable, SIGNUP_STEP_ORDER } from '@/utils/signupStep';
type Props = {
    maxAllowedStep: SignupStepKey;
};

export const SignupStepper = ({ maxAllowedStep }: Props) => {
    const pathname = usePathname();

    return (
        <div className="mb-8 mt-8 flex items-center justify-center gap-2">
            {SIGNUP_STEPS.map((step, index) => {
                const isActive = pathname === step.path;
                const available = isStepAvailable(step.key, maxAllowedStep);
                const isCompleted = SIGNUP_STEP_ORDER[step.key] < SIGNUP_STEP_ORDER[maxAllowedStep];
                const Icon = step.icon;
                return (
                    <div key={step.key} className="">
                        {available ? (
                            <Link
                                href={step.path}
                                className={clsx(
                                    'flex items-center justify-center gap-1 rounded-full p-1 border-1 border-black',
                                    !isActive && 'border-1 border-black',
                                    !isActive && !isCompleted && 'bg-white text-black',
                                )}
                            >
                                {isCompleted ? (
                                    <div className="rounded-full p-1 border border-[#DFE1E7] shadow-[0px_1px_2px_0px_#0D0D120F]">
                                        <Checked />
                                    </div>
                                ) : (
                                    <div className="rounded-full p-1 border border-[#DFE1E7] shadow-[0px_1px_2px_0px_#0D0D120F]">
                                        <Icon />
                                    </div>
                                )}
                                <span className="text-[16px]">
                                    {index + 1}.{step.label}
                                </span>
                            </Link>
                        ) : (
                            <div className="flex items-center justify-center gap-1 rounded-full p-1">
                                <div className="rounded-full p-1 border border-[#DFE1E7] shadow-[0px_1px_2px_0px_#0D0D120F]">
                                    <Icon />
                                </div>
                                <span className="text-[16px]">
                                    {index + 1}.{step.label}
                                </span>
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
