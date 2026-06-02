export type Organization = {
    id: number;
    name: string;
};

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

export type JoinOrganizationPayload = {
    organizationName: string;
};

export type PendingOrganizationRequest = {
    id: number;
    organizationName: string;
    status: 'pending';
    createdAt: string;
};

export type JoinOrganizationResponse = {
    success: boolean;
    message: string;
    data: {
        pendingRequest: PendingOrganizationRequest;
    };
};

export type JoinOrganizationResult = JoinOrganizationResponse['data'];
