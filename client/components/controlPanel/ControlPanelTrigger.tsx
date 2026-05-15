import { useState } from 'react';

import { User } from '@/actions/types';
import { DropdownMenu } from '@/components/controlPanel/DropdownMenu';
import { Button } from '@/components/ui/button/Button';
import { UserInfo } from '@/components/userInfo/UserInfo';
import { useModalStore } from '@/stores/modal.store';
import { DropdownAction, LinkOption } from '@/types/linkOptionTypes';

type ControlPanelTriggerProps = {
    options: LinkOption[];
    user: User;
};

export const ControlPanelTrigger = ({ options, user }: ControlPanelTriggerProps) => {
    const [openMenu, setOpenMenu] = useState(false);
    const onSetOpenMenu = (open: boolean) => {
        setOpenMenu(open);
    };
    const openModal = useModalStore((s) => s.open);

    const handleAction = (action: DropdownAction) => {
        if (action === 'logout') {
            openModal('logout');
        }
    };

    return (
        <DropdownMenu
            openMenu={openMenu}
            options={options}
            setOpenMenu={onSetOpenMenu}
            onAction={handleAction}
        >
            <Button
                variant="transparent"
                className="flex items-center gap-3 p-0"
                onClick={() => setOpenMenu((prev) => !prev)}
            >
                <UserInfo user={user} variant="dark" />
            </Button>
        </DropdownMenu>
    );
};
