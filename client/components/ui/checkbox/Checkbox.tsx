'use client';

import type { ReactNode } from 'react';

import * as CheckboxRadix from '@radix-ui/react-checkbox';
import * as LabelRadix from '@radix-ui/react-label';
import { twMerge } from 'tailwind-merge';

import Check from '../../icons/Check';

export type CheckboxProps = {
    className?: string;
    checked?: boolean;
    onValueChange?: (checked: boolean) => void;
    disabled?: boolean;
    required?: boolean;
    label?: ReactNode;
    id?: string;
    position?: 'left';
};

export const Checkbox = ({
    checked,
    onValueChange,
    disabled,
    required,
    label,
    id,
    className,
}: CheckboxProps) => {
    const checkbox = (
        <CheckboxRadix.Root
            className={twMerge(
                'shrink-0 cursor-pointer',
                'flex items-center justify-center',
                'w-5.5 h-5.5 rounded-md',
                'border-2 border-gray-main bg-white',
                'data-[state=checked]:bg-success data-[state=checked]:border-success',
                'outline-none focus-visible:ring-2 focus-visible:border-success focus-visible:ring-offset-0',
                'disabled:opacity-50 disabled:cursor-not-allowed',
            )}
            checked={checked}
            onCheckedChange={(v) => onValueChange?.(v === true)}
            disabled={disabled}
            required={required}
            id={id}
        >
            <CheckboxRadix.Indicator>
                <Check className="w-4 h-4 text-white" />
            </CheckboxRadix.Indicator>
        </CheckboxRadix.Root>
    );

    if (!label) {
        return <div className={className}>{checkbox}</div>;
    }

    return (
        <div className={className}>
            <LabelRadix.Root asChild htmlFor={id}>
                <label className="inline-flex items-center gap-2 cursor-pointer select-none text-light-100">
                    {checkbox}
                    {label}
                </label>
            </LabelRadix.Root>
        </div>
    );
};
