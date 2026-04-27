'use client';

import { Button } from '@/components/ui/button/Button';
import { TextField } from '@/components/ui/textField/TextField';

export const JoinClientPage = () => {
    return (
        <div className="max-w-2xl w-full bg-white rounded-lg p-5 mt-7.5">
            <div className="grid grid-cols-2 grid gap-6">
                <TextField containerClassName="flex" placeholder="Ex: organization name or slug" />
                <Button>Search</Button>
            </div>
        </div>
    );
};
