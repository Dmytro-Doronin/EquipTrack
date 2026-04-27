'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { CreateOrganizationFormValues } from '@/components/forms/createOrganizationForm/createOrganizationForm.types';
import { createOrganizationSchema } from '@/components/forms/createOrganizationForm/createOrganizationForm.validation';
import Link from '@/components/icons/Link';
import { Button } from '@/components/ui/button/Button';
import { ControlledTextArea } from '@/components/ui/controlled/controlledTextArea/ControlledTextArea';
import { ControlledTextField } from '@/components/ui/controlled/controlledTextField/ControlledTextField';

import UsersIcon from '../../icons/UsersIcon';

export const CreateOrganizationForm = () => {
    const { control, handleSubmit, reset } = useForm<CreateOrganizationFormValues>({
        resolver: zodResolver(createOrganizationSchema),
        defaultValues: {
            organizationName: '',
            workspaceSlug: '',
            description: '',
        },
    });

    const onSubmitForm = (data: CreateOrganizationFormValues) => {
        console.log(data);
        reset();
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit(onSubmitForm)}>
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
                    name="organizationName"
                    label="Organization name"
                    Icon={UsersIcon}
                />

                <ControlledTextField
                    placeholder="Ex: acme-inc"
                    control={control}
                    name="workspaceSlug"
                    label="Workspace slug"
                    Icon={Link}
                />

                <ControlledTextArea
                    placeholder="Tell us a bit about your organization"
                    control={control}
                    name="description"
                    label="Optional description"
                />
            </div>

            <Button className="mb-5" fullWidth>
                Create organization
            </Button>
        </form>
    );
};
