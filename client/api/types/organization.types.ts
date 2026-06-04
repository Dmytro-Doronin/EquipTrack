export type Organization = {
    id: number;
    name: string;
};

export type OrganizationSearchResult = Organization;

export type OrganizationMembership = {
    role: 'owner' | 'admin' | 'member';
    status: 'active' | 'pending';
};

export type CreateOrganizationPayload = {
    name: string;
};

export type CreateOrganizationResponse = {
    success: boolean;
    message: string;
    data: {
        organization: Organization;
        membership: OrganizationMembership;
    };
};

export type CreateOrganizationResult = CreateOrganizationResponse['data'];

export type PendingOrganizationRequest = {
    id: number;
    organizationId: number;
    organizationName: string;
    status: 'pending';
    createdAt: string;
};

export type SearchOrganizationsResponse = {
    success: boolean;
    data: OrganizationSearchResult[];
};

export type CreateJoinRequestResponse = {
    success: boolean;
    message: string;
    data: PendingOrganizationRequest;
};

export type CreateJoinRequestResult = CreateJoinRequestResponse['data'];

export type JoinRequestUser = {
    id: number;
    login?: string | null;
    email: string;
    avatarUrl?: string | null;
};

export type OrganizationJoinRequest = {
    id: number;
    organizationId: number;
    user: JoinRequestUser;
    status: 'pending';
    createdAt: string;
};

export type GetJoinRequestsResponse = {
    success: boolean;
    data: OrganizationJoinRequest[];
};

export type ModerateJoinRequestPayload = {
    organizationId: number;
    requestId: number;
};

export type ApproveJoinRequestResponse = {
    success: boolean;
    message: string;
    data: {
        id: number;
        organizationId: number;
        userId: number;
        role: 'member';
        status: 'active';
    };
};

export type ApproveJoinRequestResult = ApproveJoinRequestResponse['data'];

export type RejectJoinRequestResponse = {
    success: boolean;
    message: string;
    data: {
        id: number;
        organizationId: number;
        status: 'rejected';
    };
};

export type RejectJoinRequestResult = RejectJoinRequestResponse['data'];
