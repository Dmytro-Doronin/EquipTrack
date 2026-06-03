from fastapi import APIRouter, Depends

from app.api.dependencies.auth import CurrentUser
from app.dependencies.organization_dependencies import get_organization_service
from app.schemas.organization import (
    CreateOrganizationResponseSchema,
    CreateOrganizationSchema,
)
from app.services.organization_service import OrganizationService
from app.validators.organization_validator import validate_create_organization_body

router = APIRouter(prefix="/organizations", tags=["organizations"])


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
