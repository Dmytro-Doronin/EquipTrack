import { create } from 'zustand';

import { lockScroll, unlockScroll } from '@/utils/scroll.util';

export type ModalName = null | 'logout' | 'createAsset';

type ModalPayload = {
    logout?: never;
    createAsset?: never;
};

type ModalState = {
    activeModal: ModalName;
    opened: boolean;
    payload: ModalPayload[keyof ModalPayload] | null;

    open: <T extends Exclude<ModalName, null>>(name: T, payload?: ModalPayload[T]) => void;
    close: () => void;
    finishClose: () => void;
};

export const useModalStore = create<ModalState>((set) => ({
    activeModal: null,
    opened: false,
    payload: null,

    open: (name, payload) => {
        lockScroll();
        set({ activeModal: name, payload: payload ?? null, opened: false });
        requestAnimationFrame(() => set({ opened: true }));
    },

    close: () => {
        set({ opened: false });
    },

    finishClose: () => {
        unlockScroll();
        set({ activeModal: null, payload: null });
    },
}));
