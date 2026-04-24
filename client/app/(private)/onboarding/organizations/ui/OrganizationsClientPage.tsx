'use client';

import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { Checkbox } from '@/components/ui/checkbox/Checkbox';
import { OrganizationAction, organizationOptions } from '@/mock/organizationsOptions';

export const OrganizationsClientPage = () => {
    const [selectedAction, setSelectedAction] = useState<OrganizationAction | null>(null);

    return (
        <div className="max-w-2xl w-full bg-white rounded-[8px] p-[20px] mt-[30px]">
            <h1 className="font-bold text-[24px] text-center mb-8">
                Create or join an organization
            </h1>

            <div className="flex flex-col gap-[16px]">
                {organizationOptions.map(({ id, title, description, Icon }) => {
                    const isSelected = selectedAction === id;
                    const inputId = `organization-action-${id}`;

                    return (
                        <label
                            key={id}
                            htmlFor={inputId}
                            className={twMerge(
                                'flex justify-between items-center p-6.5 rounded-[8px] border-[2px] cursor-pointer',
                                'transition-shadow duration-200',
                                'hover:shadow-[0_4px_12px_rgba(156,163,175,0.35)]',
                                isSelected ? 'border-dark' : 'border-gray-main',
                            )}
                        >
                            <div className="flex gap-[16px]">
                                <div className="w-[48px] h-[48px] bg-round rounded-full flex items-center justify-center">
                                    <Icon />
                                </div>

                                <div className="flex flex-col">
                                    <h2 className="font-bold text-[18px] text-main">{title}</h2>
                                    <p className="text-[14px] text-sub-text">{description}</p>
                                </div>
                            </div>

                            <Checkbox
                                id={inputId}
                                checked={isSelected}
                                onValueChange={() => setSelectedAction(id)}
                            />
                        </label>
                    );
                })}
            </div>
        </div>
    );
};
