import Link from 'next/link';
import { ReactNode, useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

import { LinkOption } from '@/types/linkOptionTypes';

import { Button } from '../ui/button/Button';

type ControlPanelTypes = {
    classNames?: string;
    options: LinkOption[];
    children: ReactNode;
    openMenu: boolean;
    setOpenMenu: (open: boolean) => void;
};

export const DropdownMenu = ({
    classNames,
    options,
    children,
    openMenu,
    setOpenMenu,
}: ControlPanelTypes) => {
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!openMenu) return;

        const onPointerDown = (e: PointerEvent) => {
            const el = wrapperRef.current;
            if (!el) {
                return;
            }
            if (!el.contains(e.target as Node)) {
                setOpenMenu(false);
            }
        };

        document.addEventListener('pointerdown', onPointerDown);
        return () => document.removeEventListener('pointerdown', onPointerDown);
    }, [openMenu]);

    return (
        <div ref={wrapperRef} className={twMerge('hidden md:flex relative', classNames)}>
            {children}
            <div
                className={[
                    'absolute left-0 top-[calc(100%+8px)] z-400 flex flex-col items-start rounded-2xl border border-white/10 bg-main text-white shadow-[0_12px_40px_rgba(0,0,0,0.35)] overflow-hidden',
                    'min-w-40 w-max',
                    'opacity-0 invisible transition-opacity duration-300 ease-in-out',
                    openMenu && 'opacity-100 visible',
                ]
                    .filter(Boolean)
                    .join(' ')}
            >
                {options.map((option) => {
                    const content = (
                        <div className="flex items-center gap-2.5 text-light-100">
                            <span>{option.title}</span>
                        </div>
                    );

                    return option.link ? (
                        <Button
                            key={option.id}
                            as={Link}
                            className="flex justify-start w-full rounded-none p-2.5 transition-none
                         hover:text-(--color-dark-900) hover:bg-gray-400"
                            href={option.link}
                            variant="link"
                            onClick={() => setOpenMenu(false)}
                        >
                            {content}
                        </Button>
                    ) : (
                        <Button
                            key={option.id}
                            className="flex justify-start w-full rounded-none p-2.5 transition-none
                         hover:text-white hover:bg-gray-400"
                            variant="link"
                            onClick={() => {
                                option.actionCallback?.();
                                setOpenMenu(false);
                            }}
                        >
                            {content}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
};
