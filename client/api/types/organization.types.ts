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
