import type {
    ComponentProps,
    ComponentPropsWithoutRef,
    ForwardRefExoticComponent,
    MemoExoticComponent,
    RefAttributes,
    SVGProps,
} from 'react';

import { cva, type VariantProps } from 'class-variance-authority';
import React, { forwardRef, useId, useImperativeHandle, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import ClosedEye from '../../icons/ClosedEye';
import Eye from '../../icons/Eye';
export type TextFieldProps = {
    onValueChange?: (value: string) => void;
    errorMessage?: string;
    label?: string;
    variant?: 'primary';
    iconClassName?: string;
    containerClassName?: string;
    Icon?: MemoExoticComponent<
        ForwardRefExoticComponent<
            Omit<SVGProps<SVGSVGElement>, 'ref'> & RefAttributes<SVGSVGElement>
        >
    >;
} & ComponentPropsWithoutRef<'input'>;

const rootStyles = cva('w-full hover:cursor-text flex flex-col items-center lg:items-start', {
    variants: {
        state: {
            default: 'flex flex-col gap-[7px]',
            error: 'text-danger',
        },
    },
    defaultVariants: { state: 'default' },
});

const fieldContainerStyles = cva(
    [
        'relative',
        'grid grid-cols-[auto_1fr] items-center',
        'transition',
        'border',
        'focus-within:outline focus-within:outline-1',
    ].join(' '),
    {
        variants: {
            variant: {
                primary: 'bg-dark-800 border-gray-main',
            },

            layout: {
                primary: 'w-full max-w-[384px] gap-[10px] px-[12px] rounded-[5px] h-[46px]',
            },

            state: {
                default:
                    'hover:border-dark focus-within:border-outline-focus focus-within:outline-dark',
                error: 'border-danger hover:!border-danger focus-within:!border-danger focus-within:outline-danger',
            },
        },
        defaultVariants: {
            variant: 'primary',
            layout: 'primary',
            state: 'default',
        },
    },
);

const inputStyles = cva(
    [
        'w-full bg-transparent outline-none border-0',
        'font-inherit text-[14px]',
        'min-w-0',
        'placeholder:text-[14px]',
    ].join(' '),
    {
        variants: {
            variant: {
                primary: 'text-light-100 placeholder:text-dark-400',
            },
            state: {
                default: '',
                error: 'text-danger placeholder:text-danger',
            },
        },
        defaultVariants: { variant: 'primary', state: 'default' },
    },
);

const labelStyles = cva('mb-0.5 text-[12px]', {
    variants: {
        variant: {
            primary: 'text-purple-500',
        },
    },
    defaultVariants: { variant: 'primary' },
});

const iconStyles = 'mr-2 transition text-sub-text';
const showPasswordBtnStyles = cva(
    [
        'absolute top-1/2 right-[1%] -translate-y-1/2',
        'w-5 h-5 mr-[25px] p-0',
        'bg-transparent border-0 outline-none cursor-pointer',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-outline-focus',
        'inline-flex items-center justify-center',
    ].join(' '),
    {
        variants: {
            variant: {
                primary: 'text-dark-400',
            },
        },
        defaultVariants: { variant: 'primary' },
    },
);

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
    (
        {
            className,
            errorMessage,
            Icon,
            placeholder,
            type,
            label,
            onChange,
            onValueChange,
            iconClassName,
            containerClassName,
            variant = 'primary',
            ...restProps
        },
        ref,
    ) => {
        const [showPassword, setShowPassword] = useState(false);
        const isPassword = type === 'password';
        const inputRef = useRef<HTMLInputElement>(null);
        useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

        const id = useId();
        const finalType = getFinalType(type, showPassword);

        const state: VariantProps<typeof rootStyles>['state'] = errorMessage ? 'error' : 'default';

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange?.(e);
            onValueChange?.(e.target.value);
        };

        return (
            <>
                <div
                    className={twMerge(rootStyles({ state }), containerClassName)}
                    onClick={() => inputRef.current?.focus()}
                >
                    {label && (
                        <label htmlFor={id} className={labelStyles({ variant })}>
                            {label}
                        </label>
                    )}
                    <div
                        className={fieldContainerStyles({
                            variant,
                            layout: variant,
                            state,
                        })}
                    >
                        {Icon && <Icon className={twMerge(iconStyles, iconClassName)} />}
                        <div className="flex flex-col w-full gap-0.5">
                            <input
                                id={id}
                                ref={inputRef}
                                className={twMerge(
                                    'tf-autofill-light',
                                    inputStyles({ variant, state }),
                                    className,
                                )}
                                placeholder={placeholder}
                                type={finalType}
                                onChange={handleChange}
                                autoComplete={isPassword ? 'off' : undefined}
                                {...restProps}
                            />
                        </div>

                        {isPassword && (
                            <button
                                className={showPasswordBtnStyles({ variant })}
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <ClosedEye /> : <Eye />}
                            </button>
                        )}
                    </div>
                    {errorMessage && (
                        <span className="mt-1 ml-6 text-sm text-danger">{errorMessage}</span>
                    )}
                </div>
            </>
        );
    },
);

TextField.displayName = 'TextField';

function getFinalType(type: ComponentProps<'input'>['type'], showPassword: boolean) {
    if (type === 'password' && showPassword) {
        return 'text';
    }
    return type;
}
