'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import type { CreateAssetFormValues } from '@/components/forms/createAssetForm/createAssetForm.types';

import { createAssetFieldMap } from '@/components/forms/createAssetForm/createAssetForm.fieldMap';
import { createAssetSchema } from '@/components/forms/createAssetForm/createAssetForm.validation';
import { Loader } from '@/components/loader/Loader';
import { Button } from '@/components/ui/button/Button';
import { ControlledTextField } from '@/components/ui/controlled/controlledTextField/ControlledTextField';
import { AssetStatusSelect } from '@/components/ui/selects/AssetStatusSelect';
import { useCreateAssetMutation } from '@/hooks/mutations/useCreateAssetMutation';
import { getCreateAssetErrorMessage } from '@/utils/assets/assetsUtils/assetsUtils';
import { setBackendFieldErrors } from '@/utils/assets/assetsUtils/setBackendFieldErrors';
import { mapCreateAssetFormValuesToPayload } from '@/utils/mappers/assets';

type CreateAssetFormProps = {
    className?: string;
    onCancel?: () => void;
    onSuccess?: () => void;
};

const createAssetDefaultValues = {
    name: '',
    category: '',
    serialNumber: '',
    status: 'available',
    assignedToUserId: '',
    assignedAt: '',
    dueDate: '',
    imageUrl: '',
} satisfies CreateAssetFormValues;

export const CreateAssetForm = ({
    className = 'flex flex-col',
    onCancel,
    onSuccess,
}: CreateAssetFormProps) => {
    const [serverError, setServerError] = useState<string | null>(null);
    const createAssetMutation = useCreateAssetMutation();

    const { control, handleSubmit, reset, setError } = useForm<CreateAssetFormValues>({
        resolver: zodResolver(createAssetSchema),
        defaultValues: createAssetDefaultValues,
    });

    const onSubmitForm = async (data: CreateAssetFormValues) => {
        setServerError(null);

        try {
            const payload = mapCreateAssetFormValuesToPayload(data);

            await createAssetMutation.mutateAsync(payload);

            reset(createAssetDefaultValues);
            onSuccess?.();
        } catch (error) {
            const hasFieldError = setBackendFieldErrors<CreateAssetFormValues>({
                error,
                setError,
                setServerError,
                fieldMap: createAssetFieldMap,
            });

            if (!hasFieldError) {
                setServerError(getCreateAssetErrorMessage(error));
            }
        }
    };

    const isSubmitting = createAssetMutation.isPending;

    return (
        <form className={className} onSubmit={handleSubmit(onSubmitForm)}>
            <div className="flex flex-col gap-5">
                <ControlledTextField
                    control={control}
                    name="name"
                    label="Asset name"
                    placeholder="Ex: Dell XPS 15"
                    disabled={isSubmitting}
                />
                <ControlledTextField
                    control={control}
                    name="category"
                    label="Category"
                    placeholder="Ex: Laptop"
                    disabled={isSubmitting}
                />
                <ControlledTextField
                    control={control}
                    name="serialNumber"
                    label="Serial number"
                    placeholder="Ex: DXPS-001"
                    disabled={isSubmitting}
                />
                <AssetStatusSelect control={control} disabled={isSubmitting} />
                <ControlledTextField
                    control={control}
                    name="assignedToUserId"
                    label="Assigned user ID"
                    placeholder="Ex: 42"
                    type="number"
                    min={1}
                    disabled={isSubmitting}
                />
                <ControlledTextField
                    control={control}
                    name="assignedAt"
                    label="Assigned at"
                    type="datetime-local"
                    disabled={isSubmitting}
                />
                <ControlledTextField
                    control={control}
                    name="dueDate"
                    label="Due date"
                    type="datetime-local"
                    disabled={isSubmitting}
                />
                <ControlledTextField
                    control={control}
                    name="imageUrl"
                    label="Image URL"
                    placeholder="https://example.com/asset.jpg"
                    type="url"
                    disabled={isSubmitting}
                />
            </div>

            {serverError && <p className="mt-4 text-sm text-danger">{serverError}</p>}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button fullWidth disabled={isSubmitting} type="submit">
                    {isSubmitting ? 'Creating asset...' : 'Create asset'}
                </Button>
                {onCancel && (
                    <Button
                        type="button"
                        variant="transparent"
                        size="transparent"
                        className="inline-flex min-h-10 items-center justify-center rounded-lg border border-gray-main bg-white px-8 py-3.5 text-sm font-medium text-main transition hover:bg-round focus-visible:ring-1 focus-visible:ring-main focus-visible:ring-offset-1"
                        disabled={isSubmitting}
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                )}
            </div>

            {isSubmitting && <Loader />}
        </form>
    );
};
