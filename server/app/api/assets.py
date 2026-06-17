from fastapi import APIRouter, Depends, status

from app.dependencies.asset_dependencies import (
    AssetCreatorMembership,
    AssetDeleterMembership,
    AssetMembership,
    AssetUpdaterMembership,
    get_asset_service,
)
from app.schemas.asset import (
    AssetCreateSchema,
    AssetListResponseSchema,
    AssetResponseSchema,
    AssetUpdateSchema,
)
from app.services.asset_service import AssetService
from app.validators.asset_validator import (
    validate_create_asset_body,
    validate_update_asset_body,
)

router = APIRouter(prefix="/assets", tags=["assets"])


@router.get("", response_model=AssetListResponseSchema)
def list_assets(
    membership: AssetMembership,
    asset_service: AssetService = Depends(get_asset_service),
) -> AssetListResponseSchema:
    return AssetListResponseSchema(
        success=True,
        data=asset_service.list_assets(membership=membership),
    )


@router.post(
    "",
    response_model=AssetResponseSchema,
    status_code=status.HTTP_201_CREATED,
)
def create_asset(
    manager_membership: AssetCreatorMembership,
    data: AssetCreateSchema = Depends(validate_create_asset_body),
    asset_service: AssetService = Depends(get_asset_service),
) -> AssetResponseSchema:
    return AssetResponseSchema(
        success=True,
        message="Asset created successfully",
        data=asset_service.create_asset(
            manager_membership=manager_membership,
            data=data,
        ),
    )


@router.patch("/{asset_id}", response_model=AssetResponseSchema)
def update_asset(
    asset_id: int,
    manager_membership: AssetUpdaterMembership,
    data: AssetUpdateSchema = Depends(validate_update_asset_body),
    asset_service: AssetService = Depends(get_asset_service),
) -> AssetResponseSchema:
    return AssetResponseSchema(
        success=True,
        message="Asset updated successfully",
        data=asset_service.update_asset(
            manager_membership=manager_membership,
            asset_id=asset_id,
            data=data,
        ),
    )


@router.delete("/{asset_id}", response_model=AssetResponseSchema)
def delete_asset(
    asset_id: int,
    manager_membership: AssetDeleterMembership,
    asset_service: AssetService = Depends(get_asset_service),
) -> AssetResponseSchema:
    return AssetResponseSchema(
        success=True,
        message="Asset deleted successfully",
        data=asset_service.delete_asset(
            manager_membership=manager_membership,
            asset_id=asset_id,
        ),
    )
