'use client';

import type { ClipboardEvent, ComponentPropsWithoutRef, FormEvent, KeyboardEvent } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { forwardRef, useId, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { codeAction } from '@/actions/CodeAction';
import { Loader } from '@/components/loader/Loader';
import { Button } from '@/components/ui/button/Button';
import { useSignupStepGuard } from '@/hooks/useSignupStepGuard';
import { useSignupFlowStore } from '@/stores/signupFlow.store';

type VerificationCodeFormProps = {
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    onValueChange?: (value: string) => void;
    onComplete?: (value: string) => void;
    onSubmit?: (value: string) => void;
    label?: string;
    errorMessage?: string;
    length?: number;
    variant?: 'primary';
    inputClassName?: string;
    disabled?: boolean;
    autoFocus?: boolean;
    name?: string;
} & Omit<ComponentPropsWithoutRef<'form'>, 'defaultValue' | 'onChange' | 'onSubmit'>;

const rootStyles = cva('w-full flex flex-col items-center lg:items-start', {
    variants: {
        state: {
            default: 'gap-[7px]',
            error: 'text-danger',
        },
    },
    defaultVariants: { state: 'default' },
});

const labelStyles = cva('mb-0.5 text-[12px]', {
    variants: {
        variant: {
            primary: 'text-purple-500',
        },
    },
    defaultVariants: { variant: 'primary' },
});

const codeGroupStyles = cva('flex w-full max-w-[384px] justify-between gap-2 sm:gap-3', {
    variants: {
        state: {
            default: '',
            error: '',
        },
    },
    defaultVariants: { state: 'default' },
});

const codeInputStyles = cva(
    [
        'h-[46px] w-full min-w-0',
        'rounded-[5px] border bg-white',
        'text-center text-[18px] font-medium text-dark',
        'outline-none transition',
        'placeholder:text-dark-400',
        'focus:outline focus:outline-1',
        'disabled:cursor-not-allowed disabled:opacity-60',
    ].join(' '),
    {
        variants: {
            state: {
                default: 'border-gray-main hover:border-dark focus:border-main focus:outline-main',
                error: 'border-danger text-danger hover:border-danger focus:border-danger focus:outline-danger',
            },
        },
        defaultVariants: { state: 'default' },
    },
);

export const VerificationCodeForm = forwardRef<HTMLInputElement, VerificationCodeFormProps>(
    (
        {
            value,
            defaultValue = '',
            onChange,
            onValueChange,
            onComplete,
            onSubmit,
            label,
            errorMessage,
            length = 6,
            variant = 'primary',
            className,
            inputClassName,
            disabled,
            autoFocus,
            name,
            id,
            ...restProps
        },
        ref,
    ) => {
        const generatedId = useId();
        const inputId = id ?? generatedId;
        const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
        const isControlled = value !== undefined;
        const [uncontrolledValue, setUncontrolledValue] = useState(() =>
            normalizeCode(defaultValue, length),
        );
        const maxAllowedStep = useSignupFlowStore((state) => state.maxAllowedStep);
        const router = useRouter();
        const setMaxAllowedStep = useSignupFlowStore((state) => state.setMaxAllowedStep);
        const [codeError, setCodeError] = useState<string | null>(null);
        const [isSubmitting, setIsSubmitting] = useState(false);
        const finalErrorMessage = errorMessage ?? codeError;
        const email = useSignupFlowStore((state) => state.email);
        const code = normalizeCode(isControlled ? value : uncontrolledValue, length);
        const digits = useMemo(
            () => Array.from({ length }, (_, index) => code[index] ?? ''),
            [code, length],
        );
        const state: VariantProps<typeof rootStyles>['state'] = errorMessage ? 'error' : 'default';

        useImperativeHandle(ref, () => inputRefs.current[0] as HTMLInputElement);
        useSignupStepGuard('code', maxAllowedStep);
        const updateCode = (nextDigits: string[]) => {
            const nextValue = normalizeCode(nextDigits.join(''), length);

            if (!isControlled) {
                setUncontrolledValue(nextValue);
            }

            onChange?.(nextValue);
            onValueChange?.(nextValue);

            if (nextValue.length === length) {
                onComplete?.(nextValue);
            }
        };

        const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();

            setCodeError(null);

            if (code.length !== length) {
                setCodeError(`Code must be ${length} digits`);
                return;
            }

            if (!email) {
                setCodeError('Email is missing. Please start signup again.');
                return;
            }

            onSubmit?.(code);

            setIsSubmitting(true);

            try {
                const result = await codeAction(email, code);

                if (!result.success) {
                    const codeMessage = result.errors?.code?.[0];
                    const formMessage = result.errors?.form?.[0];

                    setCodeError(
                        codeMessage ?? formMessage ?? result.message ?? 'Code confirmation failed',
                    );

                    return;
                }

                setMaxAllowedStep('success-verification');
                router.push('/signup/success-verification');
            } catch {
                setCodeError('Something went wrong. Please try again.');
            } finally {
                setIsSubmitting(false);
            }
        };

        const focusInput = (index: number) => {
            inputRefs.current[Math.min(Math.max(index, 0), length - 1)]?.focus();
        };

        const handleChange = (index: number, nextInputValue: string) => {
            const nextDigit = nextInputValue.replace(/\D/g, '').at(-1);

            if (!nextDigit) {
                return;
            }

            const nextDigits = [...digits];
            nextDigits[index] = nextDigit;
            updateCode(nextDigits);

            if (index < length - 1) {
                focusInput(index + 1);
            }
        };

        const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key !== 'Backspace') {
                return;
            }

            event.preventDefault();

            const nextDigits = [...digits];

            if (nextDigits[index]) {
                nextDigits[index] = '';
                updateCode(nextDigits);
                return;
            }

            if (index > 0) {
                nextDigits[index - 1] = '';
                updateCode(nextDigits);
                focusInput(index - 1);
            }
        };

        const handlePaste = (index: number, event: ClipboardEvent<HTMLInputElement>) => {
            event.preventDefault();

            const pastedDigits = event.clipboardData.getData('text').replace(/\D/g, '');

            if (!pastedDigits) {
                return;
            }

            const nextDigits = [...digits];

            pastedDigits
                .slice(0, length - index)
                .split('')
                .forEach((digit, digitIndex) => {
                    nextDigits[index + digitIndex] = digit;
                });

            updateCode(nextDigits);
            focusInput(Math.min(index + pastedDigits.length, length - 1));
        };

        return (
            <form
                className={twMerge('auth-form flex flex-col items-center', className)}
                onSubmit={handleSubmit}
                {...restProps}
            >
                <div className="form-header mb-8">
                    <h2 className="font-bold text-[24px]">Enter verification code</h2>
                    <p className="text-[14px] text-sub-text mt-2">
                        Enter the 6-digit code sent to your email
                    </p>
                </div>

                <div className={rootStyles({ state })}>
                    {label && (
                        <label htmlFor={`${inputId}-0`} className={labelStyles({ variant })}>
                            {label}
                        </label>
                    )}

                    <div
                        className={codeGroupStyles({ state })}
                        role="group"
                        aria-label={label ?? 'Verification code'}
                    >
                        {Array.from({ length }, (_, index) => (
                            <input
                                key={index}
                                id={`${inputId}-${index}`}
                                ref={(node) => {
                                    inputRefs.current[index] = node;
                                }}
                                aria-label={`Verification code digit ${index + 1}`}
                                aria-invalid={Boolean(finalErrorMessage)}
                                autoFocus={autoFocus && index === 0}
                                autoComplete={index === 0 ? 'one-time-code' : 'off'}
                                className={twMerge(codeInputStyles({ state }), inputClassName)}
                                disabled={disabled}
                                inputMode="numeric"
                                maxLength={1}
                                name={name ? `${name}-${index}` : undefined}
                                pattern="[0-9]*"
                                type="text"
                                value={digits[index] ?? ''}
                                onChange={(event) => handleChange(index, event.currentTarget.value)}
                                onKeyDown={(event) => handleKeyDown(index, event)}
                                onPaste={(event) => handlePaste(index, event)}
                            />
                        ))}
                    </div>

                    {finalErrorMessage && (
                        <span className="mt-1 text-sm text-[12px] text-danger">
                            {finalErrorMessage}
                        </span>
                    )}
                </div>

                <Button className="mt-5 mb-5" disabled={disabled || isSubmitting} fullWidth>
                    {isSubmitting ? 'Verifying...' : 'Verify'}
                </Button>

                <Link href="/signup/resend-email" className="underline">
                    Resend code
                </Link>

                {isSubmitting && <Loader />}
            </form>
        );
    },
);

VerificationCodeForm.displayName = 'VerificationCodeForm';

function normalizeCode(value: string | undefined, length: number) {
    return (value ?? '').replace(/\D/g, '').slice(0, length);
}
