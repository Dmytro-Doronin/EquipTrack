import type { ComponentPropsWithoutRef } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';
import React, { forwardRef, useId } from 'react';
import { twMerge } from 'tailwind-merge';

export type TextAreaProps = {
    onValueChange?: (value: string) => void;
    errorMessage?: string;
    label?: string;
    variant?: 'primary';
    containerClassName?: string;
} & ComponentPropsWithoutRef<'textarea'>;

const rootStyles = cva('w-full hover:cursor-text flex flex-col items-center lg:items-start', {
    variants: {
        state: {
            default: 'flex flex-col gap-[7px]',
            error: 'text-danger',
        },
    },
    defaultVariants: { state: 'default' },
});

const textAreaStyles = cva(
    [
        'w-full max-w-[384px] min-h-[120px] resize-none rounded-[5px] border px-[12px] py-[12px] text-[14px] outline-none transition',
    ].join(' '),
    {
        variants: {
            variant: {
                primary: 'border-gray-main text-main placeholder:text-dark-400',
            },
            state: {
                default:
                    'hover:border-dark focus:border-outline-focus focus:outline focus:outline-1 focus:outline-dark',
                error: 'border-danger text-danger placeholder:text-danger hover:!border-danger focus:!border-danger focus:outline-danger',
            },
        },
        defaultVariants: {
            variant: 'primary',
            state: 'default',
        },
    },
);

const labelStyles = cva('mb-0.5 text-[12px]', {
    variants: {
        variant: {
            primary: 'text-sub-text',
        },
    },
    defaultVariants: { variant: 'primary' },
});

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
    (
        {
            className,
            containerClassName,
            errorMessage,
            label,
            onChange,
            onValueChange,
            variant = 'primary',
            ...restProps
        },
        ref,
    ) => {
        const id = useId();
        const state: VariantProps<typeof rootStyles>['state'] = errorMessage ? 'error' : 'default';

        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            onChange?.(e);
            onValueChange?.(e.target.value);
        };

        return (
            <div className={twMerge(rootStyles({ state }), containerClassName)}>
                {label && (
                    <label htmlFor={id} className={labelStyles({ variant })}>
                        {label}
                    </label>
                )}
                <textarea
                    id={id}
                    ref={ref}
                    className={twMerge(textAreaStyles({ variant, state }), className)}
                    onChange={handleChange}
                    {...restProps}
                />
                {errorMessage && (
                    <span className="mt-1 text-sm text-[12px] text-danger">{errorMessage}</span>
                )}
            </div>
        );
    },
);

TextArea.displayName = 'TextArea';
