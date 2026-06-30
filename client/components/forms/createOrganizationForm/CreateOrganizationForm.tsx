'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { createOrganizationFieldMap } from '@/components/forms/createOrganizationForm/createOrganizationForm.fieldMap';
import { CreateOrganizationFormValues } from '@/components/forms/createOrganizationForm/createOrganizationForm.types';
import { createOrganizationSchema } from '@/components/forms/createOrganizationForm/createOrganizationForm.validation';
import UsersIcon from '@/components/icons/UsersIcon';
import { Loader } from '@/components/loader/Loader';
import { Button } from '@/components/ui/button/Button';
import { ControlledTextField } from '@/components/ui/controlled/controlledTextField/ControlledTextField';
import { useCreateOrganizationMutation } from '@/hooks/mutations/useCreateOrganizationMutation';
import { setBackendFieldErrors } from '@/utils/assets/assetsUtils/setBackendFieldErrors';
import { getErrorMessage } from '@/utils/ErrorUtil';

type CreateOrganizationFormProps = {
    className?: string;
    onCancel?: () => void;
    onSuccess?: () => void;
};

export const CreateOrganizationForm = ({
    className = 'auth-form',
    onCancel,
    onSuccess,
}: CreateOrganizationFormProps) => {
    const [serverError, setServerError] = useState<string | null>(null);
    const router = useRouter();
    const createOrganizationMutation = useCreateOrganizationMutation();

    const { control, handleSubmit, reset, setError } = useForm<CreateOrganizationFormValues>({
        resolver: zodResolver(createOrganizationSchema),
        defaultValues: {
            name: '',
        },
    });

    const onSubmitForm = async (data: CreateOrganizationFormValues) => {
        setServerError(null);

        try {
            await createOrganizationMutation.mutateAsync({
                name: data.name,
            });

            reset();

            if (onSuccess) {
                onSuccess();
                return;
            }

            router.replace('/dashboard');
        } catch (error) {
            const hasFieldError = setBackendFieldErrors<CreateOrganizationFormValues>({
                error,
                setError,
                setServerError,
                fieldMap: createOrganizationFieldMap,
            });

            if (!hasFieldError) {
                setServerError(getErrorMessage(error));
            }
        }
    };

    const isSubmitting = createOrganizationMutation.isPending;

    return (
        <form className={className} onSubmit={handleSubmit(onSubmitForm)}>
            <div className="form-header text-center mb-[32px]">
                <h2 className="font-bold text-[24px]">Create your organization</h2>
                <p className="text-[14px] text-sub-text mt-[8px]">
                    Set up your company workspace to start managing assets and employees.
                </p>
            </div>

            <div className="flex flex-col gap-5 justify-center mb-5">
                <ControlledTextField
                    placeholder="Ex: Acme Inc."
                    control={control}
                    name="name"
                    label="Organization name"
                    Icon={UsersIcon}
                    disabled={isSubmitting}
                />
            </div>

            {serverError && <p className="text-red-500 text-sm mb-4">{serverError}</p>}

            <div className="mb-5 flex flex-col gap-3 sm:flex-row">
                <Button fullWidth disabled={isSubmitting} type="submit">
                    {isSubmitting ? 'Creating organization...' : 'Create organization'}
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
