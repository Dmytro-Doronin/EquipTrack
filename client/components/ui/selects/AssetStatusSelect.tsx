import { useId } from 'react';
import { type Control, useController } from 'react-hook-form';

import type { CreateAssetFormValues } from '@/components/forms/createAssetForm/createAssetForm.types';

import { statusOptions } from '@/mock/statusOptions';

type AssetStatusSelectProps = {
    control: Control<CreateAssetFormValues>;
    disabled?: boolean;
};

export const AssetStatusSelect = ({ control, disabled }: AssetStatusSelectProps) => {
    const id = useId();
    const {
        field,
        fieldState: { error },
    } = useController({
        name: 'status',
        control,
    });

    return (
        <div className="flex w-full flex-col items-center gap-[7px] hover:cursor-pointer lg:items-start">
            <label htmlFor={id} className="mb-0.5 text-[12px] text-sub-text">
                Status
            </label>
            <select
                id={id}
                className={`h-[46px] w-full max-w-[384px] rounded-[5px] border bg-dark-800 px-[12px] text-[14px] text-light-100 outline-none transition focus:outline focus:outline-1 disabled:cursor-not-allowed disabled:opacity-70 ${
                    error
                        ? 'border-danger hover:border-danger focus:border-danger focus:outline-danger'
                        : 'border-gray-main hover:border-dark focus:border-outline-focus focus:outline-dark'
                }`}
                value={field.value}
                name={field.name}
                onBlur={field.onBlur}
                onChange={field.onChange}
                ref={field.ref}
                disabled={disabled}
            >
                {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error?.message && (
                <span className="mt-1 text-sm text-[12px] text-danger">{error.message}</span>
            )}
        </div>
    );
};
