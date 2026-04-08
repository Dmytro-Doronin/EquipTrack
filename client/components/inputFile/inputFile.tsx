'use client';

import { ChangeEvent, ReactElement, useRef, useState } from 'react';

type InputFileType = {
    callback?: (data: File) => void;
    children: ReactElement;
};

export const InputFile = ({ callback, children }: InputFileType) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [fileError, setFileError] = useState<string | null>(null);
    const selectFileHandler = () => {
        inputRef.current?.click();
    };

    // file validation
    const isValidFile = (file: File) => {
        const allowedTypes = ['image/jpeg', 'image/png'];
        const maxSize = 1024 * 1024; // 1 MB

        return allowedTypes.includes(file.type) && file.size <= maxSize;
    };

    const uploadHandler = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0];

        if (file && isValidFile(file)) {
            callback?.(file);
        } else {
            setFileError('Chose valid picture');
        }
    };

    return (
        <div onClick={selectFileHandler}>
            {children}
            <input
                style={{ display: 'none' }}
                ref={inputRef}
                type="file"
                onChange={uploadHandler}
            />
            <span>{fileError}</span>
        </div>
    );
};
