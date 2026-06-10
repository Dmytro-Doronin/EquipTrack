from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.errors.app_error import raise_app_error
from app.errors.validation_error import raise_validation_error
from app.models.asset import Asset
from app.models.organization_member import OrganizationMember
from app.repositories.command_repositories.asset_command_repository import (
    AssetCommandRepository,
)
from app.repositories.query_repositories.asset_query_repository import (
    AssetQueryRepository,
)
from app.repositories.query_repositories.organization_member_query_repository import (
    OrganizationMemberQueryRepository,
)
from app.schemas.asset import (
    AssetAssignedUserSchema,
    AssetCreateSchema,
    AssetSchema,
    AssetUpdateSchema,
)
from app.utils.format import format_datetime_z


class AssetService:
    def __init__(
        self,
        db: Session,
        asset_command_repository: AssetCommandRepository,
        asset_query_repository: AssetQueryRepository,
        organization_member_query_repository: OrganizationMemberQueryRepository,
    ):
        self.db = db
        self.asset_command_repository = asset_command_repository
        self.asset_query_repository = asset_query_repository
        self.organization_member_query_repository = organization_member_query_repository

    def create_asset(
        self,
        manager_membership: OrganizationMember,
        data: AssetCreateSchema,
    ) -> AssetSchema:
        self._ensure_assignee_belongs_to_organization(
            assigned_to_user_id=data.assignedToUserId,
            organization_id=manager_membership.organization_id,
        )

        try:
            asset = self.asset_command_repository.create(
                organization_id=manager_membership.organization_id,
                name=data.name,
                category=data.category,
                serial_number=data.serialNumber,
                status=data.status,
                assigned_to_user_id=data.assignedToUserId,
                assigned_at=data.assignedAt,
                due_date=data.dueDate,
                image_url=data.imageUrl,
            )
            self.db.commit()
            self.db.refresh(asset)
        except IntegrityError:
            self.db.rollback()
            raise_validation_error({
                "asset": ["Unable to create asset"],
            })
        except Exception:
            self.db.rollback()
            raise

        return self._to_asset_schema(asset)

    def update_asset(
        self,
        manager_membership: OrganizationMember,
        asset_id: int,
        data: AssetUpdateSchema,
    ) -> AssetSchema:
        asset = self.asset_query_repository.find_by_id(asset_id)

        if asset is None or asset.organization_id != manager_membership.organization_id:
            raise_app_error("Asset not found", status_code=404)

        update_data = data.model_dump(exclude_unset=True)

        if "assignedToUserId" in update_data:
            self._ensure_assignee_belongs_to_organization(
                assigned_to_user_id=data.assignedToUserId,
                organization_id=manager_membership.organization_id,
            )

        try:
            asset = self.asset_command_repository.update(
                asset=asset,
                values=self._to_asset_update_values(update_data),
            )
            self.db.commit()
            self.db.refresh(asset)
        except IntegrityError:
            self.db.rollback()
            raise_validation_error({
                "asset": ["Unable to update asset"],
            })
        except Exception:
            self.db.rollback()
            raise

        return self._to_asset_schema(asset)

    def _ensure_assignee_belongs_to_organization(
        self,
        assigned_to_user_id: int | None,
        organization_id: int,
    ) -> None:
        if assigned_to_user_id is None:
            return

        membership = (
            self.organization_member_query_repository.find_active_by_user_and_organization(
                user_id=assigned_to_user_id,
                organization_id=organization_id,
            )
        )

        if membership is None:
            raise_validation_error({
                "assignedToUserId": [
                    "Assigned user must be an active member of this organization",
                ],
            })

    def _to_asset_update_values(self, update_data: dict[str, object]) -> dict[str, object]:
        field_mapping = {
            "assignedAt": "assigned_at",
            "assignedToUserId": "assigned_to_user_id",
            "category": "category",
            "dueDate": "due_date",
            "imageUrl": "image_url",
            "name": "name",
            "serialNumber": "serial_number",
            "status": "status",
        }

        return {
            field_mapping[field]: value
            for field, value in update_data.items()
            if field in field_mapping
        }

    def _to_asset_schema(self, asset: Asset) -> AssetSchema:
        return AssetSchema(
            id=asset.id,
            organizationId=asset.organization_id,
            name=asset.name,
            category=asset.category,
            serialNumber=asset.serial_number,
            status=asset.status,
            assignedTo=self._to_assigned_user_schema(asset),
            assignedToUserId=asset.assigned_to_user_id,
            assignedAt=format_datetime_z(asset.assigned_at)
            if asset.assigned_at
            else None,
            dueDate=format_datetime_z(asset.due_date) if asset.due_date else None,
            imageUrl=asset.image_url,
            createdAt=format_datetime_z(asset.created_at),
        )

    def _to_assigned_user_schema(
        self,
        asset: Asset,
    ) -> AssetAssignedUserSchema | None:
        if asset.assigned_to_user is None:
            return None

        return AssetAssignedUserSchema(
            id=asset.assigned_to_user.id,
            login=asset.assigned_to_user.login,
        )
