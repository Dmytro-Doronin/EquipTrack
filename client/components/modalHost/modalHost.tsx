'use client';

import { cva } from 'class-variance-authority';
import * as React from 'react';
import { createPortal } from 'react-dom';
import { twMerge } from 'tailwind-merge';

import { CreateAsset } from '@/components/modals/CreateAsset';
import { LogoutConfirmation } from '@/components/modals/LogoutConfirmation';
import { useModalStore } from '@/stores/modal.store';

const overlayClass = cva(
    'fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200',
    {
        variants: {
            opened: {
                true: 'opacity-100 bg-main/60 pointer-events-auto',
                false: 'opacity-0 bg-black/0 pointer-events-none',
            },
        },
        defaultVariants: {
            opened: false,
        },
    },
);

export const ModalHost = () => {
    const { activeModal, opened, close, finishClose } = useModalStore();

    if (typeof document === 'undefined') {
        return null;
    }

    const onTransitionEnd: React.TransitionEventHandler<HTMLDivElement> = (e) => {
        if (e.target !== e.currentTarget) {
            return;
        }
        if (!opened && activeModal) {
            finishClose();
        }
    };

    if (!activeModal) {
        return null;
    }

    return createPortal(
        <div
            className={twMerge(overlayClass({ opened }))}
            onTransitionEnd={onTransitionEnd}
            onClick={opened ? close : undefined}
        >
            <div onClick={(e) => e.stopPropagation()} key={activeModal}>
                {activeModal === 'logout' && <LogoutConfirmation isOpen={opened} onClose={close} />}
                {activeModal === 'createAsset' && <CreateAsset isOpen={opened} onClose={close} />}
            </div>
        </div>,
        document.body,
    );
};
