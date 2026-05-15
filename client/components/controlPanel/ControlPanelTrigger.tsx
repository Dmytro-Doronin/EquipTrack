import { useState } from 'react';

import { User } from '@/actions/types';
import { DropdownMenu } from '@/components/controlPanel/DropdownMenu';
import { Button } from '@/components/ui/button/Button';
import { UserInfo } from '@/components/userInfo/UserInfo';
import { LinkOption } from '@/types/linkOptionTypes';

type ControlPanelTriggerProps = {
    options: LinkOption[];
    user: User;
};

export const ControlPanelTrigger = ({ options, user }: ControlPanelTriggerProps) => {
    const [openMenu, setOpenMenu] = useState(false);
    const onSetOpenMenu = (open: boolean) => {
        setOpenMenu(open);
    };
    return (
        <DropdownMenu openMenu={openMenu} options={options} setOpenMenu={onSetOpenMenu}>
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
