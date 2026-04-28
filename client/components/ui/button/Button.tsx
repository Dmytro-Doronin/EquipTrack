import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

const buttonStyles = cva(
    [
        'font-inherit text-inherit',
        'inline-flex items-center justify-center gap-1',
        'rounded-[8px] text-sm font-medium text-center',
        'border-0 cursor-pointer select-none outline-none',
        'focus-visible:ring-1 focus-visible:ring-offset-1',
        'transition ease-in-out duration-300',
    ].join(' '),
    {
        variants: {
            variant: {
                primary: 'bg-main text-gray-main hover:bg-mail-light',
                link: 'bg-transparent text-light-100 p-0',
            },
            size: {
                default: 'min-h-10 min-w-10 px-[55px] py-3.5',
                compact: 'min-h-10 min-w-0 px-2.5 py-2',
                auth: 'min-h-12 px-[70px] py-[21px]',
            },
            fullWidth: {
                true: 'w-full',
                false: '',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'default',
            fullWidth: false,
        },
    },
);

type OwnProps = {
    children: ReactNode;
    className?: string;
} & VariantProps<typeof buttonStyles>;

type PolymorphicProps<T extends ElementType> = {
    as?: T;
} & OwnProps &
    Omit<ComponentPropsWithoutRef<T>, keyof OwnProps | 'as'>;

export const Button = <T extends ElementType = 'button'>(props: PolymorphicProps<T>) => {
    const { as, children, className, variant, fullWidth, size, ...rest } = props;
    const Component = (as ?? 'button') as ElementType;

    return (
        <Component
            className={twMerge(buttonStyles({ variant, fullWidth, size }), className)}
            {...rest}
        >
            {children}
        </Component>
    );
};
