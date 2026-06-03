'use client';

import { type FormEvent, useState } from 'react';

import { OrganizationSearchResult } from '@/api/types/organization.types';
import Search from '@/components/icons/Search';
import { OrganizationList } from '@/components/organizationsList/OrganizationList';
import { Button } from '@/components/ui/button/Button';
import { TextField } from '@/components/ui/textField/TextField';
import { useCreateJoinRequestMutation } from '@/hooks/mutations/useCreateJoinRequestMutation';
import { useOrganizationsSearchQuery } from '@/hooks/query/useOrganizationsSearchQuery';
import { getErrorMessage } from '@/utils/ErrorUtil';

type JoinClientProps = {
    onCancel?: () => void;
};

export const JoinClient = ({ onCancel }: JoinClientProps) => {
    const [query, setQuery] = useState('');
    const [submittedQuery, setSubmittedQuery] = useState('');
    const [formError, setFormError] = useState<string | null>(null);
    const [joinError, setJoinError] = useState<string | null>(null);
    const [requestingOrganizationId, setRequestingOrganizationId] = useState<number | null>(null);

    const createJoinRequestMutation = useCreateJoinRequestMutation();
    const organizationsQuery = useOrganizationsSearchQuery(submittedQuery, {
        enabled: submittedQuery.length > 0,
        showGlobalError: false,
    });

    const organizations = organizationsQuery.organizations;
    const searchError = organizationsQuery.errorMessage;

    const hasSearched = submittedQuery.length > 0;
    const visibleError = formError ?? searchError ?? joinError;
    const isSearching = organizationsQuery.isFetching;
    const isRequesting = createJoinRequestMutation.isPending;

    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextQuery = query.trim();

        setJoinError(null);

        if (!nextQuery) {
            setSubmittedQuery('');
            setFormError('Enter an organization name to search.');
            return;
        }

        setFormError(null);

        if (nextQuery === submittedQuery) {
            void organizationsQuery.refetch();
            return;
        }

        setSubmittedQuery(nextQuery);
    };

    const handleRequestJoin = async (organization: OrganizationSearchResult) => {
        setFormError(null);
        setJoinError(null);
        setRequestingOrganizationId(organization.id);

        try {
            await createJoinRequestMutation.mutateAsync(organization.id);
        } catch (error) {
            setJoinError(getErrorMessage(error));
        } finally {
            setRequestingOrganizationId(null);
        }
    };

    return (
        <div className="w-full max-w-2xl rounded-lg bg-white p-5">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p className="mb-2 text-sm font-medium text-sub-text">Join organization</p>
                    <h2 className="text-2xl font-bold text-dark">Find your team workspace</h2>
                </div>
                {onCancel && (
                    <Button
                        className="inline-flex min-h-10 items-center justify-center rounded-lg border border-gray-main bg-white px-6 py-2.5 text-sm font-medium text-main transition hover:bg-round focus-visible:ring-1 focus-visible:ring-main focus-visible:ring-offset-1"
                        disabled={isRequesting}
                        onClick={onCancel}
                        size="transparent"
                        type="button"
                        variant="transparent"
                    >
                        Cancel
                    </Button>
                )}
            </div>

            <form
                className="mb-5 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]"
                onSubmit={handleSearch}
            >
                <TextField
                    Icon={Search}
                    className="text-dark placeholder:text-sub-text"
                    containerClassName="flex"
                    disabled={isSearching || isRequesting}
                    onValueChange={setQuery}
                    placeholder="Ex: Albert Heijn Haarlem"
                    value={query}
                />
                <Button
                    className="disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isSearching || isRequesting}
                    type="submit"
                >
                    {isSearching ? 'Searching...' : 'Search'}
                </Button>
            </form>

            {visibleError && <p className="mb-4 text-sm text-danger">{visibleError}</p>}

            {isSearching && (
                <div className="rounded-lg border border-gray-main bg-round px-4 py-5 text-center text-sm text-sub-text">
                    Searching organizations...
                </div>
            )}

            {!isSearching && hasSearched && !searchError && organizations.length === 0 && (
                <div className="rounded-lg border border-gray-main bg-round px-4 py-5 text-center text-sm text-sub-text">
                    No organizations found
                </div>
            )}

            {!isSearching && organizations.length > 0 && (
                <OrganizationList
                    disabled={isRequesting}
                    organizations={organizations}
                    requestingOrganizationId={requestingOrganizationId}
                    onRequestJoin={handleRequestJoin}
                />
            )}
        </div>
    );
};
