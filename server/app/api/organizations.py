from fastapi import APIRouter, Depends, Query

from app.api.dependencies.auth import CurrentUser
from app.dependencies.organization_dependencies import get_organization_service
from app.schemas.organization import (
    ApproveJoinRequestResponseSchema,
    CreateOrganizationResponseSchema,
    CreateOrganizationSchema,
    JoinRequestResponseSchema,
    OrganizationSearchResponseSchema,
    PendingJoinRequestsResponseSchema,
    RejectJoinRequestResponseSchema,
)
from app.services.organization_service import OrganizationService
from app.validators.organization_validator import validate_create_organization_body

router = APIRouter(prefix="/organizations", tags=["organizations"])


@router.get("/search", response_model=OrganizationSearchResponseSchema)
def search_organizations(
    current_user: CurrentUser,
    query: str = Query(default=""),
    organization_service: OrganizationService = Depends(get_organization_service),
) -> OrganizationSearchResponseSchema:
    return OrganizationSearchResponseSchema(
        success=True,
        data=organization_service.search_organizations(query=query),
    )


@router.post("", response_model=CreateOrganizationResponseSchema)
def create_organization(
    current_user: CurrentUser,
    data: CreateOrganizationSchema = Depends(validate_create_organization_body),
    organization_service: OrganizationService = Depends(get_organization_service),
) -> CreateOrganizationResponseSchema:
    return CreateOrganizationResponseSchema(
        success=True,
        message="Organization created successfully",
        data=organization_service.create_organization(
            current_user=current_user,
            data=data,
        ),
    )


@router.post("/{organization_id}/join-requests", response_model=JoinRequestResponseSchema)
def create_join_request(
    organization_id: int,
    current_user: CurrentUser,
    organization_service: OrganizationService = Depends(get_organization_service),
) -> JoinRequestResponseSchema:
    return JoinRequestResponseSchema(
        success=True,
        message="Join request sent successfully",
        data=organization_service.create_join_request(
            current_user=current_user,
            organization_id=organization_id,
        ),
    )


@router.get(
    "/{organization_id}/join-requests",
    response_model=PendingJoinRequestsResponseSchema,
)
def get_join_requests(
    organization_id: int,
    current_user: CurrentUser,
    status: str = Query(default="pending"),
    organization_service: OrganizationService = Depends(get_organization_service),
) -> PendingJoinRequestsResponseSchema:
    return PendingJoinRequestsResponseSchema(
        success=True,
        data=organization_service.get_pending_join_requests(
            current_user=current_user,
            organization_id=organization_id,
            status=status,
        ),
    )


@router.post(
    "/{organization_id}/join-requests/{request_id}/approve",
    response_model=ApproveJoinRequestResponseSchema,
)
def approve_join_request(
    organization_id: int,
    request_id: int,
    current_user: CurrentUser,
    organization_service: OrganizationService = Depends(get_organization_service),
) -> ApproveJoinRequestResponseSchema:
    return ApproveJoinRequestResponseSchema(
        success=True,
        message="Join request approved successfully",
        data=organization_service.approve_join_request(
            current_user=current_user,
            organization_id=organization_id,
            request_id=request_id,
        ),
    )


@router.post(
    "/{organization_id}/join-requests/{request_id}/reject",
    response_model=RejectJoinRequestResponseSchema,
)
def reject_join_request(
    organization_id: int,
    request_id: int,
    current_user: CurrentUser,
    organization_service: OrganizationService = Depends(get_organization_service),
) -> RejectJoinRequestResponseSchema:
    return RejectJoinRequestResponseSchema(
        success=True,
        message="Join request rejected successfully",
        data=organization_service.reject_join_request(
            current_user=current_user,
            organization_id=organization_id,
            request_id=request_id,
        ),
    )
