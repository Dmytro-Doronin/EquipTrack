'use client';

import { useState } from 'react';

import { OrganizationJoinRequest } from '@/api/types/organization.types';
import { Loader } from '@/components/loader/Loader';
import { Button } from '@/components/ui/button/Button';
import { useApproveJoinRequestMutation } from '@/hooks/mutations/useApproveJoinRequestMutation';
import { useRejectJoinRequestMutation } from '@/hooks/mutations/useRejectJoinRequestMutation';
import { usePendingJoinRequestsQuery } from '@/hooks/query/usePendingJoinRequestsQuery';
import { getErrorMessage } from '@/utils/ErrorUtil';
import { formatDisplayDate } from '@/utils/formatDate';

type PendingJoinRequestsPanelProps = {
    organizationId: number;
};

type RequestAction = 'approve' | 'reject';

type ActionState = {
    action: RequestAction;
    requestId: number;
} | null;

export function PendingJoinRequestsPanel({ organizationId }: PendingJoinRequestsPanelProps) {
    const [actionError, setActionError] = useState<string | null>(null);
    const [actionState, setActionState] = useState<ActionState>(null);

    const pendingJoinRequestsQuery = usePendingJoinRequestsQuery(organizationId);
    const approveJoinRequestMutation = useApproveJoinRequestMutation();
    const rejectJoinRequestMutation = useRejectJoinRequestMutation();

    const isSubmitting =
        approveJoinRequestMutation.isPending || rejectJoinRequestMutation.isPending;

    const handleModeration = async (requestId: number, action: RequestAction) => {
        setActionError(null);
        setActionState({
            action,
            requestId,
        });

        try {
            if (action === 'approve') {
                await approveJoinRequestMutation.mutateAsync({
                    organizationId,
                    requestId,
                });
            } else {
                await rejectJoinRequestMutation.mutateAsync({
                    organizationId,
                    requestId,
                });
            }
        } catch (error) {
            setActionError(getErrorMessage(error));
        } finally {
            setActionState(null);
        }
    };

    return (
        <section className="rounded-[12px] border border-gray-main bg-white p-6">
            <div className="mb-5">
                <h2 className="text-xl font-bold text-dark">Pending join requests</h2>
            </div>

            {pendingJoinRequestsQuery.errorMessage && (
                <p className="mb-4 text-sm text-danger">{pendingJoinRequestsQuery.errorMessage}</p>
            )}

            {actionError && <p className="mb-4 text-sm text-danger">{actionError}</p>}

            {pendingJoinRequestsQuery.isLoading && <Loader />}

            {!pendingJoinRequestsQuery.isLoading &&
                pendingJoinRequestsQuery.joinRequests.length === 0 && (
                    <div className="rounded-lg border border-gray-main bg-round px-4 py-5 text-center text-sm text-sub-text">
                        No pending join requests
                    </div>
                )}

            {!pendingJoinRequestsQuery.isLoading &&
                pendingJoinRequestsQuery.joinRequests.length > 0 && (
                    <div className="divide-y divide-gray-main overflow-hidden rounded-lg border border-gray-main">
                        {pendingJoinRequestsQuery.joinRequests.map((request) => (
                            <PendingJoinRequestRow
                                actionState={actionState}
                                disabled={isSubmitting}
                                key={request.id}
                                request={request}
                                onModerate={handleModeration}
                            />
                        ))}
                    </div>
                )}
        </section>
    );
}

type PendingJoinRequestRowProps = {
    actionState: ActionState;
    disabled: boolean;
    request: OrganizationJoinRequest;
    onModerate: (requestId: number, action: RequestAction) => void;
};

function PendingJoinRequestRow({
    actionState,
    disabled,
    request,
    onModerate,
}: PendingJoinRequestRowProps) {
    const requestedDate = formatDisplayDate(request.createdAt);
    const displayName = request.user.login || request.user.email;
    const isApproving = actionState?.requestId === request.id && actionState.action === 'approve';
    const isRejecting = actionState?.requestId === request.id && actionState.action === 'reject';

    return (
        <div className="flex flex-col gap-4 bg-white px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
                <h3 className="truncate text-base font-bold text-dark">{displayName}</h3>
                <p className="mt-1 truncate text-sm text-sub-text">{request.user.email}</p>
                {requestedDate && (
                    <p className="mt-2 text-xs text-sub-text">Requested on {requestedDate}</p>
                )}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row lg:shrink-0">
                <Button
                    className="disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={disabled}
                    onClick={() => onModerate(request.id, 'approve')}
                    size="compact"
                    type="button"
                >
                    {isApproving ? 'Approving...' : 'Approve'}
                </Button>
                <Button
                    className="inline-flex min-h-10 items-center justify-center rounded-lg border border-danger/50 bg-white px-4 py-2 text-sm font-medium text-danger transition hover:bg-danger/5 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={disabled}
                    onClick={() => onModerate(request.id, 'reject')}
                    size="transparent"
                    type="button"
                    variant="transparent"
                >
                    {isRejecting ? 'Rejecting...' : 'Reject'}
                </Button>
            </div>
        </div>
    );
}
