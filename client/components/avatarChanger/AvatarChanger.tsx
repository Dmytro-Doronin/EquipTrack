import Image from 'next/image';
import { useEffect, useState } from 'react';

import UsersIcon from '@/components/icons/UsersIcon';
import { InputFile } from '@/components/inputFile/InputFile';

type AvatarChangerProps = {
    sendAvatar: (avatar: File | null) => void;
};

export const AvatarChanger = ({ sendAvatar }: AvatarChangerProps) => {
    const [avatar, setAvatar] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const updateAvatarHandler = async (data: File) => {
        setAvatar(data);
        sendAvatar(data);
    };

    useEffect(() => {
        if (!avatar) {
            setPreview(null);
            return;
        }

        const objectUrl = URL.createObjectURL(avatar);
        setPreview(objectUrl);

        return () => {
            URL.revokeObjectURL(objectUrl);
        };
    }, [avatar]);

    return (
        <InputFile callback={updateAvatarHandler}>
            <div className="relative h-20 w-20 rounded-full">
                <div className="flex w-full h-full items-center overflow-hidden rounded-full justify-center bg-gray-main">
                    {preview ? (
                        <Image
                            src={preview}
                            alt="User avatar preview"
                            fill
                            className="object-cover rounded-full"
                        />
                    ) : (
                        <UsersIcon />
                    )}
                </div>
                <div className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-dark text-white">
                    +
                </div>
            </div>
        </InputFile>
    );
};
