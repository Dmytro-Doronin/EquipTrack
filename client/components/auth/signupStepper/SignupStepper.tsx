'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';

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
                    <Fragment key={step.key}>
                        {available ? (
                            <Link
                                href={step.path}
                                className={clsx(
                                    'flex items-center justify-center gap-1 rounded-full pt-1 pb-1 pl-1 pr-3',
                                    isActive && 'border border-main',
                                )}
                            >
                                <div className="rounded-full border border-[#DFE1E7] p-1 shadow-[0px_1px_2px_0px_#0D0D120F]">
                                    {isCompleted ? <Checked /> : <Icon />}
                                </div>

                                <span className="text-[16px]">
                                    {index + 1}.{step.label}
                                </span>
                            </Link>
                        ) : (
                            <div className="flex items-center justify-center gap-1 rounded-full pt-1 pb-1 pl-1 pr-3 opacity-50">
                                <div className="rounded-full border border-[#DFE1E7] p-1 shadow-[0px_1px_2px_0px_#0D0D120F]">
                                    <Icon />
                                </div>

                                <span className="text-[16px]">
                                    {index + 1}.{step.label}
                                </span>
                            </div>
                        )}

                        {index !== SIGNUP_STEPS.length - 1 && (
                            <span className="mx-2 text-gray-400">{'>'}</span>
                        )}
                    </Fragment>
                );
            })}
        </div>
    );
};
